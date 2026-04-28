import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadAgentUiRoutingTable, resolveRemediationContext } from "./routes.js";
import type {
  AbstractionProposalPreview,
  AgentUiRouteSource,
  ComponentCoverageEntry,
  ComponentLifecycleEntry,
  ProposalGateDiagnostic,
  ProposalGateResult,
  ProposalWaiver,
  ProposalWaiverRegistry,
  ProposalWaiverScope,
  RemediationContext,
} from "./types.js";

export const PROPOSAL_TEMPLATE_PATH = "docs/design-system/proposals/TEMPLATE.md";
export const PROPOSAL_WAIVER_REGISTRY_PATH = "docs/design-system/proposals/waivers.json";

const LIFECYCLE_PATH = "docs/design-system/COMPONENT_LIFECYCLE.json";
const COVERAGE_PATH = "docs/design-system/COVERAGE_MATRIX.json";
const PROPOSAL_REQUIRED_FIELDS = [
  "proposal id",
  "status",
  "owner",
  "gap",
  "existing primitives considered",
  "proposed primitive or route",
  "lifecycle impact",
  "coverage impact",
  "gold example impact",
  "validation plan",
  "rollback plan",
];

/**
 * Read and parse a JSON file located at a path resolved relative to a repository root.
 *
 * @param rootDir - The base directory used to resolve `relativePath`
 * @param relativePath - File path relative to `rootDir`
 * @returns The parsed JSON value as `unknown` so callers must validate it.
 */
function readJson(
  rootDir: string,
  relativePath: string,
  diagnostics: ProposalGateDiagnostic[],
  code: ProposalGateDiagnostic["code"],
): unknown {
  try {
    return JSON.parse(readFileSync(path.join(rootDir, relativePath), "utf8")) as unknown;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    pushDiagnostic(diagnostics, {
      code,
      severity: "error",
      message: `Unable to read or parse ${relativePath}: ${reason}`,
      path: relativePath,
    });
    return null;
  }
}

/**
 * Appends a proposal gate diagnostic to the diagnostics collection.
 *
 * @param diagnostics - The array that will receive the diagnostic
 * @param diagnostic - The diagnostic to append
 */
function pushDiagnostic(
  diagnostics: ProposalGateDiagnostic[],
  diagnostic: ProposalGateDiagnostic,
): void {
  diagnostics.push(diagnostic);
}

/**
 * Parses an ISO date string in `YYYY-MM-DD` format and returns a UTC Date at midnight.
 *
 * @param value - The date string in `YYYY-MM-DD` format.
 * @returns A Date set to `T00:00:00.000Z` for the given day, or `null` if the input is not a valid `YYYY-MM-DD` date.
 */
function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  const [, year, month, day] = match;
  if (
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    return null;
  }
  return parsed;
}

/**
 * Compute the whole-day difference between two dates.
 *
 * @param left - The later date in the comparison
 * @param right - The earlier date in the comparison
 * @returns The number of whole days from `right` to `left`, rounded down; negative if `left` is earlier than `right`
 */
function dayDiff(left: Date, right: Date): number {
  return Math.floor((left.getTime() - right.getTime()) / 86_400_000);
}

/**
 * Builds a unique key for a waiver from its scope and target.
 *
 * @returns A string in the format `"<scope>:<target>"` that uniquely identifies the waiver
 */
function waiverKey(scope: ProposalWaiverScope, target: string): string {
  return `${scope}:${target}`;
}

/**
 * Determines whether a value is a valid proposal waiver scope.
 *
 * @param value - The value to test; expected string `'agent-ui-route'` or `'component-lifecycle'`
 * @returns `true` if `value` is a recognized proposal waiver scope, `false` otherwise
 */
