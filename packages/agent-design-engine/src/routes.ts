import { readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import type {
  AgentUiRouteSource,
  AgentUiRoutingTable,
  ComponentCoverageEntry,
  ComponentLifecycleEntry,
  RemediationContext,
  ResolvedAgentUiRoute,
  RouteDiagnostic,
  RouteResolutionResult,
} from "./types.js";

const ROUTING_PATH = "docs/design-system/AGENT_UI_ROUTING.json";
const LIFECYCLE_PATH = "docs/design-system/COMPONENT_LIFECYCLE.json";
const COVERAGE_PATH = "docs/design-system/COVERAGE_MATRIX.json";

/**
 * Read a UTF-8 JSON file located at the given relative path.
 *
 * @param rootDir - Base directory used to resolve `relativePath`
 * @param relativePath - Path to the JSON file, relative to `rootDir`
 * @returns The parsed JSON value as unknown so callers must validate shape
 */
function readJson(rootDir: string, relativePath: string): unknown {
  return JSON.parse(readFileSync(path.join(rootDir, relativePath), "utf8")) as unknown;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStringField(record: Record<string, unknown>, field: string, context: string): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new Error(`${context}.${field} must be a string.`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${context}.${field} must be a non-empty string.`);
  }
  return trimmed;
}

function parseOptionalStringField(
  record: Record<string, unknown>,
  field: string,
  context: string,
): string | undefined {
  const value = record[field];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new Error(`${context}.${field} must be a string when present.`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${context}.${field} must be a non-empty string when present.`);
  }
  return trimmed;
}

