import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { parseDesignContract } from "./parser.js";
import { resolveRouteForSurface } from "./routes.js";
import { buildDesignTokenContract } from "./token-contract.js";
import type {
  AgentUiRouteValidationCommand,
  PrepareOpenDecision,
  PreparePayload,
  PrepareSourceDigest,
  PrepareSurfaceScope,
} from "./types.js";
import { DesignEngineError } from "./types.js";

const designPath = "DESIGN.md";
const guidancePath = ".design-system-guidance.json";
const routingPath = "docs/design-system/AGENT_UI_ROUTING.json";
const lifecyclePath = "docs/design-system/COMPONENT_LIFECYCLE.json";
const coveragePath = "docs/design-system/COVERAGE_MATRIX.json";
const professionalContractPath = "docs/design-system/PROFESSIONAL_UI_CONTRACT.md";

type GuidanceConfig = {
  designContract?: {
    mode?: GuidanceDesignMode;
  };
  scopes?: Partial<Record<"error" | "warn" | "exempt", string[]>>;
  scopePrecedence?: Array<"error" | "warn" | "exempt">;
};

const guidanceScopes = ["error", "warn", "exempt"] as const;
type GuidanceScope = (typeof guidanceScopes)[number];
type GuidanceDesignMode = "legacy" | "design-md";
const designModes = new Set<GuidanceDesignMode>(["legacy", "design-md"]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGuidanceScope(value: unknown): value is (typeof guidanceScopes)[number] {
  return (
    typeof value === "string" && guidanceScopes.includes(value as (typeof guidanceScopes)[number])
  );
}

function isGuidanceDesignMode(value: unknown): value is GuidanceDesignMode {
  return typeof value === "string" && designModes.has(value as GuidanceDesignMode);
}

function normalizeScopePrecedence(scopes: GuidanceScope[]): GuidanceScope[] {
  const deduped = Array.from(new Set(scopes));
  for (const scope of guidanceScopes) {
    if (!deduped.includes(scope)) {
      deduped.push(scope);
    }
  }
  return deduped;
}

function guidanceSchemaError(message: string): DesignEngineError {
  return new DesignEngineError(message, {
    code: "E_DESIGN_GUIDANCE_SCHEMA",
    exitCode: 2,
  });
}

function parseGuidanceConfig(value: unknown): GuidanceConfig {
  if (!isObject(value)) {
    throw guidanceSchemaError("Guidance config must be an object.");
  }

  const config: GuidanceConfig = {};
  if (value.designContract !== undefined) {
    if (!isObject(value.designContract)) {
      throw guidanceSchemaError("Guidance config designContract must be an object when present.");
    }
    if (
      value.designContract.mode !== undefined &&
      !isGuidanceDesignMode(value.designContract.mode)
    ) {
      throw guidanceSchemaError(
        "Guidance config designContract.mode must be one of: legacy, design-md.",
      );
    }
    config.designContract = { mode: value.designContract.mode };
  }

  if (value.scopes !== undefined) {
    if (!isObject(value.scopes)) {
      throw guidanceSchemaError("Guidance config scopes must be an object when present.");
    }
    config.scopes = {};
    for (const scope of Object.keys(value.scopes)) {
      if (!isGuidanceScope(scope)) {
        throw guidanceSchemaError(`Guidance config scopes.${scope} is not a known scope name.`);
      }
    }
    for (const scope of guidanceScopes) {
      const globs = value.scopes[scope];
      if (globs === undefined) continue;
      if (!Array.isArray(globs) || !globs.every((glob) => typeof glob === "string")) {
        throw guidanceSchemaError(`Guidance config scopes.${scope} must be an array of strings.`);
      }
      config.scopes[scope] = globs;
    }
  }

  if (value.scopePrecedence !== undefined) {
    if (!Array.isArray(value.scopePrecedence) || !value.scopePrecedence.every(isGuidanceScope)) {
      throw guidanceSchemaError(
        "Guidance config scopePrecedence must be an array of known scope names.",
      );
    }
    config.scopePrecedence = normalizeScopePrecedence(value.scopePrecedence);
  }

  return config;
}

/**
 * Read a UTF-8 text file resolved by joining `rootDir` and `relativePath` and return its contents.
 *
 * @param rootDir - Base directory used to resolve `relativePath`
 * @param relativePath - Path to the file, resolved relative to `rootDir`
 * @param signal - Optional cancellation signal checked before and after the file read
 * @returns The file contents as a string
 */
async function readText(
  rootDir: string,
  relativePath: string,
  signal?: AbortSignal,
): Promise<string> {
  signal?.throwIfAborted();
  const content = await readFile(path.join(rootDir, relativePath), "utf8");
  signal?.throwIfAborted();
  return content;
}

/**
 * Compute a SHA-256 digest for a file located under a project root.
 *
 * @param rootDir - The base directory against which `relativePath` is resolved
 * @param relativePath - The file path relative to `rootDir` to read and digest
 * @param signal - Optional cancellation signal checked before and after the digest read
 * @returns An object with `path` equal to `relativePath` and `sha256` set to the file's SHA-256 hex digest
 */
async function digestFile(
  rootDir: string,
  relativePath: string,
  signal?: AbortSignal,
): Promise<PrepareSourceDigest> {
  let content = "";
  try {
    content = await readText(rootDir, relativePath, signal);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    throw new DesignEngineError(`Prepare payload source digest is missing: ${relativePath}`, {
      code: "E_DESIGN_SOURCE_DIGEST_MISSING",
      exitCode: 2,
    });
  }
  signal?.throwIfAborted();
  return {
    path: relativePath,
    sha256: createHash("sha256").update(content).digest("hex"),
  };
}

async function readPrepareSource(
  rootDir: string,
  relativePath: string,
  code: string,
  signal?: AbortSignal,
): Promise<string> {
  try {
    return await readText(rootDir, relativePath, signal);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    const detail = error instanceof Error ? ` ${error.message}` : "";
    throw new DesignEngineError(
      `Prepare payload source is missing or unreadable: ${relativePath}.${detail}`,
      {
        code,
        exitCode: 2,
      },
    );
  }
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
 * `*` matches any sequence of characters except `/`, while `?` matches a single
 * character except `/`.
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
    } else if (char === "?") {
      pattern += "[^/]";
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
 * @param glob - The glob pattern to match against; may include brace groups (`{a,b}`), `*`, `?`, and `**` wildcards.
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

function commandTokens(command: string): string[] {
  return command.trim().split(/\s+/).filter(Boolean);
}

function invalidValidationCommand(command: string, message: string): DesignEngineError {
  return new DesignEngineError(`${message}: ${command}`, {
    code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
    exitCode: 2,
  });
}

const pnpmSubcommands = new Set([
  "add",
  "approve-builds",
  "audit",
  "config",
  "deploy",
  "dlx",
  "env",
  "export",
  "exec",
  "fetch",
  "help",
  "import",
  "init",
  "install",
  "licenses",
  "link",
  "list",
  "ls",
  "outdated",
  "patch",
  "publish",
  "rebuild",
  "remove",
  "rm",
  "root",
  "setup",
  "store",
  "uninstall",
  "unlink",
  "update",
  "why",
]);

const pnpmRunOptionsWithValues = new Set([
  "--changed-files-ignore-pattern",
  "--filter-omit-pkg-dep",
  "--loglevel",
  "--resume-from",
  "--test-pattern",
  "--workspace-concurrency",
]);

interface InferredPackageScript {
  packageDir: string;
  script: string;
}

function normalizePackageDir(command: string, packageDir: string | undefined): string {
  if (!packageDir || packageDir.startsWith("-")) {
    throw invalidValidationCommand(
      command,
      "Validation command has an invalid pnpm package directory",
    );
  }
  return packageDir;
}

function unsupportedPnpmFilter(command: string): DesignEngineError {
  return invalidValidationCommand(
    command,
    "Validation command uses unsupported pnpm filter selectors",
  );
}

function readPnpmRunScript(
  command: string,
  tokens: string[],
  startIndex: number,
  initialPackageDir: string,
): InferredPackageScript {
  let packageDir = initialPackageDir;
  for (let index = startIndex; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === "-C" || token === "--dir") {
      const value = tokens[index + 1];
      packageDir = normalizePackageDir(command, value);
      index += 1;
      continue;
    }
    if (token.startsWith("--dir=")) {
      packageDir = normalizePackageDir(command, token.slice("--dir=".length));
      continue;
    }
    if (token === "--workspace-root" || token === "-w") {
      packageDir = ".";
      continue;
    }
    if (
      token === "--filter" ||
      token === "-F" ||
      token === "--filter-prod" ||
      token === "--filter-omit-pkg-dep" ||
      token.startsWith("--filter=") ||
      token.startsWith("--filter-prod=") ||
      token.startsWith("--filter-omit-pkg-dep=")
    ) {
      throw unsupportedPnpmFilter(command);
    }
    if (pnpmRunOptionsWithValues.has(token)) {
      index += 1;
      continue;
    }
    if (token.startsWith("-")) {
      continue;
    }
    if (pnpmSubcommands.has(token)) {
      throw invalidValidationCommand(command, "Validation command does not name a package script");
    }
    return { packageDir, script: token };
  }

  throw invalidValidationCommand(command, "Validation command does not name a package script");
}

function inferPackageScript(command: string): InferredPackageScript | undefined {
  const tokens = commandTokens(command);
  if (tokens[0] !== "pnpm") {
    return undefined;
  }

  let packageDir = ".";
  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === "run") {
      return readPnpmRunScript(command, tokens, index + 1, packageDir);
    }
    if (token === "--workspace-root" || token === "-w") {
      packageDir = ".";
      continue;
    }
    if (token === "-C" || token === "--dir") {
      const value = tokens[index + 1];
      packageDir = normalizePackageDir(command, value);
      index += 1;
      continue;
    }
    if (token.startsWith("--dir=")) {
      packageDir = normalizePackageDir(command, token.slice("--dir=".length));
      continue;
    }
    if (
      token === "--filter" ||
      token === "-F" ||
      token === "--filter-prod" ||
      token === "--filter-omit-pkg-dep" ||
      token.startsWith("--filter=") ||
      token.startsWith("--filter-prod=") ||
      token.startsWith("--filter-omit-pkg-dep=")
    ) {
      throw unsupportedPnpmFilter(command);
    }
    if (token.startsWith("-")) {
      continue;
    }
    if (pnpmSubcommands.has(token)) {
      throw invalidValidationCommand(
        command,
        "Validation command uses unsupported pnpm subcommand",
      );
    }
    return {
      packageDir,
      script: token,
    };
  }

  throw invalidValidationCommand(command, "Validation command does not name a package script");
}