function isWaiverScope(value: unknown): value is ProposalWaiverScope {
  return value === "agent-ui-route" || value === "component-lifecycle";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function optionalString(value: unknown): string | undefined {
  return isString(value) ? value : undefined;
}

function parseWaiverRegistry(value: unknown): ProposalWaiverRegistry {
  if (!isObject(value)) {
    return { schemaVersion: "agent-design.proposal-waivers.v1", updatedAt: "", waivers: [] };
  }

  const waivers = Array.isArray(value.waivers)
    ? value.waivers.filter(isObject).map((entry) => ({
        id: optionalString(entry.id) ?? "",
        ruleId: optionalString(entry.ruleId) ?? "",
        scope: optionalString(entry.scope) as ProposalWaiverScope,
        target: optionalString(entry.target) ?? "",
        owner: optionalString(entry.owner) ?? "",
        ticket: optionalString(entry.ticket),
        issue: optionalString(entry.issue),
        issueUrl: optionalString(entry.issueUrl),
        adrRef: optionalString(entry.adrRef),
        reason: optionalString(entry.reason) ?? "",
        expiresAt: optionalString(entry.expiresAt) ?? "",
        cleanupMilestone: optionalString(entry.cleanupMilestone) ?? "",
        cleanup: optionalString(entry.cleanup) ?? "",
        status: optionalString(entry.status) as ProposalWaiver["status"],
      }))
    : [];

  return {
    schemaVersion: optionalString(value.schemaVersion) as ProposalWaiverRegistry["schemaVersion"],
    updatedAt: optionalString(value.updatedAt) ?? "",
    waivers,
  };
}

function waiverRegistrySchemaDiagnostics(value: unknown): string[] {
  const diagnostics: string[] = [];
  if (!isObject(value)) {
    return ["Proposal waiver registry must be a JSON object."];
  }
  if (!Array.isArray(value.waivers)) {
    diagnostics.push("Proposal waiver registry must define a waivers array.");
  }
  return diagnostics;
}

function parseLifecycleManifest(value: unknown): { components: ComponentLifecycleEntry[] } {
  if (!isObject(value) || !Array.isArray(value.components)) return { components: [] };
  return {
    components: value.components.filter(isObject).map((entry) => ({
      name: optionalString(entry.name) ?? "",
      path: optionalString(entry.path) ?? "",
      lifecycle: optionalString(entry.lifecycle) as ComponentLifecycleEntry["lifecycle"],
      routing_tier: typeof entry.routing_tier === "number" ? entry.routing_tier : 0,
      notes: optionalString(entry.notes) ?? "",
      proposalRef: optionalString(entry.proposalRef),
    })),
  };
}

function lifecycleManifestSchemaDiagnostics(value: unknown): string[] {
  if (!isObject(value)) return ["Lifecycle manifest must be a JSON object."];
  if (!Array.isArray(value.components))
    return ["Lifecycle manifest must define a components array."];
  return value.components.flatMap((entry, index) => {
    if (!isObject(entry)) {
      return [`Lifecycle manifest component ${index} must be a JSON object.`];
    }
    const messages: string[] = [];
    if (
      !["canonical", "transitional", "deprecated"].includes(optionalString(entry.lifecycle) ?? "")
    ) {
      messages.push(`Lifecycle manifest component ${index} must define a valid lifecycle.`);
    }
    if (typeof entry.routing_tier !== "number" || !Number.isInteger(entry.routing_tier)) {
      messages.push(`Lifecycle manifest component ${index} must define an integer routing_tier.`);
    }
    return messages;
  });
}

function parseCoverageEntries(value: unknown): ComponentCoverageEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isObject).map((entry) => ({
    name: optionalString(entry.name) ?? "",
    source: optionalString(entry.source) ?? "",
    upstream: isString(entry.upstream) ? entry.upstream : null,
    fallback: isString(entry.fallback) ? entry.fallback : null,
    status: optionalString(entry.status) ?? "",
    web_used: entry.web_used === true,
    tauri_used: entry.tauri_used === true,
    widget_used: entry.widget_used === true,
  }));
}

