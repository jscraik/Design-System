import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseDesignContract } from "./parser.js";
import { resolveRouteForSurface } from "./routes.js";
import type {
  AgentUiRouteValidationCommand,
  PrepareOpenDecision,
  PreparePayload,
  PrepareSourceDigest,
  PrepareSurfaceScope,
} from "./types.js";

const designPath = "DESIGN.md";
const guidancePath = ".design-system-guidance.json";
const routingPath = "docs/design-system/AGENT_UI_ROUTING.json";
const lifecyclePath = "docs/design-system/COMPONENT_LIFECYCLE.json";
const coveragePath = "docs/design-system/COVERAGE_MATRIX.json";
const professionalContractPath = "docs/design-system/PROFESSIONAL_UI_CONTRACT.md";

type GuidanceConfig = {
  designContract?: {
    mode?: string;
  };
  scopes?: Partial<Record<"error" | "warn" | "exempt", string[]>>;
  scopePrecedence?: Array<"error" | "warn" | "exempt">;
};

async function readText(rootDir: string, relativePath: string): Promise<string> {
  return readFile(path.join(rootDir, relativePath), "utf8");
}

async function digestFile(rootDir: string, relativePath: string): Promise<PrepareSourceDigest> {
  const content = await readText(rootDir, relativePath);
  return {
    path: relativePath,
    sha256: createHash("sha256").update(content).digest("hex"),
  };
}

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function normalizeSurfacePath(rootDir: string, surfacePath: string): string {
  const absolutePath = path.isAbsolute(surfacePath) ? surfacePath : path.join(rootDir, surfacePath);
  return toPosixPath(path.relative(rootDir, absolutePath));
}

function escapeRegex(input: string): string {
  return input.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function expandBraceGroups(glob: string): string[] {
  const match = /\{([^{}]+)\}/.exec(glob);
  if (!match) return [glob];
  return match[1]
    .split(",")
    .flatMap((part) =>
      expandBraceGroups(
        `${glob.slice(0, match.index)}${part}${glob.slice(match.index + match[0].length)}`,
      ),
    );
}

function globToRegex(glob: string): RegExp {
  let pattern = "";
  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index];
    const next = glob[index + 1];
    if (char === "*" && next === "*") {
      pattern += ".*";
      index += 1;
    } else if (char === "*") {
      pattern += "[^/]*";
    } else {
      pattern += escapeRegex(char);
    }
  }
  return new RegExp(`^${pattern}$`);
}

function matchesGlob(surfacePath: string, glob: string): boolean {
  return expandBraceGroups(glob).some((expanded) => globToRegex(expanded).test(surfacePath));
}

function classifySurfaceScope(config: GuidanceConfig, surfacePath: string): PrepareSurfaceScope {
  const precedence = config.scopePrecedence ?? ["error", "warn", "exempt"];
  for (const scope of precedence) {
    const globs = config.scopes?.[scope] ?? [];
    if (globs.some((glob) => matchesGlob(surfacePath, glob))) {
      return scope === "error" ? "protected" : scope;
    }
  }
  return "unknown";
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function onlyReadOnly(commands: AgentUiRouteValidationCommand[]): AgentUiRouteValidationCommand[] {
  return commands.filter((command) => command.safetyClass === "read_only");
}

function routeDecisions(
  routeResult: ReturnType<typeof resolveRouteForSurface>,
  surfaceScope: PrepareSurfaceScope,
): PrepareOpenDecision[] {
  const decisions: PrepareOpenDecision[] = routeResult.diagnostics.map((diagnostic) => ({
    code: diagnostic.code,
    message: diagnostic.message,
    severity: "error" as const,
  }));

  if (surfaceScope === "unknown") {
    decisions.push({
      code: "E_DESIGN_SURFACE_SCOPE_UNKNOWN",
      message: "Surface is outside configured protected, warn, and exempt guidance scopes.",
      severity: "error",
    });
  }

  return decisions;
}

export async function buildPreparePayload(
  surfacePath: string,
  rootDir = process.cwd(),
): Promise<PreparePayload> {
  const started = Date.now();
  const resolvedRoot = path.resolve(rootDir);
  const normalizedSurfacePath = normalizeSurfacePath(resolvedRoot, surfacePath);
  const [designSource, guidanceSource] = await Promise.all([
    readText(resolvedRoot, designPath),
    readText(resolvedRoot, guidancePath),
  ]);
  const guidance = JSON.parse(guidanceSource) as GuidanceConfig;
  const contract = await parseDesignContract(designSource, {
    rootDir: resolvedRoot,
    filePath: path.join(resolvedRoot, designPath),
  });
  const routeResult = resolveRouteForSurface(normalizedSurfacePath, resolvedRoot);
  const route = routeResult.route;
  const surfaceScope = classifySurfaceScope(guidance, normalizedSurfacePath);
  const sourceDigests = await Promise.all(
    [
      designPath,
      guidancePath,
      routingPath,
      lifecyclePath,
      coveragePath,
      professionalContractPath,
    ].map((sourcePath) => digestFile(resolvedRoot, sourcePath)),
  );
  const coverageMatrixDigest = sourceDigests.find((digest) => digest.path === coveragePath);
  const componentLifecycleDigest = sourceDigests.find((digest) => digest.path === lifecyclePath);
  if (!coverageMatrixDigest || !componentLifecycleDigest) {
    throw new Error("Prepare payload source digests are incomplete.");
  }

  const recommendedRoutes = route ? [route] : [];
  const requiredStates = uniqueSorted(recommendedRoutes.flatMap((entry) => entry.requiredStates));
  const forbiddenPatterns = uniqueSorted(recommendedRoutes.flatMap((entry) => entry.avoid));
  const relevantExamples = uniqueSorted(recommendedRoutes.flatMap((entry) => entry.examples));
  const validationCommands = recommendedRoutes.flatMap((entry) =>
    onlyReadOnly(entry.validationCommands),
  );
  const openDecisions = routeDecisions(routeResult, surfaceScope);
  const ok = openDecisions.every((decision) => decision.severity !== "error");

  return {
    kind: "astudio.design.prepare.v1",
    ok,
    safeForAutomaticImplementation: ok && surfaceScope !== "unknown",
    resolvedDesignFile: designPath,
    guidanceConfigPath: guidancePath,
    designContractMode: guidance.designContract?.mode ?? "legacy",
    surfacePath: normalizedSurfacePath,
    surfaceScope,
    surfaceKind: route?.canonicalNeed ?? "unknown",
    recommendedRoutes,
    requiredStates,
    forbiddenPatterns,
    relevantExamples,
    validationCommands,
    ruleManifestVersion: contract.provenance.ruleManifestVersion,
    rulePackVersion: contract.provenance.rulePackVersion,
    ruleSourceDigests: contract.provenance.ruleSourceDigests,
    sourceDigests: sourceDigests.sort((left, right) => left.path.localeCompare(right.path)),
    coverageMatrixDigest,
    componentLifecycleDigest,
    openDecisions,
    timing: {
      startedAt: new Date(started).toISOString(),
      durationMs: Date.now() - started,
    },
  };
}

export function serializePreparePayload(payload: PreparePayload): string {
  return `${JSON.stringify(sortJson(payload), null, 2)}\n`;
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, sortJson(entry)]),
  );
}