function parseNullableStringField(
  record: Record<string, unknown>,
  field: string,
  context: string,
): string | null {
  const value = record[field];
  if (value === null) return null;
  if (typeof value !== "string") {
    throw new Error(`${context}.${field} must be a string or null.`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${context}.${field} must be a non-empty string or null.`);
  }
  return trimmed;
}

function parseBooleanField(
  record: Record<string, unknown>,
  field: string,
  context: string,
): boolean {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(`${context}.${field} must be a boolean.`);
  }
  return value;
}

function parseIntegerField(
  record: Record<string, unknown>,
  field: string,
  context: string,
): number {
  const value = record[field];
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`${context}.${field} must be an integer.`);
  }
  return value;
}

function parseStringArrayField(
  record: Record<string, unknown>,
  field: string,
  context: string,
): string[] {
  const value = record[field];
  if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) {
    throw new Error(`${context}.${field} must be an array of strings.`);
  }
  return value.map((entry, index) => {
    const trimmed = entry.trim();
    if (!trimmed) {
      throw new Error(`${context}.${field}[${index}] must be a non-empty string.`);
    }
    return trimmed;
  });
}

function parseObjectArrayField(
  record: Record<string, unknown>,
  field: string,
  context: string,
): Record<string, unknown>[] {
  const value = record[field];
  if (!Array.isArray(value) || !value.every(isObject)) {
    throw new Error(`${context}.${field} must be an array of objects.`);
  }
  return value;
}

function parseEnumField<const T extends string>(
  record: Record<string, unknown>,
  field: string,
  context: string,
  allowed: readonly T[],
): T {
  const value = record[field];
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new Error(`${context}.${field} must be one of: ${allowed.join(", ")}.`);
  }
  return value as T;
}

function parseOptionalSchemaVersion(value: unknown): AgentUiRoutingTable["schemaVersion"] {
  if (value !== "agent-ui-routing.v1") {
    throw new Error("Agent UI routing table schemaVersion must be agent-ui-routing.v1.");
  }
  return value;
}

function parsePreferredComponent(
  value: unknown,
  context: string,
): AgentUiRouteSource["preferredComponent"] {
  if (!isObject(value)) {
    throw new Error(`${context}.preferredComponent must be an object.`);
  }
  const component = value;
  return {
    name: parseStringField(component, "name", `${context}.preferredComponent`),
    importPath: parseStringField(component, "importPath", `${context}.preferredComponent`),
    packageName: parseStringField(component, "packageName", `${context}.preferredComponent`),
    coverageName: parseOptionalStringField(
      component,
      "coverageName",
      `${context}.preferredComponent`,
    ),
  };
}

function parseFallback(value: unknown, context: string): AgentUiRouteSource["fallbacks"][number] {
  if (!isObject(value)) {
    throw new Error(`${context} must be an object.`);
  }
  const fallback = value;
  return {
    component: parseStringField(fallback, "component", context),
    reason: parseStringField(fallback, "reason", context),
  };
}

function parseValidationCommand(
  value: unknown,
  context: string,
): AgentUiRouteSource["validationCommands"][number] {
  if (!isObject(value)) {
    throw new Error(`${context} must be an object.`);
  }
  const command = value;
  const parsed: AgentUiRouteSource["validationCommands"][number] = {
    command: parseStringField(command, "command", context),
    safetyClass: parseEnumField(command, "safetyClass", context, [
      "read_only",
      "mutating",
      "interactive",
      "server_start",
    ]),
    reason: parseStringField(command, "reason", context),
  };
  if (command.blockedByDefault !== undefined) {
    parsed.blockedByDefault = parseBooleanField(command, "blockedByDefault", context);
  }
  return parsed;
}

function parseRouteSource(value: unknown): AgentUiRouteSource {
  if (!isObject(value)) {
    throw new Error("Agent UI routing table route must be an object.");
  }
  const route = value;
  const context =
    typeof route.canonicalNeed === "string" && route.canonicalNeed.trim()
      ? `Agent UI route ${route.canonicalNeed.trim()}`
      : "Agent UI route";
  return {
    need: parseStringField(route, "need", context),
    canonicalNeed: parseStringField(route, "canonicalNeed", context),
    aliases: parseStringArrayField(route, "aliases", context),
    proposalRef: parseOptionalStringField(route, "proposalRef", context),
    preferredComponent: parsePreferredComponent(route.preferredComponent, context),
    lifecycleStatus: parseEnumField(route, "lifecycleStatus", context, [
      "canonical",
      "transitional",
    ]),
    routeMaturity: parseEnumField(route, "routeMaturity", context, ["enforced", "provisional"]),
    surfacePatterns: parseStringArrayField(route, "surfacePatterns", context),
    useWhen: parseStringArrayField(route, "useWhen", context),
    requiredStates: parseStringArrayField(route, "requiredStates", context),
    examples: parseStringArrayField(route, "examples", context),
    avoid: parseStringArrayField(route, "avoid", context),
    fallbacks: parseObjectArrayField(route, "fallbacks", context).map((fallback, index) =>
      parseFallback(fallback, `${context}.fallbacks[${index}]`),
    ),
    validationCommands: parseObjectArrayField(route, "validationCommands", context).map(
      (command, index) =>
        parseValidationCommand(command, `${context}.validationCommands[${index}]`),
    ),
    sourceRefs: parseStringArrayField(route, "sourceRefs", context),
  };
}

function parseRoutingTable(value: unknown): AgentUiRoutingTable {
  if (!isObject(value)) {
    throw new Error("Agent UI routing table must be a JSON object.");
  }
  if (!Array.isArray(value.routes)) {
    throw new Error("Agent UI routing table must define a routes array.");
  }
  return {
    schemaVersion: parseOptionalSchemaVersion(value.schemaVersion),
    updatedAt: parseStringField(value, "updatedAt", "Agent UI routing table"),
    routes: value.routes.map(parseRouteSource),
  };
}

function parseLifecycleManifest(value: unknown): { components: ComponentLifecycleEntry[] } {
  if (!isObject(value)) {
    throw new Error("Component lifecycle manifest must be a JSON object.");
  }
  if (!Array.isArray(value.components) || !value.components.every(isObject)) {
    throw new Error("Component lifecycle manifest must define a components array of objects.");
  }
  return {
    components: value.components.map((entry) => {
      const context =
        typeof entry.name === "string" && entry.name.trim()
          ? `Component lifecycle ${entry.name.trim()}`
          : "Component lifecycle";
      return {
        name: parseStringField(entry, "name", context),
        path: parseStringField(entry, "path", context),
        lifecycle: parseEnumField(entry, "lifecycle", context, [
          "canonical",
          "transitional",
          "deprecated",
        ]),
        routing_tier: parseIntegerField(entry, "routing_tier", context),
        proposalRef: parseOptionalStringField(entry, "proposalRef", context),
        notes: parseStringField(entry, "notes", context),
      };
    }),
  };
}

function parseCoverageEntries(value: unknown): ComponentCoverageEntry[] {
  if (!Array.isArray(value) || !value.every(isObject)) {
    throw new Error("Component coverage matrix must be an array of objects.");
  }
  return value.map((entry) => {
    const context =
      typeof entry.name === "string" && entry.name.trim()
        ? `Component coverage ${entry.name.trim()}`
        : "Component coverage";
    return {
      name: parseStringField(entry, "name", context),
      source: parseStringField(entry, "source", context),
      upstream: parseNullableStringField(entry, "upstream", context),
      fallback: parseNullableStringField(entry, "fallback", context),
      status: parseStringField(entry, "status", context),
      web_used: parseBooleanField(entry, "web_used", context),
      tauri_used: parseBooleanField(entry, "tauri_used", context),
      widget_used: parseBooleanField(entry, "widget_used", context),
    };
  });
}

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function escapeRegex(input: string): string {
  return input.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

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

function matchesSurfacePattern(surfacePath: string, pattern: string): boolean {
  const normalized = toPosixPath(pattern);
  return globToRegex(normalized).test(surfacePath);
}

function scoreSurfacePattern(pattern: string): { literalLength: number; wildcardCount: number } {
  const normalized = toPosixPath(pattern);
  return {
    literalLength: normalized.replace(/[*?]/g, "").length,
    wildcardCount: (normalized.match(/[*?]/g) ?? []).length,
  };
}

function normalizeSurfacePath(rootDir: string, surfacePath: string): string | null {
  const repoRoot = path.resolve(rootDir);
  const resolved = path.isAbsolute(surfacePath)
    ? path.resolve(surfacePath)
    : path.resolve(repoRoot, surfacePath);
  const relative = path.relative(repoRoot, resolved);
  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return toPosixPath(relative);
}

/**
 * Produce a canonical need identifier suitable for matching.
 *
 * @param need - The input need string to normalize
 * @returns The normalized need: trimmed, lowercased, with runs of spaces or hyphens replaced by underscores
 */
function normalizeNeed(need: string): string {
  return need
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

/**
 * Create a RouteDiagnostic describing an issue related to a route or its component.
 *
 * @param code - The diagnostic code
 * @param message - A human-readable diagnostic message
 * @param route - Optional route source whose `canonicalNeed` and preferred component `name` will be included
 * @param pathValue - Optional file or surface path related to the diagnostic
 * @returns The constructed `RouteDiagnostic` with `code`, `message`, `routeNeed` (from `route?.canonicalNeed`), `component` (from `route?.preferredComponent.name`), and `path` (from `pathValue`)
 */
function toRouteDiagnostic(
  code: RouteDiagnostic["code"],
  message: string,
  route?: AgentUiRouteSource,
  pathValue?: string,
): RouteDiagnostic {
  return {
    code,
    message,
    routeNeed: route?.canonicalNeed,
    component: route?.preferredComponent.name,
    path: pathValue,
  };
}

function getErrorCode(error: unknown): string | null {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
    ? (error as { code: string }).code
    : null;
}

/**
 * Load component lifecycle entries from the lifecycle manifest.
 *
 * @param rootDir - Root directory containing the lifecycle manifest file
 * @returns The list of `ComponentLifecycleEntry` objects defined in the lifecycle manifest
 */
function loadLifecycle(rootDir: string): ComponentLifecycleEntry[] {
  const manifest = parseLifecycleManifest(readJson(rootDir, LIFECYCLE_PATH));
  return manifest.components;
}

/**
 * Loads the component coverage manifest from the project and returns its entries.
 *
 * @param rootDir - Project root directory used to resolve the coverage manifest path
 * @returns The array of ComponentCoverageEntry objects from the coverage manifest
 */
function loadCoverage(rootDir: string): ComponentCoverageEntry[] {
  return parseCoverageEntries(readJson(rootDir, COVERAGE_PATH));
}

function resolveRepoPath(rootDir: string, relativePath: string): string | null {
  const repoRoot = path.resolve(rootDir);
  const resolved = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, resolved);
  if (relative !== "" && (relative.startsWith("..") || path.isAbsolute(relative))) {
    return null;
  }

  try {
    const realRoot = realpathSync(repoRoot);
    const realResolved = realpathSync(resolved);
    const realRelative = path.relative(realRoot, realResolved);
    if (realRelative !== "" && (realRelative.startsWith("..") || path.isAbsolute(realRelative))) {
      return null;
    }
    return realResolved;
  } catch (error) {
    const code = getErrorCode(error);
    if (code === "ENOENT" || code === "ENOTDIR") {
      return resolved;
    }
    throw error;
  }
}

function isExistingFile(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (error) {
    const code = getErrorCode(error);
    if (code === "ENOENT" || code === "ENOTDIR") {
      return false;
    }
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to stat route reference '${filePath}': ${reason}`);
  }
}