function hasWaiverLinkage(waiver: ProposalWaiver): boolean {
  return Boolean(
    waiver.ticket?.trim() ||
      waiver.issue?.trim() ||
      waiver.issueUrl?.trim() ||
      waiver.adrRef?.trim(),
  );
}

/**
 * Validates a proposal waiver registry and returns a map of currently active waivers keyed by scope and target.
 *
 * Validates registry schema version and shape, ensures each waiver has required typed fields, a valid scope,
 * a status of `active` or `retired`, and a parsable `expiresAt` date. Emits error diagnostics for schema issues,
 * missing/invalid waiver fields, and expired waivers; emits a warning diagnostic for waivers that will expire within 14 days.
 *
 * @param registry - The parsed proposal waiver registry to validate
 * @param diagnostics - Array to which validation diagnostics will be appended
 * @param today - Reference date used to evaluate waiver expiry
 * @returns A map of active `ProposalWaiver` objects keyed by `"{scope}:{target}"` for waivers that are valid and not expired
 */
function validateWaiverRegistryShape(
  registry: ProposalWaiverRegistry,
  diagnostics: ProposalGateDiagnostic[],
  today: Date,
): Map<string, ProposalWaiver> {
  const activeWaivers = new Map<string, ProposalWaiver>();

  if (registry.schemaVersion !== "agent-design.proposal-waivers.v1") {
    pushDiagnostic(diagnostics, {
      code: "E_DESIGN_PROPOSAL_WAIVER_SCHEMA",
      severity: "error",
      message: `Unsupported proposal waiver schema version: ${registry.schemaVersion}.`,
      path: PROPOSAL_WAIVER_REGISTRY_PATH,
    });
  }

  if (!Array.isArray(registry.waivers)) {
    pushDiagnostic(diagnostics, {
      code: "E_DESIGN_PROPOSAL_WAIVER_SCHEMA",
      severity: "error",
      message: "Proposal waiver registry must define a waivers array.",
      path: PROPOSAL_WAIVER_REGISTRY_PATH,
    });
    return activeWaivers;
  }

  for (const waiver of registry.waivers) {
    const missingFields = [
      "id",
      "ruleId",
      "scope",
      "target",
      "owner",
      "reason",
      "expiresAt",
      "cleanupMilestone",
      "cleanup",
      "status",
    ].filter(
      (field) => !String((waiver as unknown as Record<string, unknown>)[field] ?? "").trim(),
    );
    const expiresAt = parseDateOnly(waiver.expiresAt);

    if (
      missingFields.length > 0 ||
      !isWaiverScope(waiver.scope) ||
      (waiver.status !== "active" && waiver.status !== "retired") ||
      !hasWaiverLinkage(waiver) ||
      !expiresAt
    ) {
      pushDiagnostic(diagnostics, {
        code: "E_DESIGN_PROPOSAL_WAIVER_SCHEMA",
        severity: "error",
        message: `Proposal waiver ${waiver.id || "(missing id)"} is missing typed fields: ${missingFields.join(", ") || "invalid scope/status/linkage/expiresAt"}.`,
        path: PROPOSAL_WAIVER_REGISTRY_PATH,
        waiverId: waiver.id,
      });
      continue;
    }

    if (waiver.status !== "active") continue;

    const daysRemaining = dayDiff(expiresAt, today);
    if (daysRemaining < 0) {
      pushDiagnostic(diagnostics, {
        code: "E_DESIGN_PROPOSAL_WAIVER_EXPIRED",
        severity: "error",
        message: `Proposal waiver ${waiver.id} expired on ${waiver.expiresAt}.`,
        path: PROPOSAL_WAIVER_REGISTRY_PATH,
        scope: waiver.scope,
        target: waiver.target,
        waiverId: waiver.id,
      });
      continue;
    }

    if (daysRemaining <= 14) {
      pushDiagnostic(diagnostics, {
        code: "W_DESIGN_PROPOSAL_WAIVER_NEAR_EXPIRY",
        severity: "warn",
        message: `Proposal waiver ${waiver.id} expires in ${daysRemaining} day(s).`,
        path: PROPOSAL_WAIVER_REGISTRY_PATH,
        scope: waiver.scope,
        target: waiver.target,
        waiverId: waiver.id,
      });
    }

    const key = waiverKey(waiver.scope, waiver.target);
    if (activeWaivers.has(key)) {
      pushDiagnostic(diagnostics, {
        code: "E_DESIGN_PROPOSAL_WAIVER_DUPLICATE",
        severity: "error",
        message: `Multiple active proposal waivers found for ${waiver.scope}:${waiver.target}.`,
        path: PROPOSAL_WAIVER_REGISTRY_PATH,
        scope: waiver.scope,
        target: waiver.target,
        waiverId: waiver.id,
      });
      continue;
    }

    activeWaivers.set(key, waiver);
  }

  return activeWaivers;
}

