export type RuleLevel = "warn" | "error";
export type GuidanceScopeName = "error" | "warn" | "exempt";
export type ExemptionClassification = "temporary" | "transitional" | "deprecated";

export interface GuidanceRule {
  id: string;
  level: RuleLevel;
  description: string;
}

export interface RulesDocument {
  schemaVersion: number;
  configFile: string;
  rules: GuidanceRule[];
}

export interface GuidanceConfig {
  schemaVersion: number;
  docs: string[];
  include?: string[];
  ignore?: string[];
  scopes?: Partial<Record<GuidanceScopeName, string[]>>;
  exemptionLedger?: string;
  scopePrecedence?: GuidanceScopeName[];
  designContract?: GuidanceDesignContractState;
  [key: string]: unknown;
}

export type GuidanceDesignMode = "legacy" | "design-md";
export type GuidanceMigrationState =
  | "not-started"
  | "initialized"
  | "active"
  | "partial"
  | "failed"
  | "rolled-back";

export interface DesignProfileDefinition {
  id: string;
  name: string;
  version: string;
  status: "supported" | "deprecated";
  source: "design-system-guidance";
}

export interface DesignCompatibilityManifest {
  schema: "astudio.design.compatibility.v1";
  wrapperVersion: string;
  engineVersionRange: string;
  minWrapper: string;
  maxWrapperTested: string;
  supportedDesignSchemas: string[];
  supportedCommandSchemas: string[];
  supportedMigrationSchemas: string[];
  supportedProfiles: DesignProfileDefinition[];
  parityBaseline: {
    source: string;
    commit: string;
  };
  legacySupport: {
    policy: "later-of";
    daysAfterGa: number;
    minorReleasesAfterGa: number;
  };
}

export class GuidanceError extends Error {
  code: string;
  exitCode: number;
  hint?: string;

  constructor(
    message: string,
    options: {
      code: string;
      exitCode: number;
      hint?: string;
    },
  ) {
    super(message);
    this.code = options.code;
    this.exitCode = options.exitCode;
    this.hint = options.hint;
  }
}

export interface GuidanceDesignContractState {
  mode: GuidanceDesignMode;
  migrationState: GuidanceMigrationState;
  rollbackMetadata?: string;
  compatibilityManifest?: string;
}

export interface MigrationOptions {
  targetPath?: string;
  to?: GuidanceDesignMode;
  rollback?: boolean;
  resume?: boolean;
  dryRun?: boolean;
  write?: boolean;
  yes?: boolean;
}

export interface MigrationResult {
  targetPath: string;
  configPath: string;
  beforeMode: GuidanceDesignMode;
  afterMode: GuidanceDesignMode;
  migrationState: GuidanceMigrationState;
  changed: boolean;
  dryRun: boolean;
  rollbackMetadataPath?: string;
  quarantinePath?: string;
}

export interface GuidanceViolation {
  ruleId: string;
  level: RuleLevel;
  message: string;
  file?: string;
  line?: number;
}

export interface CheckOptions {
  ci?: boolean;
}

export interface CheckResult {
  targetPath: string;
  ciMode: boolean;
  violations: GuidanceViolation[];
  exitCode: number;
}

export interface InitOptions {
  force?: boolean;
}

export interface InitResult {
  targetPath: string;
  configPath: string;
  created: boolean;
}

export interface GuidanceExemption {
  path: string;
  ruleId: string;
  rationale: string;
  owner: string;
  createdAt: string;
  removeBy: string;
  targetIssue: string;
  classification: ExemptionClassification;
}

export interface GuidanceExemptionLedger {
  schemaVersion: number;
  exemptions: GuidanceExemption[];
  updated_at?: string;
  last_updated?: string;
}