function isWithinDirectory(rootDir: string, candidateDir: string): boolean {
  const relative = path.relative(rootDir, candidateDir);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function resolvePackageJsonPath(rootDir: string, packageDir: string): Promise<string> {
  const resolvedRoot = path.resolve(rootDir);
  const resolvedPackageDir = path.resolve(resolvedRoot, packageDir);
  if (
    resolvedPackageDir !== resolvedRoot &&
    !resolvedPackageDir.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    throw new DesignEngineError(
      `Validation command package directory must stay inside the workspace: ${packageDir}`,
      {
        code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
        exitCode: 2,
      },
    );
  }
  let realRoot = "";
  let realPackageDir = "";
  try {
    realRoot = await realpath(resolvedRoot);
    realPackageDir = await realpath(resolvedPackageDir);
  } catch {
    throw new DesignEngineError(`package.json is missing or unreadable: ${packageDir}`, {
      code: "E_DESIGN_PACKAGE_JSON",
      exitCode: 2,
    });
  }
  if (!isWithinDirectory(realRoot, realPackageDir)) {
    throw new DesignEngineError(
      `Validation command package directory must stay inside the workspace: ${packageDir}`,
      {
        code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
        exitCode: 2,
      },
    );
  }
  return path.join(resolvedPackageDir, "package.json");
}

async function loadPackageScripts(
  rootDir: string,
  packageDir = ".",
  signal?: AbortSignal,
): Promise<Set<string>> {
  signal?.throwIfAborted();
  const packageJsonPath = await resolvePackageJsonPath(rootDir, packageDir);
  let raw = "";
  try {
    raw = await readFile(packageJsonPath, { encoding: "utf8", signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    throw new DesignEngineError(`package.json is missing or unreadable: ${packageDir}`, {
      code: "E_DESIGN_PACKAGE_JSON",
      exitCode: 2,
    });
  }
  signal?.throwIfAborted();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new DesignEngineError(`package.json contains invalid JSON: ${packageDir}`, {
      code: "E_DESIGN_PACKAGE_JSON",
      exitCode: 2,
    });
  }
  if (!isObject(parsed)) {
    throw new DesignEngineError(`package.json must be an object: ${packageDir}`, {
      code: "E_DESIGN_PACKAGE_JSON",
      exitCode: 2,
    });
  }
  if (parsed.scripts === undefined) {
    return new Set();
  }
  if (!isObject(parsed.scripts)) {
    throw new DesignEngineError(`package.json scripts must be an object: ${packageDir}`, {
      code: "E_DESIGN_PACKAGE_JSON",
      exitCode: 2,
    });
  }
  const scripts = new Set<string>();
  for (const [scriptName, scriptValue] of Object.entries(parsed.scripts)) {
    if (typeof scriptValue !== "string" || scriptValue.trim().length === 0) {
      throw new DesignEngineError(
        `package.json script must be a non-empty string: ${packageDir}#${scriptName}`,
        {
          code: "E_DESIGN_PACKAGE_JSON",
          exitCode: 2,
        },
      );
    }
    scripts.add(scriptName);
  }
  return scripts;
}

async function normalizeValidationCommands(
  commands: AgentUiRouteValidationCommand[],
  rootDir: string,
  signal?: AbortSignal,
): Promise<AgentUiRouteValidationCommand[]> {
  const packageScriptCache = new Map<string, Set<string>>();
  const getPackageScripts = async (packageDir: string): Promise<Set<string>> => {
    const cached = packageScriptCache.get(packageDir);
    if (cached) {
      return cached;
    }
    const scripts = await loadPackageScripts(rootDir, packageDir, signal);
    packageScriptCache.set(packageDir, scripts);
    return scripts;
  };
  const normalized: AgentUiRouteValidationCommand[] = [];

  for (const command of commands) {
    const inferred = inferPackageScript(command.command);
    if (command.packageScript && inferred && command.packageScript !== inferred.script) {
      throw new DesignEngineError(
        `Validation command packageScript does not match command text: ${command.packageScript} != ${inferred.script}`,
        {
          code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
          exitCode: 2,
        },
      );
    }

    const packageScript = command.packageScript ?? inferred?.script;
    if (
      packageScript &&
      !(await getPackageScripts(inferred?.packageDir ?? ".")).has(packageScript)
    ) {
      throw new DesignEngineError(
        `Validation command references missing package script: ${packageScript}`,
        {
          code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
          exitCode: 2,
        },
      );
    }

    normalized.push({
      ...command,
      ...(packageScript ? { packageScript } : {}),
      expectedOutcome: command.expectedOutcome ?? "Command exits 0 without mutating source files.",
      timeoutClass: command.timeoutClass ?? "medium",
    });
  }

  return normalized;
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
    severity: "error",
    nextAction: nextActionForOpenDecision(diagnostic.code),
  }));

  if (surfaceScope === "unknown") {
    decisions.push({
      code: "E_DESIGN_SURFACE_SCOPE_UNKNOWN",
      message: "Surface is outside configured protected, warn, and exempt guidance scopes.",
      severity: "error",
      nextAction: "escalate",
    });
  }

  return decisions;
}

