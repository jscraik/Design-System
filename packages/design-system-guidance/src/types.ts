export type RuleLevel = "warn" | "error";

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
