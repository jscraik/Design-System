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