function nextActionForOpenDecision(code: string): PrepareOpenDecision["nextAction"] {
  if (code === "E_DESIGN_ROUTE_AMBIGUOUS" || code === "E_DESIGN_SURFACE_SCOPE_UNKNOWN") {
    return "escalate";
  }

  if (
    code === "E_DESIGN_ROUTE_MISSING" ||
    code === "E_DESIGN_ROUTE_EXAMPLE_MISSING" ||
    code === "E_DESIGN_ROUTE_DEPRECATED"
  ) {
    return "stop";
  }

  return "diagnose";
}

function designContractModeFromSchema(schemaVersion: string): GuidanceDesignMode {
  if (schemaVersion === "agent-design.v1") {
    return "design-md";
  }
  return "legacy";
}

function assertGuidanceContractMode(
  guidance: GuidanceConfig,
  schemaVersion: string,
): GuidanceDesignMode {
  const actualMode = designContractModeFromSchema(schemaVersion);
  const declaredMode = guidance.designContract?.mode ?? "legacy";
  if (declaredMode !== actualMode) {
    throw new DesignEngineError(
      `Guidance config designContract.mode (${declaredMode}) does not match DESIGN.md schemaVersion ${schemaVersion} (${actualMode}).`,
      {
        code: "E_DESIGN_CONTRACT_MODE_MISMATCH",
        exitCode: 2,
      },
    );
  }
  return actualMode;
}

