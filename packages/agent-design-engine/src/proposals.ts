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

function readJson<T>(rootDir: string, relativePath: string): T {
  return JSON.parse(readFileSync(path.join(rootDir, relativePath), "utf8")) as T;
}

function pushDiagnostic(
  diagnostics: ProposalGateDiagnostic[],
  diagnostic: ProposalGateDiagnostic,
): void {
  diagnostics.push(diagnostic);
}

function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dayDiff(left: Date, right: Date): number {
  return Math.floor((left.getTime() - right.getTime()) / 86_400_000);
}

function waiverKey(scope: ProposalWaiverScope, target: string): string {
  return `${scope}:${target}`;
}

function isWaiverScope(value: unknown): value is ProposalWaiverScope {
  return value === "agent-ui-route" || value === "component-lifecycle";
}

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

function hasActiveWaiver(
  waivers: Map<string, ProposalWaiver>,
  scope: ProposalWaiverScope,
  target: string,
): boolean {
  return waivers.has(waiverKey(scope, target));
}

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
