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

export const proposalTemplatePath = "docs/design-system/proposals/TEMPLATE.md";
export const proposalWaiverRegistryPath = "docs/design-system/proposals/waivers.json";

const lifecyclePath = "docs/design-system/COMPONENT_LIFECYCLE.json";
const coveragePath = "docs/design-system/COVERAGE_MATRIX.json";
const proposalRequiredFields = [
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
 * @returns The parsed JSON value cast to type `T`
 */
function readJson<T>(rootDir: string, relativePath: string): T {
  return JSON.parse(readFileSync(path.join(rootDir, relativePath), "utf8")) as T;
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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
      path: proposalWaiverRegistryPath,
    });
  }

  if (!Array.isArray(registry.waivers)) {
    pushDiagnostic(diagnostics, {
      code: "E_DESIGN_PROPOSAL_WAIVER_SCHEMA",
      severity: "error",
      message: "Proposal waiver registry must define a waivers array.",
      path: proposalWaiverRegistryPath,
    });
    return activeWaivers;
  }

  for (const waiver of registry.waivers) {
    const missingFields = [
      "id",
      "scope",
      "target",
      "owner",
      "reason",
      "expiresAt",
      "cleanup",
      "status",
      "linkedIssue",
      "cleanupMilestone",
    ].filter(
      (field) => !String((waiver as unknown as Record<string, unknown>)[field] ?? "").trim(),
    );
    const expiresAt = parseDateOnly(waiver.expiresAt);

    if (
      missingFields.length > 0 ||
      !isWaiverScope(waiver.scope) ||
      (waiver.status !== "active" && waiver.status !== "retired") ||
      !expiresAt
    ) {
      pushDiagnostic(diagnostics, {
        code: "E_DESIGN_PROPOSAL_WAIVER_SCHEMA",
        severity: "error",
        message: `Proposal waiver ${waiver.id || "(missing id)"} is missing typed fields: ${missingFields.join(", ") || "invalid scope/status/expiresAt"}.`,
        path: proposalWaiverRegistryPath,
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
        path: proposalWaiverRegistryPath,
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
        path: proposalWaiverRegistryPath,
        scope: waiver.scope,
        target: waiver.target,
        waiverId: waiver.id,
      });
    }

    activeWaivers.set(waiverKey(waiver.scope, waiver.target), waiver);
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
    path: lifecyclePath,
  });
}

/**
 * Validate design-system proposal gates and collect diagnostics about missing, expired, or non-accepted proposals and waivers.
 *
 * Runs validation of the proposal waiver registry and enforces gates for agent UI routing and component lifecycle proposals, producing diagnostic entries for schema errors, missing or unaccepted proposal references, expired waivers, and related conditions.
 *
 * @param rootDir - Repository root to resolve registry, routing, lifecycle, and coverage files (defaults to process.cwd()).
 * @param options.today - Optional current date in `YYYY-MM-DD` format used for waiver expiry checks; when omitted the real current date is used.
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
  const waiverRegistryFile = path.join(rootDir, proposalWaiverRegistryPath);
  if (!existsSync(waiverRegistryFile)) {
    pushDiagnostic(diagnostics, {
      code: "E_DESIGN_PROPOSAL_WAIVERS_MISSING",
      severity: "error",
      message: `Proposal waiver registry is missing at ${proposalWaiverRegistryPath}.`,
      path: proposalWaiverRegistryPath,
    });
    return {
      kind: "astudio.design.proposalGate.v1",
      ok: false,
      diagnostics,
      waiverRegistryPath: proposalWaiverRegistryPath,
    };
  }

  const today = parseDateOnly(options.today ?? new Date().toISOString().slice(0, 10)) ?? new Date();
  const registry = readJson<ProposalWaiverRegistry>(rootDir, proposalWaiverRegistryPath);
  const waivers = validateWaiverRegistryShape(registry, diagnostics, today);
  const routingTable = loadAgentUiRoutingTable(rootDir);
  const lifecycleEntries = readJson<{ components: ComponentLifecycleEntry[] }>(
    rootDir,
    lifecyclePath,
  ).components;
  const coverageEntries = readJson<ComponentCoverageEntry[]>(rootDir, coveragePath);

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
    waiverRegistryPath: proposalWaiverRegistryPath,
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
    proposalTemplatePath,
    requiredFields: proposalRequiredFields,
    previewOnly: true,
    readOnly: true,
    remediation,
  };
}
