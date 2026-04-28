import { existsSync, readFileSync } from "node:fs";
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

const routingPath = "docs/design-system/AGENT_UI_ROUTING.json";
const lifecyclePath = "docs/design-system/COMPONENT_LIFECYCLE.json";
const coveragePath = "docs/design-system/COVERAGE_MATRIX.json";

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
  return typeof value === "object" && value !== null;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function parsePreferredComponent(value: unknown): AgentUiRouteSource["preferredComponent"] {
  const component = isObject(value) ? value : {};
  return {
    name: optionalString(component.name) ?? "",
    importPath: optionalString(component.importPath) ?? "",
    packageName: optionalString(component.packageName) ?? "",
    coverageName: optionalString(component.coverageName),
  };
}

function parseFallback(value: unknown): AgentUiRouteSource["fallbacks"][number] {
  const fallback = isObject(value) ? value : {};
  return {
    component: optionalString(fallback.component) ?? "",
    reason: optionalString(fallback.reason) ?? "",
  };
}

function parseValidationCommand(value: unknown): AgentUiRouteSource["validationCommands"][number] {
  const command = isObject(value) ? value : {};
  return {
    command: optionalString(command.command) ?? "",
    safetyClass:
      command.safetyClass === "read_only" ||
      command.safetyClass === "mutating" ||
      command.safetyClass === "interactive" ||
      command.safetyClass === "server_start"
        ? command.safetyClass
        : "read_only",
    reason: optionalString(command.reason) ?? "",
    blockedByDefault:
      typeof command.blockedByDefault === "boolean" ? command.blockedByDefault : undefined,
  };
}

function parseRouteSource(value: unknown): AgentUiRouteSource {
  const route = isObject(value) ? value : {};
  return {
    need: optionalString(route.need) ?? "",
    canonicalNeed: optionalString(route.canonicalNeed) ?? "",
    aliases: stringArray(route.aliases),
    proposalRef: optionalString(route.proposalRef),
    preferredComponent: parsePreferredComponent(route.preferredComponent),
    lifecycleStatus:
      route.lifecycleStatus === "canonical" || route.lifecycleStatus === "transitional"
        ? route.lifecycleStatus
        : "transitional",
    routeMaturity:
      route.routeMaturity === "enforced" || route.routeMaturity === "provisional"
        ? route.routeMaturity
        : "provisional",
    surfacePatterns: stringArray(route.surfacePatterns),
    useWhen: stringArray(route.useWhen),
    requiredStates: stringArray(route.requiredStates),
    examples: stringArray(route.examples),
    avoid: stringArray(route.avoid),
    fallbacks: Array.isArray(route.fallbacks) ? route.fallbacks.map(parseFallback) : [],
    validationCommands: Array.isArray(route.validationCommands)
      ? route.validationCommands.map(parseValidationCommand)
      : [],
    sourceRefs: stringArray(route.sourceRefs),
  };
}

function parseRoutingTable(value: unknown): AgentUiRoutingTable {
  if (!isObject(value)) {
    return { schemaVersion: "agent-ui-routing.v1", updatedAt: "", routes: [] };
  }
  return {
    schemaVersion: optionalString(value.schemaVersion) as AgentUiRoutingTable["schemaVersion"],
    updatedAt: optionalString(value.updatedAt) ?? "",
    routes: Array.isArray(value.routes) ? value.routes.map(parseRouteSource) : [],
  };
}

function parseLifecycleManifest(value: unknown): { components: ComponentLifecycleEntry[] } {
  if (!isObject(value) || !Array.isArray(value.components)) return { components: [] };
  return {
    components: value.components.filter(isObject).map((entry) => ({
      name: optionalString(entry.name) ?? "",
      path: optionalString(entry.path) ?? "",
      lifecycle:
        entry.lifecycle === "canonical" ||
        entry.lifecycle === "transitional" ||
        entry.lifecycle === "deprecated"
          ? entry.lifecycle
          : "transitional",
      routing_tier: typeof entry.routing_tier === "number" ? entry.routing_tier : 0,
      proposalRef: optionalString(entry.proposalRef),
      notes: optionalString(entry.notes) ?? "",
    })),
  };
}

function parseCoverageEntries(value: unknown): ComponentCoverageEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isObject).map((entry) => ({
    name: optionalString(entry.name) ?? "",
    source: optionalString(entry.source) ?? "",
    upstream: optionalString(entry.upstream) ?? null,
    fallback: optionalString(entry.fallback) ?? null,
    status: optionalString(entry.status) ?? "",
    web_used: entry.web_used === true,
    tauri_used: entry.tauri_used === true,
    widget_used: entry.widget_used === true,
  }));
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

function normalizeSurfacePath(rootDir: string, surfacePath: string): string {
  return toPosixPath(path.relative(rootDir, path.resolve(rootDir, surfacePath)));
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

/**
 * Load component lifecycle entries from the lifecycle manifest.
 *
 * @param rootDir - Root directory containing the lifecycle manifest file
 * @returns The list of `ComponentLifecycleEntry` objects defined in the lifecycle manifest
 */
function loadLifecycle(rootDir: string): ComponentLifecycleEntry[] {
  const manifest = parseLifecycleManifest(readJson(rootDir, lifecyclePath));
  return manifest.components;
}

/**
 * Loads the component coverage manifest from the project and returns its entries.
 *
 * @param rootDir - Project root directory used to resolve the coverage manifest path
 * @returns The array of ComponentCoverageEntry objects from the coverage manifest
 */
function loadCoverage(rootDir: string): ComponentCoverageEntry[] {
  return parseCoverageEntries(readJson(rootDir, coveragePath));
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
    if (!filePath || !existsSync(path.join(rootDir, filePath))) {
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
    if (!existsSync(path.join(rootDir, example))) {
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
  const table = parseRoutingTable(readJson(rootDir, routingPath));
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
  const match = candidates[0]?.route;

  if (!match) {
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
    validationCommands: result.route?.validationCommands ?? [],
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