/**
 * Checks that each file referenced in a route's `sourceRefs` exists under `rootDir` and appends diagnostics for any missing references.
 *
 * @param rootDir - Base directory against which relative `sourceRefs` are resolved
 * @param route - The route whose `sourceRefs` will be validated
 * @param diagnostics - Collector array to which `E_DESIGN_ROUTE_SOURCE_REF_MISSING` diagnostics will be appended for missing files
 */
function validateRouteSourceRefs(
  rootDir: string,
  route: AgentUiRouteSource,
  diagnostics: RouteDiagnostic[],
) {
  for (const sourceRef of route.sourceRefs) {
    const [filePath] = sourceRef.split("#");
    const resolvedPath = filePath ? resolveRepoPath(rootDir, filePath) : null;
    if (!resolvedPath || !isExistingFile(resolvedPath)) {
      diagnostics.push(
        toRouteDiagnostic(
          "E_DESIGN_ROUTE_SOURCE_REF_MISSING",
          `Route ${route.canonicalNeed} references missing source ${sourceRef}.`,
          route,
          sourceRef,
        ),
      );
    }
  }
}

/**
 * Verify that each example file referenced by a route exists and append diagnostics for any missing files.
 *
 * @param rootDir - Base directory used to resolve each example path
 * @param route - Route whose `examples` array will be checked
 * @param diagnostics - Array to which missing-example `RouteDiagnostic` entries will be appended
 */