/**
 * Builds a prepare payload for a given UI surface that aggregates routing, scope classification,
 * design contract provenance, computed source digests, route-derived recommendations, open decisions,
 * and deterministic source metadata.
 *
 * @param surfacePath - Path to the UI surface to prepare; may be absolute or relative to `rootDir`
 * @param rootDir - Root directory against which to resolve `surfacePath` and locate design/guidance files (defaults to process.cwd())
 * @param signal - Optional cancellation signal for callers that need to abort repository I/O
 * @returns A PreparePayload object containing metadata, recommended routes, required/forbidden/example data, validation commands, provenance and source digests, and open decisions
 * @throws Error if required source digests (coverage matrix or component lifecycle) cannot be found
 */
export async function buildPreparePayload(
  surfacePath: string,
  rootDir = process.cwd(),
  signal?: AbortSignal,
): Promise<PreparePayload> {
  const startedAt = new Date();
  const startedMs = performance.now();
  signal?.throwIfAborted();
  const resolvedRoot = path.resolve(rootDir);
  const normalizedSurfacePath = normalizeSurfacePath(resolvedRoot, surfacePath);
  const [designSource, guidanceSource] = await Promise.all([
    readPrepareSource(resolvedRoot, designPath, "E_DESIGN_CONTRACT_SOURCE_MISSING", signal),
    readPrepareSource(resolvedRoot, guidancePath, "E_DESIGN_GUIDANCE_SOURCE_MISSING", signal),
  ]);
  signal?.throwIfAborted();
  let parsedGuidance: unknown;
  try {
    parsedGuidance = JSON.parse(guidanceSource) as unknown;
  } catch {
    throw new DesignEngineError("Guidance config contains invalid JSON.", {
      code: "E_DESIGN_GUIDANCE_JSON",
      exitCode: 2,
    });
  }
  const guidance = parseGuidanceConfig(parsedGuidance);
  const sourceDigests = await Promise.all(
    [
      designPath,
      guidancePath,
      routingPath,
      lifecyclePath,
      coveragePath,
      professionalContractPath,
    ].map((sourcePath) => digestFile(resolvedRoot, sourcePath, signal)),
  );
  signal?.throwIfAborted();
  const contract = await parseDesignContract(designSource, {
    rootDir: resolvedRoot,
    filePath: path.join(resolvedRoot, designPath),
  });
  const designContractMode = assertGuidanceContractMode(guidance, contract.schemaVersion);
  const designTokenContract = await buildDesignTokenContract(resolvedRoot, signal);
  signal?.throwIfAborted();
  const routeResult = resolveRouteForSurface(normalizedSurfacePath, resolvedRoot);
  const route = routeResult.route;
  const surfaceScope = classifySurfaceScope(guidance, normalizedSurfacePath);
  const coverageMatrixDigest = sourceDigests.find((digest) => digest.path === coveragePath);
  const componentLifecycleDigest = sourceDigests.find((digest) => digest.path === lifecyclePath);
  if (!coverageMatrixDigest || !componentLifecycleDigest) {
    throw new DesignEngineError("Prepare payload source digests are incomplete.", {
      code: "E_DESIGN_SOURCE_DIGEST_MISSING",
      exitCode: 2,
    });
  }

  const recommendedRoutes = route
    ? [
        {
          ...route,
          validationCommands: await normalizeValidationCommands(
            onlyReadOnly(route.validationCommands),
            resolvedRoot,
            signal,
          ),
        },
      ]
    : [];
  const requiredStates = uniqueSorted(recommendedRoutes.flatMap((entry) => entry.requiredStates));
  const forbiddenPatterns = uniqueSorted(recommendedRoutes.flatMap((entry) => entry.avoid));
  const relevantExamples = uniqueSorted(recommendedRoutes.flatMap((entry) => entry.examples));
  const validationCommands = recommendedRoutes.flatMap((entry) => entry.validationCommands);
  const openDecisions = routeDecisions(routeResult, surfaceScope);
  const ok = openDecisions.every((decision) => decision.severity !== "error");

  return {
    kind: "astudio.design.prepare.v1",
    ok,
    safeForAutomaticImplementation: ok && surfaceScope !== "unknown",
    resolvedDesignFile: designPath,
    guidanceConfigPath: guidancePath,
    designContractMode,
    surfacePath: normalizedSurfacePath,
    surfaceScope,
    surfaceKind: route?.canonicalNeed ?? "unknown",
    recommendedRoutes,
    designTokenContract,
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
      startedAt: startedAt.toISOString(),
      durationMs: Math.round(performance.now() - startedMs),
    },
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