/**
 * Checks whether an active waiver exists for the specified scope and target.
 *
 * @param waivers - Map of active waivers keyed by "{scope}:{target}"
 * @param scope - The waiver scope to look up (e.g., "agent-ui-route" or "component-lifecycle")
 * @param target - The waiver target identifier (for routes this is the canonical need; for components this is the component name)
 * @returns `true` if an active waiver exists for the given scope and target, `false` otherwise.
 */
function hasActiveWaiver(
  waivers: Map<string, ProposalWaiver>,
  scope: ProposalWaiverScope,
  target: string,
): boolean {
  return waivers.has(waiverKey(scope, target));
}

/**
 * Determines whether a referenced proposal file is missing, accepted, or not accepted.
 *
 * The reference may include a `#` fragment; the portion before `#` is resolved relative to `rootDir`.
 *
 * @param rootDir - Repository root used to resolve the proposal path
 * @param proposalRef - Proposal reference (may include a `#` fragment). If omitted or if the resolved path does not exist or escapes `rootDir`, the proposal is considered missing.
 * @returns `"missing"` if the referenced file is absent or escapes the repository root, `"accepted"` if the file contains an accepted status marker, `"not-accepted"` otherwise.
 */
function proposalRefStatus(
  rootDir: string,
  proposalRef?: string,
): "missing" | "accepted" | "not-accepted" {
  if (!proposalRef) return "missing";
  const proposalPath = proposalRef.split("#")[0];
  const repoRoot = path.resolve(rootDir);
  const absolutePath = path.resolve(repoRoot, proposalPath);
  if (
    !proposalPath ||
    (absolutePath !== repoRoot && !absolutePath.startsWith(`${repoRoot}${path.sep}`)) ||
    !existsSync(absolutePath)
  ) {
    return "missing";
  }
  const content = readFileSync(absolutePath, "utf8");
  if (/^status:\s*accepted\s*$/im.test(content) || /\bStatus:\s*Accepted\b/i.test(content)) {
    return "accepted";
  }
  return "not-accepted";
}

/**
 * Validate that an "enforced" agent UI route references an accepted abstraction proposal or has an active waiver, emitting an error diagnostic if neither is present.
 *
 * @param rootDir - Filesystem root used to resolve proposal references
 * @param route - The routing table entry to validate
 * @param waivers - Map of active waivers keyed by `"{scope}:{target}"`
 * @param diagnostics - Mutable diagnostics array to which any violation diagnostic will be appended
 */
function validateRouteProposalGate(
  rootDir: string,
  route: AgentUiRouteSource,
  waivers: Map<string, ProposalWaiver>,
  diagnostics: ProposalGateDiagnostic[],
): void {
  if (route.routeMaturity !== "enforced") return;
  const refStatus = proposalRefStatus(rootDir, route.proposalRef);
  if (refStatus === "accepted") return;
  if (hasActiveWaiver(waivers, "agent-ui-route", route.canonicalNeed)) return;

  pushDiagnostic(diagnostics, {
    code:
      refStatus === "missing" ? "E_DESIGN_PROPOSAL_REQUIRED" : "E_DESIGN_PROPOSAL_REF_NOT_ACCEPTED",
    severity: "error",
    message: `Enforced route ${route.canonicalNeed} must reference an accepted abstraction proposal or typed waiver.`,
    scope: "agent-ui-route",
    target: route.canonicalNeed,
    path: "docs/design-system/AGENT_UI_ROUTING.json",
  });
}