function validateRouteExamples(
  rootDir: string,
  route: AgentUiRouteSource,
  diagnostics: RouteDiagnostic[],
) {
  for (const example of route.examples) {
    const resolvedPath = resolveRepoPath(rootDir, example);
    if (!resolvedPath || !isExistingFile(resolvedPath)) {
      diagnostics.push(
        toRouteDiagnostic(
          "E_DESIGN_ROUTE_EXAMPLE_MISSING",
          `Route ${route.canonicalNeed} references missing example ${example}.`,
          route,
          example,
        ),
      );
    }
  }
}

/**
 * Validate a route's referenced metadata and filesystem resources, and produce a resolved route when valid.
 *
 * Validations performed include: existence of a lifecycle entry for the preferred component, lifecycle deprecation status,
 * existence of a coverage entry (by coverageName or component name), and existence of files referenced by `sourceRefs` and `examples`.
 *
 * @param rootDir - Root directory used to resolve lifecycle/coverage manifests and to check referenced files on disk.
 * @param route - The routing entry to validate and resolve.
 * @param matchedNeed - The normalized need string that matched this route.
 * @param matchedAlias - The alias that matched the need, or `null` if the canonical need matched.
 * @returns An object with `ok` set to `true` when no diagnostics were produced, `route` set to the resolved route when lifecycle and coverage entries were found (otherwise `null`), and `diagnostics` containing any RouteDiagnostic entries collected during validation.
 */
function resolveRoute(
  rootDir: string,
  route: AgentUiRouteSource,
  matchedNeed: string,
  matchedAlias: string | null,
  lifecycleEntries: ComponentLifecycleEntry[],
  coverageEntries: ComponentCoverageEntry[],
): RouteResolutionResult {
  const diagnostics: RouteDiagnostic[] = [];
  const lifecycleEntry = lifecycleEntries.find(
    (entry) => entry.name === route.preferredComponent.name,
  );
  const coverageName = route.preferredComponent.coverageName ?? route.preferredComponent.name;
  const coverageEntry = coverageEntries.find((entry) => entry.name === coverageName);

  if (!lifecycleEntry) {
    diagnostics.push(
      toRouteDiagnostic(
        "E_DESIGN_ROUTE_LIFECYCLE_MISSING",
        `Route ${route.canonicalNeed} points at ${route.preferredComponent.name}, but no lifecycle entry exists.`,
        route,
      ),
    );
  } else if (lifecycleEntry.lifecycle === "deprecated") {
    diagnostics.push(
      toRouteDiagnostic(
        "E_DESIGN_ROUTE_DEPRECATED",
        `Route ${route.canonicalNeed} points at deprecated component ${route.preferredComponent.name}.`,
        route,
      ),
    );
  }

  if (!coverageEntry) {
    diagnostics.push(
      toRouteDiagnostic(
        "E_DESIGN_ROUTE_COVERAGE_MISSING",
        `Route ${route.canonicalNeed} points at ${coverageName}, but no coverage row exists.`,
        route,
      ),
    );
  }

  validateRouteSourceRefs(rootDir, route, diagnostics);
  validateRouteExamples(rootDir, route, diagnostics);

  if (!lifecycleEntry || !coverageEntry) {
    return { ok: false, route: null, diagnostics };
  }

  const resolved: ResolvedAgentUiRoute = {
    ...route,
    lifecycleEntry,
    coverageEntry,
    matchedNeed,
    matchedAlias,
  };
  return { ok: diagnostics.length === 0, route: resolved, diagnostics };
}

