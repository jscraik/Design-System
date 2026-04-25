export {
  assertDesignCommandSchemaSupported,
  DESIGN_COMPATIBILITY_MANIFEST,
} from "./compatibility.js";
export {
  createBaselineConfig,
  formatCheckResult,
  initGuidance,
  isCiEnvironment,
  migrateGuidanceConfig,
  runCheck,
} from "./core.js";
export {
  SUPPORTED_DESIGN_PROFILES,
  supportedDesignProfileIds,
} from "./profiles.js";
export type {
  CheckOptions,
  CheckResult,
  DesignCompatibilityManifest,
  DesignProfileDefinition,
  ExemptionClassification,
  GuidanceConfig,
  GuidanceDesignContractState,
  GuidanceDesignMode,
  GuidanceExemption,
  GuidanceExemptionLedger,
  GuidanceMigrationState,
  GuidanceRule,
  GuidanceScopeName,
  GuidanceViolation,
  InitOptions,
  InitResult,
  MigrationOptions,
  MigrationResult,
  RuleLevel,
  RulesDocument,
} from "./types.js";
export { GuidanceError } from "./types.js";