/**
 * Enforces that a canonical component lifecycle with routing tier >= 2 has coverage, an accepted proposal, or an active waiver.
 *
 * When `lifecycle.lifecycle === "canonical"` and `lifecycle.routing_tier >= 2`, this function returns early if the component
 * has a coverage entry, if its referenced proposal is accepted, or if there is an active `component-lifecycle` waiver for the component.
 * If none of those conditions apply, it appends an `E_DESIGN_LIFECYCLE_COVERAGE_MISSING` error diagnostic to `diagnostics`.
 *
 * @param rootDir - Repository root used to resolve referenced proposal files
 * @param lifecycle - The lifecycle entry to validate
 * @param coverageEntries - List of component coverage entries to check for existing coverage
 * @param waivers - Map of active waivers keyed by `"{scope}:{target}"`
 * @param diagnostics - Array to which diagnostics will be appended
 */
function validateLifecycleProposalGate(
  rootDir: string,
  lifecycle: ComponentLifecycleEntry,
  coverageEntries: ComponentCoverageEntry[],
  waivers: Map<string, ProposalWaiver>,
  diagnostics: ProposalGateDiagnostic[],
): void {
  if (lifecycle.lifecycle !== "canonical" || lifecycle.routing_tier < 2) return;
  const hasCoverage = coverageEntries.some((entry) => entry.name === lifecycle.name);
  if (hasCoverage) return;

  const refStatus = proposalRefStatus(rootDir, lifecycle.proposalRef);
  if (refStatus === "accepted") return;
  if (hasActiveWaiver(waivers, "component-lifecycle", lifecycle.name)) return;

  pushDiagnostic(diagnostics, {
    code: "E_DESIGN_LIFECYCLE_COVERAGE_MISSING",
    severity: "error",
    message: `Canonical lifecycle component ${lifecycle.name} must have coverage data, an accepted proposal, or a typed waiver.`,
    scope: "component-lifecycle",
    target: lifecycle.name,
    path: LIFECYCLE_PATH,
  });
}

/**
 * Validate design-system proposal gates and collect diagnostics about missing, expired, or non-accepted proposals and waivers.
 *
 * Runs validation of the proposal waiver registry and enforces gates for agent UI routing and component lifecycle proposals, producing diagnostic entries for schema errors, missing or unaccepted proposal references, expired waivers, and related conditions.
 *
 * @param rootDir - Repository root to resolve registry, routing, lifecycle, and coverage files (defaults to process.cwd()).
 * @param options.today - Current date in `YYYY-MM-DD` format used for waiver expiry checks.
 * @returns A `ProposalGateResult` containing:
 *  - `ok`: `true` when there are no diagnostics with severity `"error"`, `false` otherwise;
 *  - `diagnostics`: collected `ProposalGateDiagnostic` entries;
 *  - `waiverRegistryPath`: the path used to locate the waiver registry.
 */
