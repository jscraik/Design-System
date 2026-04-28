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

const guidanceScopes = ["error", "warn", "exempt"] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGuidanceScope(value: unknown): value is (typeof guidanceScopes)[number] {
  return (
    typeof value === "string" && guidanceScopes.includes(value as (typeof guidanceScopes)[number])
  );
}

function parseGuidanceConfig(value: unknown): GuidanceConfig {
  if (!isObject(value)) {
    throw new Error("Guidance config must be an object.");
  }

  const config: GuidanceConfig = {};
  if (value.designContract !== undefined) {
    if (!isObject(value.designContract)) {
      throw new Error("Guidance config designContract must be an object when present.");
    }
    if (value.designContract.mode !== undefined && typeof value.designContract.mode !== "string") {
      throw new Error("Guidance config designContract.mode must be a string when present.");
    }
    config.designContract = { mode: value.designContract.mode };
  }

  if (value.scopes !== undefined) {
    if (!isObject(value.scopes)) {
      throw new Error("Guidance config scopes must be an object when present.");
    }
    config.scopes = {};
    for (const scope of guidanceScopes) {
      const globs = value.scopes[scope];
      if (globs === undefined) continue;
      if (!Array.isArray(globs) || !globs.every((glob) => typeof glob === "string")) {
        throw new Error(`Guidance config scopes.${scope} must be an array of strings.`);
      }
      config.scopes[scope] = globs;
    }
  }

  if (value.scopePrecedence !== undefined) {
    if (!Array.isArray(value.scopePrecedence) || !value.scopePrecedence.every(isGuidanceScope)) {
      throw new Error("Guidance config scopePrecedence must be an array of known scope names.");
    }
    config.scopePrecedence = value.scopePrecedence;
  }

  return config;
}

/**
 * Read a UTF-8 text file resolved by joining `rootDir` and `relativePath` and return its contents.
 *
 * @param rootDir - Base directory used to resolve `relativePath`
 * @param relativePath - Path to the file, resolved relative to `rootDir`
 * @returns The file contents as a string
 */
async function readText(rootDir: string, relativePath: string): Promise<string> {
  return readFile(path.join(rootDir, relativePath), "utf8");
}

/**
 * Compute a SHA-256 digest for a file located under a project root.
 *
 * @param rootDir - The base directory against which `relativePath` is resolved
 * @param relativePath - The file path relative to `rootDir` to read and digest
 * @returns An object with `path` equal to `relativePath` and `sha256` set to the file's SHA-256 hex digest
 */
async function digestFile(rootDir: string, relativePath: string): Promise<PrepareSourceDigest> {
  const content = await readText(rootDir, relativePath);
  return {
    path: relativePath,
    sha256: createHash("sha256").update(content).digest("hex"),
  };
}

/**
 * Convert a filesystem path to use POSIX-style forward slashes.
 *
 * @param input - The path string to normalize
 * @returns The input string with platform-specific path separators replaced by `/`
 */
function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

/**
 * Normalize a surface path to a POSIX-style path relative to the given root directory.
 *
 * @param rootDir - The root directory used as the base for resolving `surfacePath`
 * @param surfacePath - A filesystem path to normalize; may be absolute or relative to `rootDir`
 * @returns The normalized POSIX-style path to `surfacePath` relative to `rootDir` (uses `/` as separator)
 */
function normalizeSurfacePath(rootDir: string, surfacePath: string): string {
  const absolutePath = path.isAbsolute(surfacePath) ? surfacePath : path.join(rootDir, surfacePath);
  return toPosixPath(path.relative(rootDir, absolutePath));
}

/**
 * Escapes regular expression metacharacters in a string so it can be used literally in a RegExp.
 *
 * @param input - The string to escape
 * @returns The input string with regex metacharacters (`| \ { } ( ) [ ] ^ $ + ? .`) prefixed with `\`
 */
