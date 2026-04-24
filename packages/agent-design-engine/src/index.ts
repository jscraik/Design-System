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
export type {
  BrandCheckResult,
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
  ProfileSource,
  RuleManifest,
  RuleManifestEntry,
  RuleProvenance,
  RuleSeverity,
  RuleSourceDigest,
  RuleSourceRef,
} from "./types.js";
export { DesignEngineError } from "./types.js";