export function validateProposalGate(
  rootDir = process.cwd(),
  options: { today?: string } = {},
): ProposalGateResult {
  const diagnostics: ProposalGateDiagnostic[] = [];
  const waiverRegistryFile = path.join(rootDir, PROPOSAL_WAIVER_REGISTRY_PATH);
  if (!existsSync(waiverRegistryFile)) {
    pushDiagnostic(diagnostics, {
      code: "E_DESIGN_PROPOSAL_WAIVERS_MISSING",
      severity: "error",
      message: `Proposal waiver registry is missing at ${PROPOSAL_WAIVER_REGISTRY_PATH}.`,
      path: PROPOSAL_WAIVER_REGISTRY_PATH,
    });
    return {
      kind: "astudio.design.proposalGate.v1",
      ok: false,
      diagnostics,
      waiverRegistryPath: PROPOSAL_WAIVER_REGISTRY_PATH,
    };
  }

  const today = options.today ? parseDateOnly(options.today) : null;
  if (!today) {
    pushDiagnostic(diagnostics, {
      code: "E_DESIGN_PROPOSAL_WAIVER_SCHEMA",
      severity: "error",
      message: "Proposal gate requires an explicit valid today value in YYYY-MM-DD format.",
      path: PROPOSAL_WAIVER_REGISTRY_PATH,
    });
    return {
      kind: "astudio.design.proposalGate.v1",
      ok: false,
      diagnostics,
      waiverRegistryPath: PROPOSAL_WAIVER_REGISTRY_PATH,
    };
  }

  const registrySource = readJson(
    rootDir,
    PROPOSAL_WAIVER_REGISTRY_PATH,
    diagnostics,
    "E_DESIGN_PROPOSAL_WAIVER_SCHEMA",
  );
  for (const message of waiverRegistrySchemaDiagnostics(registrySource)) {
    pushDiagnostic(diagnostics, {
      code: "E_DESIGN_PROPOSAL_WAIVER_SCHEMA",
      severity: "error",
      message,
      path: PROPOSAL_WAIVER_REGISTRY_PATH,
    });
  }
  const registry = parseWaiverRegistry(registrySource);
  const waivers = validateWaiverRegistryShape(registry, diagnostics, today);
  const routingTable = loadAgentUiRoutingTable(rootDir);
  const lifecycleManifest = readJson(
    rootDir,
    LIFECYCLE_PATH,
    diagnostics,
    "E_DESIGN_LIFECYCLE_SCHEMA",
  );
  for (const message of lifecycleManifestSchemaDiagnostics(lifecycleManifest)) {
    pushDiagnostic(diagnostics, {
      code: "E_DESIGN_LIFECYCLE_SCHEMA",
      severity: "error",
      message,
      path: LIFECYCLE_PATH,
    });
  }
  const lifecycleEntries = parseLifecycleManifest(lifecycleManifest).components;
  const coverageEntries = parseCoverageEntries(
    readJson(rootDir, COVERAGE_PATH, diagnostics, "E_DESIGN_COVERAGE_SCHEMA"),
  );

  for (const route of routingTable.routes) {
    validateRouteProposalGate(rootDir, route, waivers, diagnostics);
  }

  for (const lifecycle of lifecycleEntries) {
    validateLifecycleProposalGate(rootDir, lifecycle, coverageEntries, waivers, diagnostics);
  }

  return {
    kind: "astudio.design.proposalGate.v1",
    ok: diagnostics.every((diagnostic) => diagnostic.severity !== "error"),
    diagnostics,
    waiverRegistryPath: PROPOSAL_WAIVER_REGISTRY_PATH,
  };
}

/**
 * Builds a read-only preview object for proposing an abstraction for a given need.
 *
 * @param need - The canonical need identifier the proposal targets.
 * @param rootDir - Repository root used to resolve remediation context; defaults to the current working directory.
 * @param surface - Optional surface/context string to include in the preview.
 * @returns An `AbstractionProposalPreview` populated with template path, required fields, remediation context, and flags; `proposalRequired` is `true` when no remediation route exists.
 */
export function buildAbstractionProposalPreview(
  need: string,
  rootDir = process.cwd(),
  surface: string | null = null,
): AbstractionProposalPreview {
  const remediation: RemediationContext = resolveRemediationContext(need, rootDir);
  return {
    kind: "astudio.design.proposeAbstraction.v1",
    need,
    surface,
    proposalRequired: remediation.route === null,
    proposalTemplatePath: PROPOSAL_TEMPLATE_PATH,
    requiredFields: PROPOSAL_REQUIRED_FIELDS,
    previewOnly: true,
    readOnly: true,
    remediation,
  };
}