function escapeRegex(input: string): string {
  return input.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

/**
 * Expands the first brace group in a glob pattern into all possible alternatives.
 *
 * @param glob - A glob string that may contain a single brace group like `{a,b,c}`; other parts of the pattern are preserved.
 * @returns An array of glob strings where the first brace group has been replaced by each comma-separated alternative; if no brace group exists, returns an array containing the original `glob`.
 */
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

/**
 * Convert a glob pattern into a RegExp that matches entire POSIX-style paths.
 *
 * The returned RegExp is anchored to the start and end of the string. In the
 * glob pattern, `**` matches any sequence of characters (including `/`) and
 * `*` matches any sequence of characters except `/`.
 *
 * @param glob - The glob pattern to convert
 * @returns A RegExp that matches strings according to the provided glob
 */
function globToRegex(glob: string): RegExp {
  let pattern = "";
  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index];
    const next = glob[index + 1];
    const afterNext = glob[index + 2];
    if (char === "*" && next === "*" && afterNext === "/") {
      pattern += "(?:.*/)?";
      index += 2;
    } else if (char === "*" && next === "*") {
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

/**
 * Determines whether a POSIX-style surface path matches a glob pattern.
 *
 * @param surfacePath - The POSIX-style path to test (use `/` separators).
 * @param glob - The glob pattern to match against; may include brace groups (`{a,b}`), `*` and `**` wildcards.
 * @returns `true` if `surfacePath` matches `glob`, `false` otherwise.
 */
function matchesGlob(surfacePath: string, glob: string): boolean {
  return expandBraceGroups(glob).some((expanded) => globToRegex(expanded).test(surfacePath));
}

function scoreGlobSpecificity(glob: string): { literalLength: number; wildcardCount: number } {
  const withoutBraceBodies = glob.replace(/\{[^}]*\}/g, "");
  return {
    literalLength: withoutBraceBodies.replace(/[*?]/g, "").length,
    wildcardCount: (withoutBraceBodies.match(/[*?]/g) ?? []).length,
  };
}

/**
 * Determine the guidance-based scope classification for a given surface path.
 *
 * Matches the surface path against the guidance `scopes` using the configured
 * `scopePrecedence` (or the default precedence ["error","warn","exempt"]). If a
 * match is found for the `error` scope the function returns `protected`; for
 * other matching scopes it returns the matching scope name. If no scopes
 * match, returns `unknown`.
 *
 * @param config - Guidance configuration containing optional `scopes` and `scopePrecedence`
 * @param surfacePath - The surface path to classify (POSIX-style, relative to the project root)
 * @returns One of `protected`, `warn`, `exempt`, or `unknown` indicating the surface scope
 */
function classifySurfaceScope(config: GuidanceConfig, surfacePath: string): PrepareSurfaceScope {
  const precedence = config.scopePrecedence ?? ["error", "warn", "exempt"];
  let bestMatch: {
    scope: "error" | "warn" | "exempt";
    literalLength: number;
    wildcardCount: number;
    precedenceIndex: number;
  } | null = null;

  for (const scope of ["error", "warn", "exempt"] as const) {
    const globs = config.scopes?.[scope] ?? [];
    for (const glob of globs) {
      if (!matchesGlob(surfacePath, glob)) continue;
      const { literalLength, wildcardCount } = scoreGlobSpecificity(glob);
      const precedenceIndex = precedence.indexOf(scope);

      if (
        !bestMatch ||
        wildcardCount < bestMatch.wildcardCount ||
        (wildcardCount === bestMatch.wildcardCount && literalLength > bestMatch.literalLength) ||
        (wildcardCount === bestMatch.wildcardCount &&
          literalLength === bestMatch.literalLength &&
          precedenceIndex < bestMatch.precedenceIndex)
      ) {
        bestMatch = {
          scope,
          literalLength,
          wildcardCount,
          precedenceIndex,
        };
      }
    }
  }

  if (bestMatch) {
    return bestMatch.scope === "error" ? "protected" : bestMatch.scope;
  }

  return "unknown";
}

/**
 * Produce a list of unique strings from `values`, sorted lexicographically.
 *
 * @returns The input strings with duplicates removed, sorted using `String.prototype.localeCompare`.
 */
function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

/**
 * Filter validation commands to those classified as `read_only`.
 *
 * @param commands - The list of validation commands to filter
 * @returns The subset of `commands` whose `safetyClass` equals `"read_only"`
 */
function onlyReadOnly(commands: AgentUiRouteValidationCommand[]): AgentUiRouteValidationCommand[] {
  return commands.filter((command) => command.safetyClass === "read_only");
}

/**
 * Convert routing diagnostics and surface scope into prepare open decisions.
 *
 * @param routeResult - The result returned by `resolveRouteForSurface`, whose `diagnostics` are converted into decisions
 * @param surfaceScope - The classified scope for the surface; when `"unknown"`, an additional error decision is appended
 * @returns An array of `PrepareOpenDecision` objects derived from the routing diagnostics; includes an `E_DESIGN_SURFACE_SCOPE_UNKNOWN` error decision if `surfaceScope` is `"unknown"`
 */
function routeDecisions(
  routeResult: ReturnType<typeof resolveRouteForSurface>,
  surfaceScope: PrepareSurfaceScope,
): PrepareOpenDecision[] {
  const decisions: PrepareOpenDecision[] = routeResult.diagnostics.map((diagnostic) => ({
    code: diagnostic.code,
    message: diagnostic.message,
    severity: diagnostic.code === "E_DESIGN_ROUTE_EXAMPLE_MISSING" ? "warn" : "error",
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

/**
 * Builds a prepare payload for a given UI surface that aggregates routing, scope classification,
 * design contract provenance, computed source digests, route-derived recommendations, open decisions,
 * and deterministic source metadata.
 *
 * @param surfacePath - Path to the UI surface to prepare; may be absolute or relative to `rootDir`
 * @param rootDir - Root directory against which to resolve `surfacePath` and locate design/guidance files (defaults to process.cwd())
 * @returns A PreparePayload object containing metadata, recommended routes, required/forbidden/example data, validation commands, provenance and source digests, and open decisions
 * @throws Error if required source digests (coverage matrix or component lifecycle) cannot be found
 */
export async function buildPreparePayload(
  surfacePath: string,
  rootDir = process.cwd(),
): Promise<PreparePayload> {
  const resolvedRoot = path.resolve(rootDir);
  const normalizedSurfacePath = normalizeSurfacePath(resolvedRoot, surfacePath);
  const [designSource, guidanceSource] = await Promise.all([
    readText(resolvedRoot, designPath),
    readText(resolvedRoot, guidancePath),
  ]);
  let parsedGuidance: unknown;
  try {
    parsedGuidance = JSON.parse(guidanceSource) as unknown;
  } catch {
    throw new Error("Guidance config contains invalid JSON.");
  }
  const guidance = parseGuidanceConfig(parsedGuidance);
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
  };
}

/**
 * Serialize a PreparePayload into a deterministic, human-readable JSON string.
 *
 * The output uses stable key ordering, two-space indentation, and ends with a single trailing newline.
 *
 * @param payload - The prepare payload to serialize
 * @returns The pretty-printed JSON representation of `payload` with deterministic key ordering and a trailing newline
 */
export function serializePreparePayload(payload: PreparePayload): string {
  return `${JSON.stringify(sortJson(payload), null, 2)}\n`;
}

/**
 * Produce a structurally equivalent value with object keys sorted for deterministic serialization.
 *
 * Recursively sorts keys of plain objects using localeCompare; arrays are preserved element order and primitives/null are returned as-is.
 *
 * @param value - The JSON-like input (objects, arrays, primitives, or null)
 * @returns A value equivalent to `value` where all object keys are sorted lexicographically
 */
function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, sortJson(entry)]),
  );
}
