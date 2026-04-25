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

export class DesignEngineError extends Error {
  code: string;
  exitCode: number;

  constructor(message: string, options: { code: string; exitCode: number }) {
    super(message);
    this.code = options.code;
    this.exitCode = options.exitCode;
  }
}
