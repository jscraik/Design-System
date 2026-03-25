export {
  createBaselineConfig,
  formatCheckResult,
  initGuidance,
  isCiEnvironment,
  runCheck,
} from "./core.js";
export type {
  CheckOptions,
  CheckResult,
  ExemptionClassification,
  GuidanceConfig,
  GuidanceExemption,
  GuidanceExemptionLedger,
  GuidanceRule,
  GuidanceScopeName,
  GuidanceViolation,
  InitOptions,
  InitResult,
  RuleLevel,
  RulesDocument,
} from "./types.js";