/**
 * Load the agent UI routing manifest from disk and return the routing table with routes sorted by canonicalNeed.
 *
 * @param rootDir - Filesystem root directory containing the routing manifest (defaults to current working directory)
 * @returns The parsed Agent UI routing table with `routes` sorted ascending by `canonicalNeed`
 * @throws If the manifest's `schemaVersion` is not `agent-ui-routing.v1`
 */
export function loadAgentUiRoutingTable(rootDir = process.cwd()): AgentUiRoutingTable {
  const table = parseRoutingTable(readJson(rootDir, ROUTING_PATH));
  if (table.schemaVersion !== "agent-ui-routing.v1") {
    throw new Error(`Unsupported routing schema version: ${table.schemaVersion}`);
  }
  return {
    ...table,
    routes: [...table.routes].sort((left, right) =>
      left.canonicalNeed.localeCompare(right.canonicalNeed),
    ),
  };
}

/**
 * Resolves an agent UI route for a given need string.
 *
 * Searches the routing table for a route whose canonical need, declared need, or any alias
 * matches the normalized form of `need`. If exactly one route matches, further validates
 * component lifecycle and coverage and returns a fully resolved route with diagnostics.
 *
 * @param need - The functional need identifier to resolve (e.g., "settings_panel" or an alias)
 * @param rootDir - Path to the repository root used to load routing, lifecycle, coverage, and referenced files; defaults to the current working directory
 * @returns A RouteResolutionResult where `ok` is `true` if a single route was resolved with no diagnostics; `route` is the resolved route on success or `null` on failure; `diagnostics` contains any matching or validation errors (for example, missing/ambiguous route, missing lifecycle/coverage entries, or missing referenced files)
 */
export function resolveRouteForNeed(need: string, rootDir = process.cwd()): RouteResolutionResult {
  const normalizedNeed = normalizeNeed(need);
  const table = loadAgentUiRoutingTable(rootDir);
  const matches = table.routes.filter((route) => {
    if (
      normalizeNeed(route.canonicalNeed) === normalizedNeed ||
      normalizeNeed(route.need) === normalizedNeed
    ) {
      return true;
    }
    return route.aliases.some((alias) => normalizeNeed(alias) === normalizedNeed);
  });

  if (matches.length === 0) {
    return {
      ok: false,
      route: null,
      diagnostics: [
        {
          code: "E_DESIGN_PROPOSAL_REQUIRED",
          message: `No canonical agent UI route exists for need '${need}'; create an abstraction proposal before adding a route.`,
        },
      ],
    };
  }

  if (matches.length > 1) {
    return {
      ok: false,
      route: null,
      diagnostics: [
        {
          code: "E_DESIGN_ROUTE_AMBIGUOUS",
          message: `Need '${need}' matched multiple agent UI routes.`,
        },
      ],
    };
  }

  const route = matches[0];
  const matchedAlias =
    route.aliases.find((alias) => normalizeNeed(alias) === normalizedNeed) ?? null;
  return resolveRoute(
    rootDir,
    route,
    normalizedNeed,
    matchedAlias,
    loadLifecycle(rootDir),
    loadCoverage(rootDir),
  );
}

/**
 * Finds the agent UI route that corresponds to a given source surface path and resolves it.
 *
 * Resolves a matching route based on authored surface patterns and validates the matched
 * route's lifecycle, coverage, source refs, and examples; returns diagnostics if no match or
 * if validation issues are found.
 *
 * @param surfacePath - File system path to the surface (component or page) to resolve
 * @param rootDir - Repository root directory used to resolve and validate referenced files
 * @returns An object containing `ok`, the resolved `route` when found, and any `diagnostics` describing issues or missing route matches
 */
