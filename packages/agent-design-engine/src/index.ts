export { diffDesignContracts } from "./diff.js";
export { exportDesignContract } from "./exporters.js";
export { lintDesignContract, lintDesignFile } from "./lint.js";
export {
  buildRuleProvenance,
  computeRuleSourceDigests,
  loadRuleManifest,
  manifestPath,
} from "./manifest.js";
export { extractDesignBody, parseDesignContract } from "./parser.js";
export { buildPreparePayload, serializePreparePayload } from "./prepare.js";
export {
  buildAbstractionProposalPreview,
  proposalTemplatePath,
  proposalWaiverRegistryPath,
  validateProposalGate,
} from "./proposals.js";
export {
  loadAgentUiRoutingTable,
  resolveRemediationContext,
  resolveRouteForNeed,
  resolveRouteForSurface,
  validateAgentUiRoutingTable,
} from "./routes.js";
export type {
  AbstractionProposalPreview,
  AgentUiRouteFallback,
  AgentUiRoutePreferredComponent,
  AgentUiRouteSource,
  AgentUiRouteValidationCommand,
  AgentUiRoutingTable,
  BrandCheckResult,
  ComponentCoverageEntry,
  ComponentLifecycleEntry,
  DesignContract,
  DesignDiffResult,
  DesignFinding,
  DesignFrontmatter,
  DesignSection,
  ExportFormat,
  ExportResult,
  LintOptions,
  LintResult,
  ParseOptions,
  PrepareOpenDecision,
  PreparePayload,
  PrepareSourceDigest,
  PrepareSurfaceScope,
  PrepareTiming,
  ProfileSource,
  ProposalGateDiagnostic,
  ProposalGateResult,
  ProposalWaiver,
  ProposalWaiverRegistry,
  ProposalWaiverScope,
  ProposalWaiverStatus,
  RemediationContext,
  ResolvedAgentUiRoute,
  RouteDiagnostic,
  RouteMaturity,
  RouteResolutionResult,
  RouteSafetyClass,
  RuleManifest,
  RuleManifestEntry,
  RuleProvenance,
  RuleSeverity,
  RuleSourceDigest,
  RuleSourceRef,
} from "./types.js";
export { DesignEngineError } from "./types.js";
