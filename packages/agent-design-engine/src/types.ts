export type RuleSeverity = "error" | "warn";
export type ProfileSource = "cli-override" | "design-frontmatter";

export interface DesignFrontmatter {
  schemaVersion: string;
  brandProfile: string;
  raw: Record<string, string>;
}

export interface DesignSection {
  title: string;
  level: number;
  body: string;
  line: number;
}

export interface RuleSourceDigest {
  path: string;
  sha256: string;
}

export interface RuleSourceRef {
  ruleId: string;
  manifestPath: string;
  sourcePath: string;
  predicate: string;
}

export interface RuleManifestEntry {
  id: string;
  group: string;
  severity: RuleSeverity;
  predicate: string;
  message: string;
  sourcePath: string;
  fixture: string;
}

export interface RuleManifest {
  schemaVersion: "agent-design.rules.v1";
  ruleManifestVersion: string;
  rulePackVersion: string;
  sources: string[];
  rules: RuleManifestEntry[];
}

export interface RuleProvenance {
  ruleManifestVersion: string;
  rulePackVersion: string;
  ruleSourceDigests: RuleSourceDigest[];
}

export interface DesignContract {
  kind: "agent-design.normalizedModel.v1";
  filePath: string | null;
  schemaVersion: string;
  brandProfile: string;
  resolvedProfile: string;
  profileSource: ProfileSource;
  profileVersion: string;
  sections: DesignSection[];
  tokens: Record<string, string>;
  components: string[];
  provenance: RuleProvenance;
}

export interface DesignFinding {
  id: string;
  severity: RuleSeverity;
  message: string;
  sourceRef: RuleSourceRef;
  line?: number;
}

export interface ParseOptions {
  filePath?: string | null;
  rootDir?: string;
  profileOverride?: string;
  provenance?: RuleProvenance;
  ci?: boolean;
}

export interface LintOptions extends ParseOptions {
  warningsAsErrors?: boolean;
}

export interface LintResult {
  kind: "astudio.design.lint.v1";
  contract: DesignContract;
  findings: DesignFinding[];
  ok: boolean;
}

export interface DesignDiffResult {
  kind: "astudio.design.diff.v1";
  before: DesignContract;
  after: DesignContract;
  changes: Array<{ path: string; before: unknown; after: unknown; severity: RuleSeverity }>;
  ruleContextDelta: {
    before: RuleProvenance;
    after: RuleProvenance;
    changedSourceDigests: RuleSourceDigest[];
  };
  hasRegression: boolean;
}

export type ExportFormat = "json@agent-design.v1" | "dtcg@2025" | "tailwind@4";

export interface ExportResult {
  kind: "astudio.design.export.v1";
  format: ExportFormat;
  contract: DesignContract;
  artifact: unknown;
}

export interface BrandCheckResult {
  kind: "astudio.design.checkBrand.v1";
  contract: DesignContract;
  profile: string;
  ok: boolean;
  findings: DesignFinding[];
}

export type RouteMaturity = "enforced" | "provisional";
export type RouteSafetyClass = "read_only" | "mutating" | "interactive" | "server_start";

export interface AgentUiRouteValidationCommand {
  command: string;
  safetyClass: RouteSafetyClass;
  reason: string;
  blockedByDefault?: boolean;
}

export interface AgentUiRouteFallback {
  component: string;
  reason: string;
}

export interface AgentUiRoutePreferredComponent {
  name: string;
  importPath: string;
  packageName: string;
  coverageName?: string;
}

export interface AgentUiRouteSource {
  need: string;
  canonicalNeed: string;
  aliases: string[];
  preferredComponent: AgentUiRoutePreferredComponent;
  lifecycleStatus: "canonical" | "transitional";
  routeMaturity: RouteMaturity;
  surfacePatterns: string[];
  useWhen: string[];
  requiredStates: string[];
  examples: string[];
  avoid: string[];
  fallbacks: AgentUiRouteFallback[];
  validationCommands: AgentUiRouteValidationCommand[];
  sourceRefs: string[];
}

export interface AgentUiRoutingTable {
  schemaVersion: "agent-ui-routing.v1";
  updatedAt: string;
  routes: AgentUiRouteSource[];
}

export interface ComponentLifecycleEntry {
  name: string;
  path: string;
  lifecycle: "canonical" | "transitional" | "deprecated";
  routing_tier: number;
  notes: string;
}

export interface ComponentCoverageEntry {
  name: string;
  source: string;
  upstream: string | null;
  fallback: string | null;
  status: string;
  web_used: boolean;
  tauri_used: boolean;
  widget_used: boolean;
}

export interface ResolvedAgentUiRoute extends AgentUiRouteSource {
  lifecycleEntry: ComponentLifecycleEntry;
  coverageEntry: ComponentCoverageEntry;
  matchedNeed: string;
  matchedAlias: string | null;
}

export interface RouteDiagnostic {
  code:
    | "E_DESIGN_ROUTE_MISSING"
    | "E_DESIGN_ROUTE_AMBIGUOUS"
    | "E_DESIGN_ROUTE_LIFECYCLE_MISSING"
    | "E_DESIGN_ROUTE_COVERAGE_MISSING"
    | "E_DESIGN_ROUTE_SOURCE_REF_MISSING"
    | "E_DESIGN_ROUTE_EXAMPLE_MISSING"
    | "E_DESIGN_ROUTE_DEPRECATED";
  message: string;
  routeNeed?: string;
  component?: string;
  path?: string;
}

export interface RouteResolutionResult {
  ok: boolean;
  route: ResolvedAgentUiRoute | null;
  diagnostics: RouteDiagnostic[];
}

export interface RemediationContext {
  need: string;
  route: ResolvedAgentUiRoute | null;
  forbiddenPatterns: string[];
  replacementInstructions: string[];
  validationCommands: AgentUiRouteValidationCommand[];
  diagnostics: RouteDiagnostic[];
}

export type PrepareSurfaceScope = "protected" | "warn" | "exempt" | "unknown";

export interface PrepareSourceDigest {
  path: string;
  sha256: string;
}

export interface PrepareOpenDecision {
  code: string;
  message: string;
  severity: "info" | "warn" | "error";
}

export interface PrepareTiming {
  startedAt: string;
  durationMs: number;
}

export interface PreparePayload {
  kind: "astudio.design.prepare.v1";
  ok: boolean;
  safeForAutomaticImplementation: boolean;
  resolvedDesignFile: string;
  guidanceConfigPath: string;
  designContractMode: string;
  surfacePath: string;
  surfaceScope: PrepareSurfaceScope;
  surfaceKind: string;
  recommendedRoutes: ResolvedAgentUiRoute[];
  requiredStates: string[];
  forbiddenPatterns: string[];
  relevantExamples: string[];
  validationCommands: AgentUiRouteValidationCommand[];
  ruleManifestVersion: string;
  rulePackVersion: string;
  ruleSourceDigests: RuleSourceDigest[];
  sourceDigests: PrepareSourceDigest[];
  coverageMatrixDigest: PrepareSourceDigest;
  componentLifecycleDigest: PrepareSourceDigest;
  openDecisions: PrepareOpenDecision[];
  timing: PrepareTiming;
}

export class DesignEngineError extends Error {
  code: string;
  exitCode: number;

  constructor(message: string, options: { code: string; exitCode: number }) {
    super(message);
    this.code = options.code;
    this.exitCode = options.exitCode;
  }
}