export function resolveRouteForSurface(
  surfacePath: string,
  rootDir = process.cwd(),
): RouteResolutionResult {
  const normalizedSurface = normalizeSurfacePath(rootDir, surfacePath);
  if (!normalizedSurface) {
    return {
      ok: false,
      route: null,
      diagnostics: [
        {
          code: "E_DESIGN_ROUTE_MISSING",
          message: `Surface '${surfacePath}' resolves outside the repository root.`,
          path: surfacePath,
        },
      ],
    };
  }
  const table = loadAgentUiRoutingTable(rootDir);
  const candidates = table.routes
    .flatMap((route) =>
      route.surfacePatterns
        .filter((pattern) => matchesSurfacePattern(normalizedSurface, pattern))
        .map((pattern) => ({ route, pattern, score: scoreSurfacePattern(pattern) })),
    )
    .sort((left, right) => {
      if (left.score.wildcardCount !== right.score.wildcardCount) {
        return left.score.wildcardCount - right.score.wildcardCount;
      }
      if (left.score.literalLength !== right.score.literalLength) {
        return right.score.literalLength - left.score.literalLength;
      }
      return left.route.canonicalNeed.localeCompare(right.route.canonicalNeed);
    });

  if (candidates.length === 0) {
    return {
      ok: false,
      route: null,
      diagnostics: [
        {
          code: "E_DESIGN_ROUTE_MISSING",
          message: `No agent UI route exists for surface '${surfacePath}'.`,
          path: surfacePath,
        },
      ],
    };
  }

  // Detect ties: if multiple distinct routes share the top score, report ambiguity
  const topScore = candidates[0].score;
  const topCandidates = candidates.filter(
    (candidate) =>
      candidate.score.wildcardCount === topScore.wildcardCount &&
      candidate.score.literalLength === topScore.literalLength,
  );
  const uniqueRoutes = new Set(topCandidates.map((candidate) => candidate.route.canonicalNeed));

  if (uniqueRoutes.size > 1) {
    return {
      ok: false,
      route: null,
      diagnostics: [
        {
          code: "E_DESIGN_ROUTE_AMBIGUOUS",
          message: `Surface '${surfacePath}' matched multiple agent UI routes with identical specificity.`,
          path: surfacePath,
        },
      ],
    };
  }

  const match = candidates[0].route;

  return resolveRoute(
    rootDir,
    match,
    match.canonicalNeed,
    null,
    loadLifecycle(rootDir),
    loadCoverage(rootDir),
  );
}

/**
 * Build a remediation context for a given design need containing route details, replacement guidance, validation commands, forbidden patterns, and diagnostics.
 *
 * @param need - The design need to resolve (e.g., a canonical or alias string)
 * @param rootDir - Project root directory used to load routing and metadata files; defaults to `process.cwd()`
 * @returns A RemediationContext with:
 *  - `need`: the original input need
 *  - `route`: the resolved route or `null` if not found
 *  - `forbiddenPatterns`: array of patterns from the route's `avoid` field or `[]`
 *  - `replacementInstructions`: human-readable replacement/import guidance or `[]`
 *  - `validationCommands`: route-specific validation commands or `[]`
 *  - `diagnostics`: accumulated resolution diagnostics
 */
export function resolveRemediationContext(
  need: string,
  rootDir = process.cwd(),
): RemediationContext {
  const result = resolveRouteForNeed(need, rootDir);
  return {
    need,
    route: result.route,
    forbiddenPatterns: result.route?.avoid ?? [],
    replacementInstructions: result.route
      ? [
          `Prefer ${result.route.preferredComponent.name}.`,
          `Import from ${result.route.preferredComponent.packageName}; source path ${result.route.preferredComponent.importPath}.`,
        ]
      : [],
    validationCommands:
      result.route?.validationCommands.filter((command) => command.safetyClass === "read_only") ??
      [],
    diagnostics: result.diagnostics,
  };
}

/**
 * Validate every route in the agent UI routing table and collect diagnostics.
 *
 * @param rootDir - Root directory used to resolve manifests and referenced file paths; defaults to the current working directory
 * @returns An array of `RouteDiagnostic` objects gathered from validating each route
 */
export function validateAgentUiRoutingTable(rootDir = process.cwd()): RouteDiagnostic[] {
  const table = loadAgentUiRoutingTable(rootDir);
  const lifecycleEntries = loadLifecycle(rootDir);
  const coverageEntries = loadCoverage(rootDir);
  return table.routes.flatMap(
    (route) =>
      resolveRoute(rootDir, route, route.canonicalNeed, null, lifecycleEntries, coverageEntries)
        .diagnostics,
  );
}
