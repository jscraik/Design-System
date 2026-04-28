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

function readJson<T>(rootDir: string, relativePath: string): T {
  return JSON.parse(readFileSync(path.join(rootDir, relativePath), "utf8")) as T;
}

function normalizeNeed(need: string): string {
  return need.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

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

function loadLifecycle(rootDir: string): ComponentLifecycleEntry[] {
  const manifest = readJson<{ components: ComponentLifecycleEntry[] }>(rootDir, lifecyclePath);
  return manifest.components;
}

function loadCoverage(rootDir: string): ComponentCoverageEntry[] {
  return readJson<ComponentCoverageEntry[]>(rootDir, coveragePath);
}

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

function resolveRoute(
  rootDir: string,
  route: AgentUiRouteSource,
  matchedNeed: string,
  matchedAlias: string | null,
): RouteResolutionResult {
  const diagnostics: RouteDiagnostic[] = [];
  const lifecycleEntries = loadLifecycle(rootDir);
  const coverageEntries = loadCoverage(rootDir);
  const lifecycleEntry = lifecycleEntries.find((entry) => entry.name === route.preferredComponent.name);
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

export function loadAgentUiRoutingTable(rootDir = process.cwd()): AgentUiRoutingTable {
  const table = readJson<AgentUiRoutingTable>(rootDir, routingPath);
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

export function resolveRouteForNeed(need: string, rootDir = process.cwd()): RouteResolutionResult {
  const normalizedNeed = normalizeNeed(need);
  const table = loadAgentUiRoutingTable(rootDir);
  const matches = table.routes.filter((route) => {
    if (normalizeNeed(route.canonicalNeed) === normalizedNeed || normalizeNeed(route.need) === normalizedNeed) {
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
          code: "E_DESIGN_ROUTE_MISSING",
          message: `No agent UI route exists for need '${need}'.`,
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
  const matchedAlias = route.aliases.find((alias) => normalizeNeed(alias) === normalizedNeed) ?? null;
  return resolveRoute(rootDir, route, normalizedNeed, matchedAlias);
}

export function resolveRouteForSurface(
  surfacePath: string,
  rootDir = process.cwd(),
): RouteResolutionResult {
  const normalizedSurface = surfacePath.split(path.sep).join("/");
  const table = loadAgentUiRoutingTable(rootDir);
  const match = table.routes.find((route) => {
    if (route.canonicalNeed === "settings_panel" && normalizedSurface.startsWith("packages/ui/src/app/settings/")) {
      return true;
    }
    if (route.canonicalNeed === "page_shell" && normalizedSurface.startsWith("platforms/web/apps/web/src/pages/")) {
      return true;
    }
    return false;
  });

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

  return resolveRoute(rootDir, match, match.canonicalNeed, null);
}

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

export function validateAgentUiRoutingTable(rootDir = process.cwd()): RouteDiagnostic[] {
  const table = loadAgentUiRoutingTable(rootDir);
  return table.routes.flatMap((route) =>
    resolveRoute(rootDir, route, route.canonicalNeed, null).diagnostics,
  );
}
