import { createHash } from "node:crypto";
import { readdir, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { parseDesignContract } from "./parser.js";
import { loadAgentUiRoutingTable, resolveRouteForSurface } from "./routes.js";
import { buildDesignTokenContract } from "./token-contract.js";
import type {
  AgentUiRouteValidationCommand,
  DesignTokenContract,
  PrepareDoNotInventGuidance,
  PrepareExampleUsageGuidance,
  PrepareNextAction,
  PrepareOpenDecision,
  PreparePayload,
  PrepareRouteConfidence,
  PrepareRouteDiagnostics,
  PrepareRouteParityReport,
  PrepareRouteRecommendation,
  PrepareSourceDigest,
  PrepareStopCategory,
  PrepareStopClassification,
  PrepareSurfaceScope,
  PrepareValidationCommand,
  ResolvedAgentUiRoute,
} from "./types.js";
import { DesignEngineError } from "./types.js";

const designPath = "DESIGN.md";
const guidancePath = ".design-system-guidance.json";
const routingPath = "docs/design-system/AGENT_UI_ROUTING.json";
const goldExamplesPath = "docs/design-system/GOLD_EXAMPLES.json";
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

type GoldExample = {
  sourcePath: string;
  purpose: string;
  coveredStates: string[];
  deferredStates?: string[];
  promotable?: boolean;
};

type GoldExampleRegistry = Map<string, GoldExample>;

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

/**
 * Produce a canonical precedence list by removing duplicates from `scopes` and ensuring all known scopes appear in the fixed order `["error","warn","exempt"]`.
 *
 * @param scopes - An array of guidance scope names (may contain duplicates or a subset of known scopes)
 * @returns An array containing each input scope once, followed by any missing known scopes in the canonical precedence order
 */
function normalizeScopePrecedence(scopes: GuidanceScope[]): GuidanceScope[] {
  const deduped = Array.from(new Set(scopes));
  for (const scope of guidanceScopes) {
    if (!deduped.includes(scope)) {
      deduped.push(scope);
    }
  }
  return deduped;
}

/**
 * Create a DesignEngineError representing a guidance schema validation failure.
 *
 * @param message - Human-readable error message describing the schema problem
 * @returns A DesignEngineError with code `E_DESIGN_GUIDANCE_SCHEMA` and `exitCode: 2`
 */
function guidanceSchemaError(message: string): DesignEngineError {
  return new DesignEngineError(message, {
    code: "E_DESIGN_GUIDANCE_SCHEMA",
    exitCode: 2,
  });
}

/**
 * Parses and validates a guidance configuration object.
 *
 * Produces a sanitized GuidanceConfig containing any of:
 * - `designContract` with an optional validated `mode`
 * - `scopes` mapping known scope names to arrays of glob strings
 * - `scopePrecedence` normalized to the canonical precedence order
 *
 * @returns A validated and partially populated `GuidanceConfig`.
 * @throws DesignEngineError with code `E_DESIGN_GUIDANCE_SCHEMA` when the input is not an object or when any field is malformed, including:
 * - root value is not an object
 * - `designContract` is present but not an object
 * - `designContract.mode` is present but not one of `legacy` or `design-md`
 * - `scopes` is present but not an object
 * - a `scopes` key is not a known scope name
 * - a `scopes.<scope>` value is not an array of strings
 * - `scopePrecedence` is present but not an array of known scope names
 */
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

function goldExampleSchemaError(message: string): DesignEngineError {
  return new DesignEngineError(message, {
    code: "E_DESIGN_GOLD_EXAMPLES_SCHEMA",
    exitCode: 2,
  });
}

function parseStringArray(value: unknown, fieldPath: string): string[] {
  if (
    !Array.isArray(value) ||
    !value.every((entry) => typeof entry === "string" && entry.trim().length > 0)
  ) {
    throw goldExampleSchemaError(`${fieldPath} must be an array of non-empty strings.`);
  }
  return value.map((entry) => entry.trim());
}

function parseGoldExamples(value: unknown): GoldExampleRegistry {
  if (!isObject(value)) {
    throw goldExampleSchemaError("Gold examples registry must be an object.");
  }
  if (!Array.isArray(value.examples)) {
    throw goldExampleSchemaError("Gold examples registry examples must be an array.");
  }

  const examples: GoldExampleRegistry = new Map();
  for (const [index, entry] of value.examples.entries()) {
    if (!isObject(entry)) {
      throw goldExampleSchemaError(`Gold examples entry ${index} must be an object.`);
    }
    const sourcePath = typeof entry.sourcePath === "string" ? entry.sourcePath.trim() : "";
    if (sourcePath.length === 0) {
      throw goldExampleSchemaError(`Gold examples entry ${index}.sourcePath must be a string.`);
    }
    if (examples.has(sourcePath)) {
      throw goldExampleSchemaError(
        `Gold examples entry ${index}.sourcePath duplicates ${sourcePath}.`,
      );
    }
    const purpose = typeof entry.purpose === "string" ? entry.purpose.trim() : "";
    if (purpose.length === 0) {
      throw goldExampleSchemaError(`Gold examples entry ${index}.purpose must be a string.`);
    }
    const coveredStates = parseStringArray(entry.coveredStates, `examples[${index}].coveredStates`);
    const deferredStates =
      entry.deferredStates === undefined
        ? undefined
        : parseStringArray(entry.deferredStates, `examples[${index}].deferredStates`);
    if (entry.promotable !== undefined && typeof entry.promotable !== "boolean") {
      throw goldExampleSchemaError(`Gold examples entry ${index}.promotable must be a boolean.`);
    }

    examples.set(sourcePath, {
      sourcePath,
      purpose,
      coveredStates,
      ...(deferredStates ? { deferredStates } : {}),
      ...(typeof entry.promotable === "boolean" ? { promotable: entry.promotable } : {}),
    });
  }
  return examples;
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

/**
 * Reads a prepare source file as UTF-8 text and returns its contents.
 *
 * Throws a DesignEngineError using the provided `code` when the file is missing or unreadable.
 *
 * @param rootDir - Workspace root directory used to resolve `relativePath`
 * @param relativePath - Path to the source file relative to `rootDir`
 * @param code - Error code to set on the thrown DesignEngineError when the source is missing or unreadable
 * @param signal - Optional AbortSignal to cancel the operation
 * @returns The file contents decoded as a UTF-8 string
 * @throws DesignEngineError if the file cannot be read (code set to the provided `code`, `exitCode: 2`)
 * @throws AbortError if the operation was aborted via `signal`
 */
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
    throw new DesignEngineError(
      `Prepare payload source is missing or unreadable: ${relativePath}`,
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

function findMatchingGuidancePatterns(
  config: GuidanceConfig,
  surfacePath: string,
): Array<{ scope: GuidanceScope; glob: string }> {
  return guidanceScopes.flatMap((scope) =>
    (config.scopes?.[scope] ?? [])
      .filter((glob) => matchesGlob(surfacePath, glob))
      .map((glob) => ({ scope, glob })),
  );
}

/**
 * Produce a list of unique strings from `values`, sorted lexicographically.
 *
 * @returns The input strings with duplicates removed, sorted using `String.prototype.localeCompare`.
 */
function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

async function listRepositoryFiles(rootDir: string): Promise<string[]> {
  const ignored = new Set([".git", "node_modules", "dist", ".turbo", ".wrangler", ".build"]);
  const files: string[] = [];

  async function visit(relativeDir: string): Promise<void> {
    const absoluteDir = path.join(rootDir, relativeDir);
    const entries = await readdir(absoluteDir, { withFileTypes: true });
    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;
      const relativePath = toPosixPath(path.join(relativeDir, entry.name));
      if (entry.isDirectory()) {
        await visit(relativePath);
      } else if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  }

  await visit("");
  return files.sort((left, right) => left.localeCompare(right));
}

function routeIdsForSurface(
  surfacePath: string,
  routes: ResolvedAgentUiRoute[] | Array<{ canonicalNeed: string; surfacePatterns: string[] }>,
): string[] {
  return uniqueSorted(
    routes
      .filter((route) => route.surfacePatterns.some((pattern) => matchesGlob(surfacePath, pattern)))
      .map((route) => route.canonicalNeed),
  );
}

function routeCandidateDiagnostics(
  surfacePath: string,
  routes: Array<{ canonicalNeed: string; surfacePatterns: string[]; sourceRefs?: string[] }>,
): PrepareRouteDiagnostics["closestRoutes"] {
  const tokens = surfacePath
    .toLowerCase()
    .split(/[/_.-]+/)
    .filter(Boolean);
  return routes
    .map((route) => {
      const haystack = `${route.canonicalNeed} ${route.surfacePatterns.join(" ")}`.toLowerCase();
      const overlappingTokens = tokens.filter(
        (token) => token.length > 3 && haystack.includes(token),
      );
      return {
        routeId: route.canonicalNeed,
        because:
          overlappingTokens.length > 0
            ? [`Shares surface terms: ${uniqueSorted(overlappingTokens).join(", ")}.`]
            : ["No direct pattern match; listed as a low-confidence route-table neighbor."],
        confidence: overlappingTokens.length > 0 ? ("medium" as const) : ("low" as const),
        score: overlappingTokens.length,
      };
    })
    .sort((left, right) => right.score - left.score || left.routeId.localeCompare(right.routeId))
    .slice(0, 3)
    .map(({ routeId, because, confidence }) => ({ routeId, because, confidence }));
}

function buildMissingRouteDiagnostics(
  guidance: GuidanceConfig,
  surfacePath: string,
  rootDir: string,
): PrepareRouteDiagnostics {
  const matchingGuidance = findMatchingGuidancePatterns(guidance, surfacePath);
  const protectedPattern = matchingGuidance.find((entry) => entry.scope === "error");
  const routes = loadAgentUiRoutingTable(rootDir).routes;

  return {
    protectedScopeMatched: Boolean(protectedPattern),
    scopeSource: guidancePath,
    unmatchedSurfacePattern: protectedPattern?.glob ?? surfacePath,
    closestRoutes: routeCandidateDiagnostics(surfacePath, routes),
    candidateFilesToUpdate: [routingPath, goldExamplesPath, lifecyclePath, coveragePath],
  };
}

export async function buildRouteParityReport(
  rootDir = process.cwd(),
  signal?: AbortSignal,
): Promise<PrepareRouteParityReport> {
  signal?.throwIfAborted();
  const resolvedRoot = path.resolve(rootDir);
  const guidanceSource = await readPrepareSource(
    resolvedRoot,
    guidancePath,
    "E_DESIGN_GUIDANCE_SOURCE_MISSING",
    signal,
  );
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
  const routing = loadAgentUiRoutingTable(resolvedRoot);
  const files = await listRepositoryFiles(resolvedRoot);
  const scopePrecedence = guidance.scopePrecedence ?? ["error", "warn", "exempt"];

  const surfaces = guidanceScopes.flatMap((scope) =>
    (guidance.scopes?.[scope] ?? []).map((glob) => {
      const matchingFiles = files.filter((filePath) => matchesGlob(filePath, glob));
      const matchedRouteIds = uniqueSorted(
        matchingFiles.flatMap((filePath) => routeIdsForSurface(filePath, routing.routes)),
      );
      const matchedRoutes = routing.routes.filter((route) =>
        matchedRouteIds.includes(route.canonicalNeed),
      );
      const status: PrepareRouteParityReport["surfaces"][number]["status"] =
        scope === "exempt" ? "exempt" : matchedRouteIds.length > 0 ? "routed" : "uncovered";
      const statusReason =
        status === "routed"
          ? `Matched ${matchedRouteIds.length} route(s) across ${matchingFiles.length} file(s).`
          : status === "exempt"
            ? "Guidance scope is exempt."
            : `No route surface pattern matched ${matchingFiles.length} file(s) for this guidance pattern.`;

      return {
        surfaceFamily: glob,
        guidanceScope: scope,
        guidancePatterns: [glob],
        matchedRouteIds,
        status,
        statusReason,
        intentionalStopSourceRefs: [],
        topExampleRefs: uniqueSorted(matchedRoutes.flatMap((route) => route.examples)).slice(0, 5),
        validationCommands: uniqueSorted(
          matchedRoutes.flatMap((route) =>
            route.validationCommands.map((command) => command.command),
          ),
        ),
      };
    }),
  );

  return {
    kind: "astudio.design.routeParity.v1",
    guidanceConfigPath: guidancePath,
    routingConfigPath: routingPath,
    scopePrecedence,
    surfaces,
    uncoveredProtectedCount: surfaces.filter(
      (surface) => surface.guidanceScope === "error" && surface.status === "uncovered",
    ).length,
  };
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
 * Tokenizes a shell-like command string into argument tokens.
 *
 * Supports single and double quotes (preserving enclosed whitespace), and backslash escapes.
 * Outside quotes, backslashes can escape whitespace, single/double quotes, and backslash.
 * Inside double quotes, backslashes can escape double quote, backslash, `$`, `` ` ``, and whitespace.
 * Whitespace characters separate tokens and are not included in tokens.
 *
 * @param command - The shell-like command string to tokenize
 * @returns The parsed list of argument tokens
 * @throws DesignEngineError (`E_DESIGN_VALIDATION_COMMAND_INVALID`) if the command contains an unterminated quote
 */
function commandTokens(command: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | '"' | undefined;

  const trimmed = command.trim();
  for (let index = 0; index < trimmed.length; index += 1) {
    const character = trimmed[index];
    if (character === "\\" && quote !== "'") {
      const nextCharacter = trimmed[index + 1];
      const escapeableOutsideQuotes = nextCharacter
        ? /\s/.test(nextCharacter) ||
          nextCharacter === "'" ||
          nextCharacter === '"' ||
          nextCharacter === "\\"
        : false;
      const escapeableInsideDoubleQuotes = nextCharacter
        ? nextCharacter === '"' ||
          nextCharacter === "\\" ||
          nextCharacter === "$" ||
          nextCharacter === "`" ||
          /\s/.test(nextCharacter)
        : false;
      if ((quote === '"' && escapeableInsideDoubleQuotes) || (!quote && escapeableOutsideQuotes)) {
        current += nextCharacter;
        index += 1;
      } else {
        current += "\\";
      }
      continue;
    }
    if (quote) {
      if (character === quote) {
        quote = undefined;
      } else {
        current += character;
      }
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      continue;
    }
    if (/\s/.test(character)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    current += character;
  }

  if (quote) {
    throw invalidValidationCommand(command, "Validation command has unterminated shell quote");
  }
  if (current) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Creates a DesignEngineError for an invalid validation command.
 *
 * @param command - The offending validation command string
 * @param message - Short explanation of why the command is invalid
 * @returns A DesignEngineError whose message is `"<message>: <command>"` and whose code is `"E_DESIGN_VALIDATION_COMMAND_INVALID"` with `exitCode: 2`
 */
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
  "--reporter",
  "--resume-from",
  "--test-pattern",
  "--workspace-concurrency",
]);

const trustedReadOnlyPackageScriptKeys = new Set([
  ".#agent-design:lint",
  ".#docs:lint",
  ".#test:a11y:widgets",
  "packages/ui#type-check",
]);

const wrapperEvidenceLocator =
  "docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#machine-evidence-contract";
const finalPlanEvidenceLocator =
  "docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#execution-ledger";
const fallbackPrepareValidationCommands: AgentUiRouteValidationCommand[] = [
  {
    command: "pnpm run agent-design:lint",
    safetyClass: "read_only",
    reason: "Validate the agent design contract when no route-specific guardrail is available.",
    packageScript: "agent-design:lint",
  },
];

interface InferredPackageScript {
  packageDir: string;
  script: string;
}

type ConsumedPnpmOption = {
  consumed: true;
  index: number;
  packageDir: string;
};

type UnconsumedPnpmOption = {
  consumed: false;
  packageDir: string;
};

/**
 * Validate that a parsed pnpm package directory is present and not an option flag.
 *
 * @param command - The original validation command string (used to format errors)
 * @param packageDir - The inferred package directory token to validate
 * @returns The validated `packageDir`
 * @throws DesignEngineError with code `E_DESIGN_VALIDATION_COMMAND_INVALID` if `packageDir` is missing or begins with `-`
 */
function normalizePackageDir(command: string, packageDir: string | undefined): string {
  if (!packageDir || packageDir.startsWith("-")) {
    throw invalidValidationCommand(
      command,
      "Validation command has an invalid pnpm package directory",
    );
  }
  return packageDir;
}

/**
 * Create an error indicating the provided pnpm command uses unsupported filter selectors.
 *
 * @param command - The original command string that contains the unsupported filter
 * @returns A DesignEngineError describing the invalid validation command for unsupported pnpm filter selectors
 */
function unsupportedPnpmFilter(command: string): DesignEngineError {
  return invalidValidationCommand(
    command,
    "Validation command uses unsupported pnpm filter selectors",
  );
}

/**
 * Interprets a single pnpm CLI token at `tokens[index]` and determines whether it
 * consumes additional tokens or updates the inferred `packageDir`.
 *
 * @param command - The original raw command string (used for error messages)
 * @param tokens - Tokenized command arguments
 * @param index - Index of the token to inspect
 * @param packageDir - Currently inferred package directory (may be updated)
 * @returns An object describing consumption:
 *          - If `consumed === true`: the returned `index` is the next position to read and `packageDir` may be updated.
 *          - If `consumed === false`: the token was not treated as an option and the caller should interpret it (e.g., as a script name); `packageDir` is returned unchanged.
 * @throws Error created by `invalidValidationCommand` when the token requests unsupported recursive execution.
 * @throws Error created by `unsupportedPnpmFilter` when the token is a disallowed `--filter` selector.
 */
function consumePnpmOption(
  command: string,
  tokens: string[],
  index: number,
  packageDir: string,
): ConsumedPnpmOption | UnconsumedPnpmOption {
  const token = tokens[index];
  if (
    token === "-r" ||
    token === "--recursive" ||
    token === "recursive" ||
    token === "multi" ||
    token === "m"
  ) {
    throw invalidValidationCommand(
      command,
      "Validation command uses unsupported pnpm recursive execution",
    );
  }
  if (token === "-C" || token === "--dir") {
    return {
      consumed: true,
      index: index + 1,
      packageDir: normalizePackageDir(command, tokens[index + 1]),
    };
  }
  if (token.startsWith("-C=")) {
    return {
      consumed: true,
      index,
      packageDir: normalizePackageDir(command, token.slice("-C=".length)),
    };
  }
  if (token.startsWith("-C") && token.length > 2) {
    return {
      consumed: true,
      index,
      packageDir: normalizePackageDir(command, token.slice(2)),
    };
  }
  if (token.startsWith("--dir=")) {
    return {
      consumed: true,
      index,
      packageDir: normalizePackageDir(command, token.slice("--dir=".length)),
    };
  }
  if (token === "--workspace-root" || token === "-w") {
    return { consumed: true, index, packageDir: "." };
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
    return { consumed: true, index: index + 1, packageDir };
  }
  if (token.startsWith("-")) {
    return { consumed: true, index, packageDir };
  }
  return { consumed: false, packageDir };
}

/**
 * Resolve a package directory to a canonical workspace-relative path using real filesystem paths.
 *
 * @param rootDir - The workspace root used to resolve and constrain `packageDir`
 * @param packageDir - The package directory to canonicalize (absolute or relative)
 * @returns The canonical package directory path relative to `rootDir`, using `/` separators; returns `"."` when the directory is the workspace root
 * @throws DesignEngineError with code `E_DESIGN_VALIDATION_COMMAND_INVALID` when the resolved package directory is outside the workspace
 */
async function canonicalPackageDir(rootDir: string, packageDir: string): Promise<string> {
  const realRoot = await realpath(path.resolve(rootDir));
  const realPackageDir = await realpath(path.resolve(realRoot, packageDir));
  if (!isWithinDirectory(realRoot, realPackageDir)) {
    throw new DesignEngineError(
      `Validation command package directory must stay inside the workspace: ${packageDir}`,
      {
        code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
        exitCode: 2,
      },
    );
  }
  const relativePackageDir = path.relative(realRoot, realPackageDir).replace(/\\/g, "/");
  return relativePackageDir.length > 0 ? relativePackageDir : ".";
}

/**
 * Constructs the canonical trust key for a package script.
 *
 * @param rootDir - Workspace root used to resolve and canonicalize `packageDir`
 * @param packageDir - Package directory path to be canonicalized relative to `rootDir`
 * @param packageScript - The package script name
 * @returns The trust key in the form `<canonicalPackageDir>#<packageScript>`
 */
async function packageScriptTrustKey(
  rootDir: string,
  packageDir: string,
  packageScript: string,
): Promise<string> {
  return `${await canonicalPackageDir(rootDir, packageDir)}#${packageScript}`;
}

/**
 * Extracts the target package directory and script name from the tokens following a `pnpm run` invocation.
 *
 * Parses tokens starting at `startIndex`, consuming supported pnpm options that may adjust the package directory, and returns the final `{ packageDir, script }` pair when a single script token remains.
 *
 * @param command - The original command string (used for error reporting)
 * @param tokens - The tokenized command arguments
 * @param startIndex - Index in `tokens` where script/option parsing should begin
 * @param initialPackageDir - The package directory inferred before parsing options (may be updated by options)
 * @returns An object with `packageDir` (final canonical package directory fragment) and `script` (the package script name)
 * @throws Throws a validation error if no script token is provided or if extra arguments remain after the script
 */
function readPnpmRunScript(
  command: string,
  tokens: string[],
  startIndex: number,
  initialPackageDir: string,
): InferredPackageScript {
  let packageDir = initialPackageDir;
  for (let index = startIndex; index < tokens.length; index += 1) {
    const token = tokens[index];
    const consumed = consumePnpmOption(command, tokens, index, packageDir);
    if (consumed.consumed) {
      packageDir = consumed.packageDir;
      index = consumed.index;
      continue;
    }
    if (index !== tokens.length - 1) {
      throw invalidValidationCommand(
        command,
        "Validation command must not pass extra arguments to a trusted package script",
      );
    }
    return { packageDir, script: token };
  }

  throw invalidValidationCommand(command, "Validation command does not name a package script");
}

/**
 * Infers a pnpm package script invocation from a raw command string.
 *
 * @param command - The raw shell-like command to analyze (expected form: `pnpm ...`).
 * @returns The inferred `packageDir` and `script` when the command invokes `pnpm`, or `undefined` if the command is not a pnpm invocation.
 * @throws DesignEngineError with code `E_DESIGN_VALIDATION_COMMAND_INVALID` if the command is malformed, uses unsupported pnpm subcommands/options, or does not name a package script.
 */
function inferPackageScript(command: string): InferredPackageScript | undefined {
  const tokens = commandTokens(command);
  if (tokens[0] !== "pnpm") {
    return undefined;
  }

  let packageDir = ".";
  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === "run" || token === "run-script") {
      return readPnpmRunScript(command, tokens, index + 1, packageDir);
    }
    const consumed = consumePnpmOption(command, tokens, index, packageDir);
    if (consumed.consumed) {
      packageDir = consumed.packageDir;
      index = consumed.index;
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

/**
 * Determines whether a candidate directory path is the same as or contained inside a workspace root directory.
 *
 * This comparison uses the raw path strings provided (no realpath or filesystem resolution); symbolic links are not resolved.
 *
 * @param rootDir - The workspace root directory path
 * @param candidateDir - The directory path to test for containment within `rootDir`
 * @returns `true` if `candidateDir` is equal to or located within `rootDir`, `false` otherwise
 */
function isWithinDirectory(rootDir: string, candidateDir: string): boolean {
  const relative = path.relative(rootDir, candidateDir);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

/**
 * Resolve and validate the real filesystem path to a package.json located under a workspace root.
 *
 * @param rootDir - The workspace root directory
 * @param packageDir - The target package directory (absolute or relative to `rootDir`)
 * @returns The real (resolved) absolute path to the package.json file for `packageDir`
 * @throws DesignEngineError with code `E_DESIGN_VALIDATION_COMMAND_INVALID` if `packageDir` or the resolved package.json lies outside `rootDir`
 * @throws DesignEngineError with code `E_DESIGN_PACKAGE_JSON` if the package.json is missing or unreadable
 */
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
  const packageJsonPath = path.join(resolvedPackageDir, "package.json");
  let realPackageJsonPath = "";
  try {
    realPackageJsonPath = await realpath(packageJsonPath);
  } catch {
    throw new DesignEngineError(`package.json is missing or unreadable: ${packageDir}`, {
      code: "E_DESIGN_PACKAGE_JSON",
      exitCode: 2,
    });
  }
  if (!isWithinDirectory(realRoot, realPackageJsonPath)) {
    throw new DesignEngineError(
      `Validation command package.json must stay inside the workspace: ${packageDir}`,
      {
        code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
        exitCode: 2,
      },
    );
  }
  return realPackageJsonPath;
}

/**
 * Load and validate the `scripts` defined in a package's package.json.
 *
 * Reads and parses the package.json resolved from `rootDir` and `packageDir`, verifies that
 * `scripts` (if present) is an object whose values are non-empty strings, and returns the set
 * of script names.
 *
 * @param rootDir - Workspace root used to resolve the target package
 * @param packageDir - Package directory path relative to `rootDir` (defaults to `"."`)
 * @returns A set of script names defined in the package's `scripts` object; empty if none
 * @throws AbortError when the operation is aborted via `signal`
 * @throws DesignEngineError with code `E_DESIGN_PACKAGE_JSON` if the package.json is missing,
 *   unreadable, contains invalid JSON, is not an object, if `scripts` is not an object, or if any
 *   script value is not a non-empty string
 */
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

/**
 * Validate and normalize a list of pnpm package-script validation commands for the given workspace.
 *
 * Ensures each command is a pnpm package-script invocation, infers missing `packageScript` values,
 * verifies the referenced script exists in the package's package.json, enforces that the
 * `<packageDir>#<script>` trust key is present in the trusted read-only whitelist, and fills
 * defaults for `expectedOutcome` and `timeoutClass`. Reads of package.json scripts are cached
 * per package directory. Cancellation via `signal` is respected when loading package.json.
 *
 * @param commands - The route validation commands to validate and normalize
 * @param rootDir - Workspace root directory used to resolve package directories and trust keys
 * @param signal - Optional abort signal to cancel filesystem reads
 * @returns The normalized array of validation commands with `packageScript`, `expectedOutcome`, and `timeoutClass` populated where missing
 * @throws {DesignEngineError} `E_DESIGN_VALIDATION_COMMAND_INVALID` when a command is not a pnpm package-script invocation, when a declared `packageScript` conflicts with the inferred script, when the referenced script is missing from package.json, or when the package-script trust key is not trusted
 */
async function normalizeValidationCommands(
  commands: AgentUiRouteValidationCommand[],
  rootDir: string,
  signal?: AbortSignal,
): Promise<PrepareValidationCommand[]> {
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
  const normalized: PrepareValidationCommand[] = [];

  for (const command of commands) {
    const inferred = inferPackageScript(command.command);
    if (!inferred) {
      throw new DesignEngineError(
        `Validation command must be a pnpm package-script invocation: ${command.command}`,
        {
          code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
          exitCode: 2,
        },
      );
    }
    if (command.packageScript && command.packageScript !== inferred.script) {
      throw new DesignEngineError(
        `Validation command packageScript does not match command text: ${command.packageScript} != ${inferred.script}`,
        {
          code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
          exitCode: 2,
        },
      );
    }

    const packageScript = command.packageScript ?? inferred.script;
    if (!(await getPackageScripts(inferred.packageDir)).has(packageScript)) {
      throw new DesignEngineError(
        `Validation command references missing package script: ${packageScript}`,
        {
          code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
          exitCode: 2,
        },
      );
    }
    const trustKey = await packageScriptTrustKey(rootDir, inferred.packageDir, packageScript);
    if (!trustedReadOnlyPackageScriptKeys.has(trustKey)) {
      throw new DesignEngineError(
        `Validation command package script is not trusted read-only: ${trustKey}`,
        {
          code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
          exitCode: 2,
        },
      );
    }

    normalized.push({
      ...command,
      packageScript,
      expectedOutcome: command.expectedOutcome ?? "Command exits 0 without mutating source files.",
      timeoutClass: command.timeoutClass ?? "medium",
      ifFails:
        typeof command.ifFails === "string" && command.ifFails.trim().length > 0
          ? command.ifFails.trim()
          : "Stop UI edits, inspect this command's failure output, and fix the design-system contract or implementation evidence before continuing.",
    });
  }

  return normalized;
}

/**
 * Ensures there is at least one trusted read-only validation command for the given context.
 *
 * @param validationCommands - Array of validation command objects to verify
 * @param context - Context identifier included in the error message when no commands are present
 * @throws DesignEngineError with code `E_DESIGN_VALIDATION_COMMAND_INVALID` when `validationCommands` is empty
 */
function requireValidationCommands(
  validationCommands: PrepareValidationCommand[],
  context: string,
): void {
  if (validationCommands.length > 0) {
    return;
  }
  throw new DesignEngineError(
    `Prepare payload has no trusted read-only validation commands: ${context}`,
    {
      code: "E_DESIGN_VALIDATION_COMMAND_INVALID",
      exitCode: 2,
    },
  );
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

/**
 * Maps a diagnostic or error code to the recommended next action for an open decision.
 *
 * @param code - The diagnostic or error code identifying the open decision.
 * @returns `"escalate"` for `E_DESIGN_ROUTE_AMBIGUOUS` or `E_DESIGN_SURFACE_SCOPE_UNKNOWN`, `"stop"` for `E_DESIGN_ROUTE_MISSING`, `E_DESIGN_ROUTE_EXAMPLE_MISSING`, or `E_DESIGN_ROUTE_DEPRECATED`, and `"diagnose"` for all other codes.
 */
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

function buildPrepareNextAction(
  safeForAutomaticImplementation: boolean,
  surfaceKind: string,
  openDecisions: PrepareOpenDecision[],
  routeDiagnostics?: PrepareRouteDiagnostics,
): PrepareNextAction {
  const evidenceRefs = [designPath, guidancePath, routingPath];
  const blockingDecision = openDecisions.find((decision) => decision.severity === "error");
  if (!blockingDecision && safeForAutomaticImplementation) {
    return {
      kind: "implement",
      instruction: `Implement the UI surface with the ${surfaceKind} route, returned token roles, required states, examples, and validation commands.`,
      evidenceRefs,
    };
  }

  const reasonCode = blockingDecision?.code ?? "E_DESIGN_VALIDATION_COMMAND_INVALID";
  if (reasonCode === "E_DESIGN_PROPOSAL_REQUIRED") {
    return {
      kind: "stop_for_proposal",
      reasonCode,
      category: "proposal",
      instruction:
        "Stop before editing UI and draft or link the required design proposal for this surface.",
      evidenceRefs,
      recoveryHints: [
        "Open or create the proposal referenced by the route decision.",
        "Do not add a new component abstraction until the proposal exists and is approved.",
      ],
    };
  }
  if (reasonCode === "E_DESIGN_ROUTE_MISSING") {
    return {
      kind: "stop_for_missing_route",
      reasonCode,
      category: "route",
      instruction:
        "Stop before editing UI because no canonical agent UI route matches this surface.",
      evidenceRefs,
      recoveryHints: [
        "Use routeDiagnostics.candidateFilesToUpdate to update the routing map or lifecycle metadata.",
        "Prefer an existing close route when routeDiagnostics.closestRoutes has a medium-confidence match.",
        "Only mark the surface exempt when the protected-scope rule is intentionally too broad.",
      ],
      recoveryAction: "create_route_candidate",
      ...(routeDiagnostics ? { routeDiagnostics } : {}),
    };
  }
  if (
    reasonCode === "E_DESIGN_ROUTE_EXAMPLE_MISSING" ||
    reasonCode === "E_DESIGN_ROUTE_LIFECYCLE_MISSING" ||
    reasonCode === "E_DESIGN_ROUTE_COVERAGE_MISSING" ||
    reasonCode === "E_DESIGN_ROUTE_SOURCE_REF_MISSING" ||
    reasonCode === "E_DESIGN_VALIDATION_COMMAND_INVALID"
  ) {
    const category: PrepareStopCategory =
      reasonCode === "E_DESIGN_VALIDATION_COMMAND_INVALID" ? "validation" : "design";
    return {
      kind: "stop_for_validation_setup",
      reasonCode,
      category,
      instruction:
        "Stop before editing UI because the design route evidence or validation setup is incomplete.",
      evidenceRefs,
      recoveryHints:
        category === "validation"
          ? [
              "Run the returned validation command manually to identify the missing executable or invalid command text.",
              "Fix the route validation command source before editing the UI surface.",
            ]
          : [
              "Complete the route evidence source referenced by reasonCode before editing the UI surface.",
              "Keep lifecycle, coverage, source refs, and examples aligned for the matched route.",
            ],
    };
  }

  return {
    kind: "stop_for_manual_decision",
    reasonCode,
    category: "design",
    instruction:
      "Stop before editing UI and ask for a manual design-system decision for this surface.",
    evidenceRefs,
    recoveryHints: [
      "Ask for the smallest design-system decision that unblocks this surface.",
      "Record the decision in the relevant design-system source before editing UI.",
    ],
  };
}

function buildStopClassification(
  nextAction: PrepareNextAction,
): PrepareStopClassification | undefined {
  if (nextAction.kind === "implement") return undefined;
  return {
    category: nextAction.category,
    reasonCode: nextAction.reasonCode,
    instruction: nextAction.instruction,
    recoveryHints: nextAction.recoveryHints,
    evidenceRefs: nextAction.evidenceRefs,
  };
}

function buildDoNotInventGuidance(
  recommendedRoutes: PrepareRouteRecommendation[],
  designTokenContract: DesignTokenContract,
  sourceRefs: string[],
): PrepareDoNotInventGuidance[] {
  const primaryRoute = recommendedRoutes[0];
  const guidance: PrepareDoNotInventGuidance[] = [
    {
      thing: "new token role, raw color, or arbitrary spacing convention",
      instead: `Use semantic token roles from designTokenContract, especially ${designTokenContract.allowedRoles
        .slice(0, 4)
        .map((role) => role.role)
        .join(", ")}.`,
      sourceRefs: designTokenContract.sourceRefs,
    },
    {
      thing: "one-off loading, empty, error, or ready state treatment",
      instead:
        "Use the requiredStates returned by prepare and copy state structure only from the relevant examples.",
      sourceRefs,
    },
  ];

  if (primaryRoute) {
    guidance.unshift({
      thing: "new component abstraction or local wrapper for this surface",
      instead: `Use ${primaryRoute.preferredComponent.name} from ${primaryRoute.preferredComponent.importPath} for ${primaryRoute.canonicalNeed}.`,
      sourceRefs: primaryRoute.sourceRefs,
    });
  } else {
    guidance.unshift({
      thing: "new component abstraction or local wrapper for an unrouted surface",
      instead: "Stop for a missing-route or proposal decision before creating a new abstraction.",
      sourceRefs,
    });
  }

  return guidance;
}

function buildRouteConfidence(
  route: PrepareRouteRecommendation,
  resolvedExampleCount: number,
): PrepareRouteConfidence {
  const because: string[] = [
    `Matched ${route.matchedNeed} to canonical route ${route.canonicalNeed}.`,
    `Resolved canonical component ${route.preferredComponent.name}.`,
  ];
  if (route.lifecycleEntry.lifecycle === "canonical") {
    because.push("Component lifecycle is canonical.");
  }
  if (route.coverageEntry.status.length > 0) {
    because.push(`Coverage matrix status is ${route.coverageEntry.status}.`);
  }
  if (resolvedExampleCount > 0) {
    because.push("Route includes at least one registered relevant example.");
  }
  const hasUnregisteredExamples = resolvedExampleCount < route.examples.length;
  if (hasUnregisteredExamples) {
    because.push("Some route examples are not registered relevant examples.");
  }

  let level: PrepareRouteConfidence["level"] = "high";
  if (route.routeMaturity === "provisional" || route.lifecycleEntry.lifecycle === "transitional") {
    level = "medium";
  }
  if (hasUnregisteredExamples && level === "high") {
    level = "medium";
  }
  if (resolvedExampleCount === 0 || route.lifecycleEntry.lifecycle === "deprecated") {
    level = "low";
  }

  return { level, because };
}

function buildExampleUsageGuidance(
  route: PrepareRouteRecommendation,
  goldExamples: GoldExampleRegistry,
): PrepareExampleUsageGuidance {
  const matchedExamples = route.examples
    .map((examplePath) => goldExamples.get(examplePath))
    .filter((example): example is GoldExample => Boolean(example));
  const hasUnregisteredExamples = matchedExamples.length < route.examples.length;
  const coveredStates = uniqueSorted(matchedExamples.flatMap((example) => example.coveredStates));
  const deferredStates = uniqueSorted(
    matchedExamples.flatMap((example) => example.deferredStates ?? []),
  );
  const maturity: PrepareExampleUsageGuidance["maturity"] =
    matchedExamples.length === 0
      ? "legacy"
      : !hasUnregisteredExamples && matchedExamples.every((example) => example.promotable !== false)
        ? "gold"
        : route.routeMaturity === "provisional" || hasUnregisteredExamples
          ? "legacy"
          : "acceptable";

  return {
    copy: [
      `Copy the ${route.preferredComponent.name} composition pattern and state coverage shape.`,
      "Reuse semantic token roles and layout structure, not local styling shortcuts.",
    ],
    doNotCopy: [
      "Do not copy fixture data, demo copy, viewport wrappers, or story-only scaffolding.",
      "Do not introduce new tokens, state names, or component abstractions from the example.",
    ],
    proves: uniqueSorted([
      `Canonical route: ${route.canonicalNeed}`,
      ...coveredStates.map((state) => `Covered state: ${state}`),
      ...deferredStates.map((state) => `Deferred state: ${state}`),
    ]),
    maturity,
  };
}

function withPrepareRouteGuidance(
  route: ResolvedAgentUiRoute,
  validationCommands: PrepareValidationCommand[],
  goldExamples: GoldExampleRegistry,
): PrepareRouteRecommendation {
  const recommendedRoute: PrepareRouteRecommendation = {
    ...route,
    validationCommands,
    confidence: { level: "low", because: [] },
    usageGuidance: {
      copy: [],
      doNotCopy: [],
      proves: [],
      maturity: "acceptable",
    },
  };
  const resolvedExampleCount = route.examples.filter((examplePath) =>
    Boolean(goldExamples.get(examplePath)),
  ).length;
  recommendedRoute.confidence = buildRouteConfidence(recommendedRoute, resolvedExampleCount);
  recommendedRoute.usageGuidance = buildExampleUsageGuidance(recommendedRoute, goldExamples);
  return recommendedRoute;
}

/**
 * Determine the guidance design mode implied by a design contract schema version.
 *
 * @param schemaVersion - The design contract schema identifier (e.g., `"agent-design.v1"`)
 * @returns `"design-md"` if the schema version is `"agent-design.v1"`, `"legacy"` otherwise
 */
function designContractModeFromSchema(schemaVersion: string): GuidanceDesignMode {
  if (schemaVersion === "agent-design.v1") {
    return "design-md";
  }
  return "legacy";
}

/**
 * Ensures the guidance config's declared design contract mode matches the mode implied by a design schema version.
 *
 * @param guidance - Parsed guidance configuration whose optional `designContract.mode` may declare `"legacy"` or `"design-md"`.
 * @param schemaVersion - The design contract schema version string from DESIGN.md (e.g., `"agent-design.v1"`).
 * @returns The design contract mode derived from `schemaVersion` (`"legacy"` or `"design-md"`).
 * @throws DesignEngineError with code `E_DESIGN_CONTRACT_MODE_MISMATCH` when the declared mode does not match the mode inferred from `schemaVersion`.
 */
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
 * Builds a PreparePayload aggregating routing, scope classification, design contract provenance,
 * computed source digests, normalized validation commands, recommendations, and open decisions
 * for the specified UI surface.
 *
 * @param surfacePath - Path to the UI surface to prepare; may be absolute or relative to `rootDir`
 * @param rootDir - Workspace root used to resolve files and package paths (defaults to process.cwd())
 * @param signal - Optional AbortSignal to cancel repository I/O
 * @returns A PreparePayload containing deterministic metadata, recommended routes, `validationCommands`,
 *          `requiredStates`, `forbiddenPatterns`, `relevantExamples`, `designTokenContract`,
 *          `designContractMode`, provenance (`ruleManifestVersion`, `rulePackVersion`, `ruleSourceDigests`),
 *          `sourceDigests` (sorted), `coverageMatrixDigest`, `componentLifecycleDigest`, `openDecisions`,
 *          and flags `ok` and `safeForAutomaticImplementation`
 * @throws DesignEngineError with code `E_DESIGN_SOURCE_DIGEST_MISSING` if required source digests (coverage matrix or component lifecycle) are absent
 */
export async function buildPreparePayload(
  surfacePath: string,
  rootDir = process.cwd(),
  signal?: AbortSignal,
): Promise<PreparePayload> {
  signal?.throwIfAborted();
  const resolvedRoot = path.resolve(rootDir);
  const normalizedSurfacePath = normalizeSurfacePath(resolvedRoot, surfacePath);
  const designSource = await readPrepareSource(
    resolvedRoot,
    designPath,
    "E_DESIGN_CONTRACT_SOURCE_MISSING",
    signal,
  );
  const guidanceSource = await readPrepareSource(
    resolvedRoot,
    guidancePath,
    "E_DESIGN_GUIDANCE_SOURCE_MISSING",
    signal,
  );
  const goldExamplesSource = await readPrepareSource(
    resolvedRoot,
    goldExamplesPath,
    "E_DESIGN_GOLD_EXAMPLES_SOURCE_MISSING",
    signal,
  );
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
  let parsedGoldExamples: unknown;
  try {
    parsedGoldExamples = JSON.parse(goldExamplesSource) as unknown;
  } catch {
    throw new DesignEngineError("Gold examples registry contains invalid JSON.", {
      code: "E_DESIGN_GOLD_EXAMPLES_JSON",
      exitCode: 2,
    });
  }
  const goldExamples = parseGoldExamples(parsedGoldExamples);
  const sourceDigests = await Promise.all(
    [
      designPath,
      guidancePath,
      routingPath,
      lifecyclePath,
      coveragePath,
      goldExamplesPath,
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

  const recommendedRoutes: PrepareRouteRecommendation[] = [];
  if (route) {
    const routeValidationCommands = await normalizeValidationCommands(
      onlyReadOnly(route.validationCommands),
      resolvedRoot,
      signal,
    );
    requireValidationCommands(routeValidationCommands, route.canonicalNeed);
    recommendedRoutes.push(withPrepareRouteGuidance(route, routeValidationCommands, goldExamples));
  }
  const requiredStates = uniqueSorted(recommendedRoutes.flatMap((entry) => entry.requiredStates));
  const forbiddenPatterns = uniqueSorted(recommendedRoutes.flatMap((entry) => entry.avoid));
  const relevantExamples = uniqueSorted(recommendedRoutes.flatMap((entry) => entry.examples));
  const validationCommands = recommendedRoutes.flatMap((entry) => entry.validationCommands);
  if (validationCommands.length === 0) {
    validationCommands.push(
      ...(await normalizeValidationCommands(
        fallbackPrepareValidationCommands,
        resolvedRoot,
        signal,
      )),
    );
  }
  requireValidationCommands(validationCommands, normalizedSurfacePath);
  const openDecisions = routeDecisions(routeResult, surfaceScope);
  const ok = openDecisions.every((decision) => decision.severity !== "error");
  const safeForAutomaticImplementation = ok && surfaceScope !== "unknown";
  const routeDiagnostics = routeResult.diagnostics.some(
    (diagnostic) => diagnostic.code === "E_DESIGN_ROUTE_MISSING",
  )
    ? buildMissingRouteDiagnostics(guidance, normalizedSurfacePath, resolvedRoot)
    : undefined;
  const nextAction = buildPrepareNextAction(
    safeForAutomaticImplementation,
    route?.canonicalNeed ?? "unknown",
    openDecisions,
    routeDiagnostics,
  );
  const stopClassification = buildStopClassification(nextAction);
  const doNotInvent = buildDoNotInventGuidance(recommendedRoutes, designTokenContract, [
    designPath,
    routingPath,
    goldExamplesPath,
  ]);

  return {
    kind: "astudio.design.prepare.v1",
    ok,
    safeForAutomaticImplementation,
    nextAction,
    ...(stopClassification ? { stopClassification } : {}),
    resolvedDesignFile: designPath,
    guidanceConfigPath: guidancePath,
    designContractMode,
    surfacePath: normalizedSurfacePath,
    surfaceScope,
    surfaceKind: route?.canonicalNeed ?? "unknown",
    recommendedRoutes,
    designTokenContract,
    doNotInvent,
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
    "wrapper-evidence": wrapperEvidenceLocator,
    "final-plan-evidence": finalPlanEvidenceLocator,
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
