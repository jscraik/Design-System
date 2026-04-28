import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import {
  access,
  link,
  mkdir,
  open,
  readdir,
  readFile,
  realpath,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveRemediationContext } from "@brainwav/agent-design-engine";
import { DESIGN_COMPATIBILITY_MANIFEST } from "./compatibility.js";
import type {
  CheckOptions,
  CheckResult,
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
import { GuidanceError } from "./types.js";

const TOC_PATTERN = /^##\s+Table of Contents\b/m;
const SCAN_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".html",
  ".mdx",
]);
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_SCOPE_PRECEDENCE: GuidanceScopeName[] = ["error", "warn", "exempt"];
const EXEMPTION_CLASSIFICATIONS = new Set(["temporary", "transitional", "deprecated"]);
const DESIGN_MODES = new Set<GuidanceDesignMode>(["legacy", "design-md"]);
const MIGRATION_STATES = new Set<GuidanceMigrationState>([
  "not-started",
  "initialized",
  "active",
  "partial",
  "failed",
  "rolled-back",
]);
const SUPPORTED_SCHEMA_VERSIONS = new Set([1, 2]);
const ROLLBACK_SCHEMA = "astudio.design.rollback.v1";
const GUIDANCE_WRAPPER_VERSION = "0.0.2";
const MIGRATION_LOCK_ERROR = "E_DESIGN_MIGRATION_LOCKED";
const PARTIAL_FAULT_ENV = "ASTUDIO_GUIDANCE_FAIL_AFTER_PARTIAL";
const ROLLBACK_SIGNATURE_PREFIX = "hmac-sha256";
const ROLLBACK_SIGNING_KEY_FILE = ".rollback-metadata-signing-key";
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

type MigrationOperation = "fresh" | "rollback" | "resume";

interface MigrationTransitionRule {
  mode: GuidanceDesignMode;
  migrationState: GuidanceMigrationState;
  operations: MigrationOperation[];
  requiresReadableMetadata: boolean;
}

interface RollbackMetadataInput {
  targetPath: string;
  configPath: string;
  rollbackDir: string;
  rawConfig: string;
  partialRaw: string;
  nextRaw: string;
  beforeState: GuidanceDesignContractState;
  afterState: GuidanceDesignContractState;
  config: GuidanceConfig;
  nextConfig: GuidanceConfig;
}

const MIGRATION_TRANSITION_TABLE: MigrationTransitionRule[] = [
  {
    mode: "legacy",
    migrationState: "not-started",
    operations: ["fresh"],
    requiresReadableMetadata: false,
  },
  {
    mode: "legacy",
    migrationState: "initialized",
    operations: ["fresh"],
    requiresReadableMetadata: false,
  },
  {
    mode: "legacy",
    migrationState: "partial",
    operations: ["rollback", "resume"],
    requiresReadableMetadata: true,
  },
  {
    mode: "legacy",
    migrationState: "failed",
    operations: ["rollback", "resume"],
    requiresReadableMetadata: true,
  },
  {
    mode: "legacy",
    migrationState: "rolled-back",
    operations: ["fresh"],
    requiresReadableMetadata: false,
  },
  {
    mode: "design-md",
    migrationState: "active",
    operations: ["fresh", "rollback"],
    requiresReadableMetadata: true,
  },
  {
    mode: "design-md",
    migrationState: "partial",
    operations: ["rollback", "resume"],
    requiresReadableMetadata: true,
  },
  {
    mode: "design-md",
    migrationState: "failed",
    operations: ["rollback", "resume"],
    requiresReadableMetadata: true,
  },
  {
    mode: "design-md",
    migrationState: "rolled-back",
    operations: ["fresh"],
    requiresReadableMetadata: false,
  },
];

const RULE_PATTERNS: Record<string, { regex: RegExp; message: string }> = {
  "no-deprecated-icons-import": {
    regex: /@design-studio\/astudio-icons/g,
    message: "Deprecated icon package import found. Use @design-studio/ui/icons instead.",
  },
  "no-raw-hex-colors": {
    regex: /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
    message: "Raw hex color found. Use semantic tokens/variables instead of literal colors.",
  },
  "no-raw-px-values": {
    regex: /\b\d+(?:\.\d+)?px\b/g,
    message: "Raw pixel value found. Use spacing/typography tokens instead of literal px values.",
  },
  "no-foundation-token-usage": {
    regex: /(?:var\(--foundation-[^)]+\)|--foundation-[\w-]+)/g,
    message: "Foundation token usage found. Use semantic or mapped tokens on product surfaces.",
  },
  "no-global-focus-visible": {
    regex: /(^|[,{]\s*)(?:[a-z*][\w-]*\s*)?:focus-visible\b/gm,
    message: "Global or unscoped :focus-visible rule found. Use a scoped focus selector instead.",
  },
  "no-h-screen": {
    regex: /\bh-screen\b/g,
    message: "h-screen found. Use a 100dvh-safe shell pattern for protected surfaces.",
  },
  "no-arbitrary-tracking-values": {
    regex: /\btracking-\[[^\]]+\]/g,
    message:
      "Arbitrary tracking utility found. Use a semantic text role or token-backed style instead.",
  },
  "no-empty-accessible-label": {
    regex: /\b(?:aria-label|aria-labelledby|title)=\{?["'`]\s*["'`]\}?/g,
    message:
      "Empty accessible label found. Icon-only controls and labeled regions need a meaningful accessible name.",
  },
  "no-aria-hidden-focusable": {
    regex: /<(?:a|button|input|select|summary|textarea)\b[^>]*\baria-hidden=\{?["']true["']\}?/g,
    message:
      "Focusable element is hidden from assistive technology. Remove aria-hidden or move focus to an accessible control.",
  },
  "no-long-motion-duration": {
    regex:
      /\bduration-(?:[5-9]\d{2,}|[1-9]\d{3,})\b|(?:animationDuration|transitionDuration)\s*[:=]\s*["']?(?:[5-9]\d{2,}|[1-9]\d{3,})ms\b|animation(?:-[^:]+)?:\s*[^;{}]*\binfinite\b/g,
    message:
      "Long or looping motion found. Use restrained durations, reduced-motion fallbacks, or a ledgered exception.",
  },
};

const DEFAULT_CONFIG: GuidanceConfig = {
  schemaVersion: 1,
  docs: [
    "guidelines/README.md",
    "guidelines/tokens.md",
    "guidelines/typography.md",
    "guidelines/spacing.md",
    "guidelines/color.md",
    "guidelines/iconography.md",
  ],
  include: ["src", "app", "components", "styles"],
  ignore: ["node_modules", "dist", ".git", "coverage", ".next", "build"],
  scopes: {
    error: [],
    warn: [],
    exempt: [],
  },
  scopePrecedence: [...DEFAULT_SCOPE_PRECEDENCE],
};

function getPackageRoot(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), "..");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normalize a rule level string to a supported RuleLevel.
 *
 * @param level - The input level value to normalize; may be `undefined` or any string.
 * @returns `"error"` if `level` is exactly `"error"`, `"warn"` otherwise.
 */
function normalizeLevel(level: string | undefined): RuleLevel {
  return level === "error" ? "error" : "warn";
}

/**
 * Produces remediation metadata for a guidance violation given its rule id and repository path.
 *
 * @param ruleId - The rule identifier for the detected violation (e.g., `"no-h-screen"`, `"no-raw-hex-colors"`)
 * @param targetPath - The repository root path used to compute any repository-specific remediation context
 * @returns A Partial<GuidanceViolation> containing remediation fields such as:
 * - `replacementInstruction` — a suggested code or API replacement when available,
 * - `examplePath` — a sample file or route illustrating the recommended change,
 * - `validationCommands` — commands to re-run checks (may be CI-safe),
 * - `proposalRequired` — `true` when an automated remediation cannot be deterministically generated,
 * - `recoveryUnavailableReason` — a short human-readable reason when automatic recovery is not available.
 *
 * Specific behaviors:
 * - For `no-h-screen`, returns repository-aware replacement guidance and validation commands when a deterministic page-shell route exists; otherwise sets `proposalRequired` to `true` and supplies a repo-specific unavailability reason.
 * - For `no-raw-hex-colors` and `no-foundation-token-usage`, returns a static replacement instruction, CI-safe validation command(s), and `proposalRequired: false`.
 * - For `no-global-focus-visible`, sets `proposalRequired: true` with a recovery reason that indicates remediation depends on component ownership.
 * - For all other rule ids, sets `proposalRequired: true` and provides a generic recovery-unavailable reason.
 */
function remediationForViolation(ruleId: string, targetPath: string): Partial<GuidanceViolation> {
  if (ruleId === "no-h-screen") {
    const remediation = resolveRemediationContext("page_shell", targetPath);
    const route = remediation.route;
    return {
      replacementInstruction: route
        ? `Replace custom viewport shell wrappers with ${route.preferredComponent.name} from ${route.preferredComponent.packageName} (${route.preferredComponent.importPath}).`
        : undefined,
      examplePath: route?.examples[0],
      validationCommands: route?.validationCommands,
      proposalRequired: route === null,
      recoveryUnavailableReason: route
        ? undefined
        : "No deterministic page shell route is available for this repository.",
    };
  }

  if (ruleId === "no-raw-hex-colors" || ruleId === "no-foundation-token-usage") {
    return {
      replacementInstruction:
        "Replace literal or foundation color usage with mapped semantic color utilities or token roles from DESIGN.md.",
      validationCommands: [
        {
          command: "pnpm design-system-guidance:check:ci",
          safetyClass: "read_only",
          reason: "Re-checks design-system guidance without mutating files.",
        },
      ],
      proposalRequired: false,
    };
  }

  if (ruleId === "no-global-focus-visible") {
    return {
      proposalRequired: true,
      recoveryUnavailableReason:
        "Focus remediation depends on component ownership; use a scoped component selector rather than an automatic global rewrite.",
    };
  }

  return {
    proposalRequired: true,
    recoveryUnavailableReason: "No deterministic remediation route is available for this finding.",
  };
}

/**
 * Resolve the effective level for a rule by its id using the provided rules document.
 *
 * @param rules - The rules document to search
 * @param ruleId - The id of the rule to look up
 * @param fallback - Level to return when the rule isn't present in `rules`
 * @returns The rule's normalized level (`"error"` or `"warn"`) if found, otherwise `fallback`
 */
function findRuleLevel(rules: RulesDocument, ruleId: string, fallback: RuleLevel): RuleLevel {
  const matched = rules.rules.find((rule: GuidanceRule) => rule.id === ruleId);
  return matched ? normalizeLevel(matched.level) : fallback;
}

async function readRules(): Promise<RulesDocument> {
  const rulesPath = path.join(getPackageRoot(), "rules.json");
  const raw = await readFile(rulesPath, "utf8");
  return JSON.parse(raw) as RulesDocument;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0,
  );
  if (items.length !== value.length) return null;
  return items;
}

function parseScopes(value: unknown): GuidanceConfig["scopes"] | null {
  if (value === undefined) return { ...DEFAULT_CONFIG.scopes };
  if (!isObject(value)) return null;

  const error = value.error === undefined ? [] : parseStringArray(value.error);
  const warn = value.warn === undefined ? [] : parseStringArray(value.warn);
  const exempt = value.exempt === undefined ? [] : parseStringArray(value.exempt);

  if (error === null || warn === null || exempt === null) return null;
  return { error, warn, exempt };
}

function parseScopePrecedence(value: unknown): GuidanceScopeName[] | null {
  if (value === undefined) return [...DEFAULT_SCOPE_PRECEDENCE];
  const entries = parseStringArray(value);
  if (!entries) return null;

  const normalized = entries.filter(
    (entry): entry is GuidanceScopeName =>
      entry === "error" || entry === "warn" || entry === "exempt",
  );
  if (normalized.length !== entries.length) return null;

  const deduped = Array.from(new Set(normalized));
  for (const scope of DEFAULT_SCOPE_PRECEDENCE) {
    if (!deduped.includes(scope)) {
      deduped.push(scope);
    }
  }

  return deduped;
}

function parseSupportedSchemaVersion(value: unknown): number | null {
  if (value === undefined) return 1;
  if (!Number.isInteger(value) || !SUPPORTED_SCHEMA_VERSIONS.has(value as number)) return null;
  return value as number;
}

function parseDesignContractState(value: unknown): GuidanceDesignContractState | null | undefined {
  if (value === undefined) return undefined;
  if (!isObject(value)) return null;

  const mode = value.mode;
  const migrationState = value.migrationState;
  if (
    mode !== undefined &&
    (typeof mode !== "string" || !DESIGN_MODES.has(mode as GuidanceDesignMode))
  ) {
    return null;
  }
  if (
    migrationState !== undefined &&
    (typeof migrationState !== "string" ||
      !MIGRATION_STATES.has(migrationState as GuidanceMigrationState))
  ) {
    return null;
  }

  const rollbackMetadata = value.rollbackMetadata;
  if (rollbackMetadata !== undefined && typeof rollbackMetadata !== "string") return null;

  const compatibilityManifest = value.compatibilityManifest;
  if (compatibilityManifest !== undefined && typeof compatibilityManifest !== "string") return null;

  return {
    mode: (mode as GuidanceDesignMode | undefined) ?? "legacy",
    migrationState: (migrationState as GuidanceMigrationState | undefined) ?? "not-started",
    ...(rollbackMetadata ? { rollbackMetadata } : {}),
    ...(compatibilityManifest ? { compatibilityManifest } : {}),
  };
}

function parseConfig(raw: string): GuidanceConfig | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) return null;

    const schemaVersion = parseSupportedSchemaVersion(parsed.schemaVersion);
    if (schemaVersion === null) return null;

    const docs = parseStringArray(parsed.docs);
    if (!docs) return null;

    const includeRaw = parsed.include;
    const include =
      includeRaw === undefined ? [...(DEFAULT_CONFIG.include ?? [])] : parseStringArray(includeRaw);
    if (include === null) return null;

    const ignoreRaw = parsed.ignore;
    const ignore =
      ignoreRaw === undefined ? [...(DEFAULT_CONFIG.ignore ?? [])] : parseStringArray(ignoreRaw);
    if (ignore === null) return null;

    const scopes = parseScopes(parsed.scopes);
    if (scopes === null) return null;

    const scopePrecedence = parseScopePrecedence(parsed.scopePrecedence);
    if (scopePrecedence === null) return null;

    const designContract = parseDesignContractState(parsed.designContract);
    if (designContract === null) return null;

    const exemptionLedger =
      parsed.exemptionLedger === undefined
        ? undefined
        : typeof parsed.exemptionLedger === "string" && parsed.exemptionLedger.trim().length > 0
          ? parsed.exemptionLedger
          : null;
    if (exemptionLedger === null) return null;

    return {
      ...parsed,
      schemaVersion,
      docs,
      include,
      ignore,
      scopes,
      exemptionLedger,
      scopePrecedence,
      ...(designContract ? { designContract } : {}),
    };
  } catch {
    return null;
  }
}

function countLineAt(content: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (content[i] === "\n") line += 1;
  }
  return line;
}

function shouldIgnoreDir(name: string, ignore: string[]): boolean {
  return ignore.some((entry) => entry === name);
}

async function collectScannableFiles(
  rootPath: string,
  includePaths: string[],
  ignoreDirs: string[],
): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentPath: string): Promise<void> {
    const entries = await readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        if (shouldIgnoreDir(entry.name, ignoreDirs)) {
          continue;
        }
        await walk(entryPath);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!SCAN_EXTENSIONS.has(path.extname(entry.name))) continue;
      files.push(entryPath);
    }
  }

  for (const includePath of includePaths) {
    const absoluteInclude = path.join(rootPath, includePath);
    if (!(await exists(absoluteInclude))) continue;

    const includeStats = await stat(absoluteInclude);
    if (includeStats.isDirectory()) {
      await walk(absoluteInclude);
      continue;
    }

    if (includeStats.isFile() && SCAN_EXTENSIONS.has(path.extname(absoluteInclude))) {
      files.push(absoluteInclude);
    }
  }

  return files;
}

function collectPatternViolations(
  content: string,
  regex: RegExp,
): Array<{ index: number; line: number }> {
  const matches: Array<{ index: number; line: number }> = [];
  const localRegex = new RegExp(regex.source, regex.flags);
  let match: RegExpExecArray | null = null;
  while ((match = localRegex.exec(content)) !== null) {
    const index = match.index;
    matches.push({
      index,
      line: countLineAt(content, index),
    });
  }
  return matches;
}

function normalizeRelativePath(rootPath: string, filePath: string): string {
  return path.relative(rootPath, filePath).split(path.sep).join("/");
}

function escapeRegexChar(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function globFragmentToRegex(glob: string): string {
  let pattern = "";

  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index];

    if (char === "*") {
      if (glob[index + 1] === "*") {
        const nextChar = glob[index + 2];
        if (nextChar === "/") {
          pattern += "(?:.*/)?";
          index += 2;
        } else {
          pattern += ".*";
          index += 1;
        }
      } else {
        pattern += "[^/]*";
      }
      continue;
    }

    if (char === "?") {
      pattern += "[^/]";
      continue;
    }

    if (char === "{") {
      const endIndex = glob.indexOf("}", index);
      if (endIndex === -1) {
        pattern += "\\{";
        continue;
      }
      const body = glob.slice(index + 1, endIndex);
      const parts = body.split(",").map((part) => globFragmentToRegex(part));
      pattern += `(?:${parts.join("|")})`;
      index = endIndex;
      continue;
    }

    pattern += escapeRegexChar(char);
  }

  return pattern;
}

const globRegexCache = new Map<string, RegExp>();

function globToRegExp(glob: string): RegExp {
  const normalized = glob.split(path.sep).join("/");
  const cached = globRegexCache.get(normalized);
  if (cached) return cached;

  const regex = new RegExp(`^${globFragmentToRegex(normalized)}$`);
  globRegexCache.set(normalized, regex);
  return regex;
}

function matchesGlob(filePath: string, glob: string): boolean {
  return globToRegExp(glob).test(filePath);
}

function scoreGlobSpecificity(glob: string): { literalLength: number; wildcardCount: number } {
  const normalized = glob.split(path.sep).join("/");
  const withoutBraceBodies = normalized.replace(/\{[^}]*\}/g, "");

  return {
    literalLength: withoutBraceBodies.replace(/[*?]/g, "").length,
    wildcardCount: (withoutBraceBodies.match(/[*?]/g) ?? []).length,
  };
}

function findBestScopeMatch(
  filePath: string,
  scopes: GuidanceConfig["scopes"],
  precedence: GuidanceScopeName[],
): GuidanceScopeName | null {
  if (!scopes) return null;

  let bestMatch: {
    scope: GuidanceScopeName;
    literalLength: number;
    wildcardCount: number;
    precedenceIndex: number;
  } | null = null;

  for (const scope of ["error", "warn", "exempt"] as const) {
    for (const glob of scopes[scope] ?? []) {
      if (!matchesGlob(filePath, glob)) continue;

      const { literalLength, wildcardCount } = scoreGlobSpecificity(glob);
      const precedenceIndex = precedence.indexOf(scope);

      if (
        !bestMatch ||
        wildcardCount < bestMatch.wildcardCount ||
        (wildcardCount === bestMatch.wildcardCount && literalLength > bestMatch.literalLength) ||
        (wildcardCount === bestMatch.wildcardCount &&
          literalLength === bestMatch.literalLength &&
          precedenceIndex < bestMatch.precedenceIndex)
      ) {
        bestMatch = {
          scope,
          literalLength,
          wildcardCount,
          precedenceIndex,
        };
      }
    }
  }

  return bestMatch?.scope ?? null;
}

function isIsoDate(value: string): boolean {
  return ISO_DATE_PATTERN.test(value);
}

function parseExemptionLedger(raw: string): {
  ledger: GuidanceExemptionLedger | null;
  errors: string[];
} {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) {
      return { ledger: null, errors: ["Ledger must be a JSON object."] };
    }

    if (!Array.isArray(parsed.exemptions)) {
      return { ledger: null, errors: ["Ledger must include an exemptions array."] };
    }

    const errors: string[] = [];
    const exemptions: GuidanceExemption[] = [];

    parsed.exemptions.forEach((entry, index) => {
      if (!isObject(entry)) {
        errors.push(`Entry ${index} must be an object.`);
        return;
      }

      const pathValue = entry.path;
      const ruleId = entry.ruleId;
      const rationale = entry.rationale;
      const owner = entry.owner;
      const createdAt = entry.createdAt;
      const removeBy = entry.removeBy;
      const targetIssue = entry.targetIssue;
      const classification = entry.classification;

      if (
        typeof pathValue !== "string" ||
        typeof ruleId !== "string" ||
        typeof rationale !== "string" ||
        typeof owner !== "string" ||
        typeof createdAt !== "string" ||
        typeof removeBy !== "string" ||
        typeof targetIssue !== "string" ||
        typeof classification !== "string"
      ) {
        errors.push(`Entry ${index} is missing one or more required string fields.`);
        return;
      }

      if (!isIsoDate(createdAt) || !isIsoDate(removeBy)) {
        errors.push(`Entry ${index} must use YYYY-MM-DD dates for createdAt and removeBy.`);
        return;
      }

      if (!EXEMPTION_CLASSIFICATIONS.has(classification)) {
        errors.push(
          `Entry ${index} has invalid classification '${classification}'. Expected temporary, transitional, or deprecated.`,
        );
        return;
      }

      exemptions.push({
        path: pathValue,
        ruleId,
        rationale,
        owner,
        createdAt,
        removeBy,
        targetIssue,
        classification: classification as GuidanceExemption["classification"],
      });
    });

    return {
      ledger: {
        schemaVersion: Number(parsed.schemaVersion ?? 1),
        exemptions,
        updated_at: typeof parsed.updated_at === "string" ? parsed.updated_at : undefined,
        last_updated: typeof parsed.last_updated === "string" ? parsed.last_updated : undefined,
      },
      errors,
    };
  } catch {
    return { ledger: null, errors: ["Ledger must contain valid JSON."] };
  }
}

function isExpired(removeBy: string): boolean {
  return removeBy < new Date().toISOString().slice(0, 10);
}

function hasMatchingExemption(
  exemptions: GuidanceExemption[],
  filePath: string,
  ruleId: string,
): boolean {
  return exemptions.some((entry) => entry.ruleId === ruleId && matchesGlob(filePath, entry.path));
}

export function createBaselineConfig(): GuidanceConfig {
  return {
    ...DEFAULT_CONFIG,
    docs: [...DEFAULT_CONFIG.docs],
    include: [...(DEFAULT_CONFIG.include ?? [])],
    ignore: [...(DEFAULT_CONFIG.ignore ?? [])],
    scopes: {
      error: [...(DEFAULT_CONFIG.scopes?.error ?? [])],
      warn: [...(DEFAULT_CONFIG.scopes?.warn ?? [])],
      exempt: [...(DEFAULT_CONFIG.scopes?.exempt ?? [])],
    },
    scopePrecedence: [...(DEFAULT_CONFIG.scopePrecedence ?? [])],
  };
}

export function isCiEnvironment(): boolean {
  const value = process.env.CI;
  return typeof value === "string" && value.length > 0 && value.toLowerCase() !== "false";
}

/**
 * Scans a target repository for configured guidance rule violations and returns a summary of findings.
 *
 * @param targetPathInput - Path to the repository root to scan (defaults to the current working directory)
 * @param options - Runtime options controlling the check (e.g., `ci` to force CI mode)
 * @returns An object with `targetPath`, `ciMode`, an array of detected `violations`, and an `exitCode` (0 when no failing errors or not in CI, 1 when CI mode and errors were found)
 */
export async function runCheck(
  targetPathInput = ".",
  options: CheckOptions = {},
): Promise<CheckResult> {
  const targetPath = path.resolve(targetPathInput);
  const ciMode = options.ci ?? isCiEnvironment();
  const rules = await readRules();
  const violations: GuidanceViolation[] = [];
  const configPath = path.join(targetPath, rules.configFile);

  let config: GuidanceConfig | null = null;
  if (!(await exists(configPath))) {
    violations.push({
      ruleId: "config-required",
      level: findRuleLevel(rules, "config-required", "error"),
      file: configPath,
      message: `Missing guidance config: ${rules.configFile}`,
    });
  } else {
    const rawConfig = await readFile(configPath, "utf8");
    config = parseConfig(rawConfig);
    if (!config) {
      violations.push({
        ruleId: "config-invalid",
        level: findRuleLevel(rules, "config-invalid", "error"),
        file: configPath,
        message:
          "Config is invalid. Expected JSON with docs/include/ignore arrays and optional scopes/exemptionLedger metadata.",
      });
    }
  }

  let exemptions: GuidanceExemption[] = [];
  if (config?.exemptionLedger) {
    const ledgerPath = path.join(targetPath, config.exemptionLedger);
    if (!(await exists(ledgerPath))) {
      violations.push({
        ruleId: "exemption-ledger-missing",
        level: findRuleLevel(rules, "exemption-ledger-missing", "error"),
        file: ledgerPath,
        message: `Configured exemption ledger is missing: ${config.exemptionLedger}`,
      });
    } else {
      const rawLedger = await readFile(ledgerPath, "utf8");
      const { ledger, errors } = parseExemptionLedger(rawLedger);
      if (!ledger || errors.length > 0) {
        for (const error of errors) {
          violations.push({
            ruleId: "exemption-ledger-invalid",
            level: findRuleLevel(rules, "exemption-ledger-invalid", "error"),
            file: ledgerPath,
            message: error,
          });
        }
      }

      if (ledger) {
        exemptions = ledger.exemptions.filter((entry) => {
          if (!isExpired(entry.removeBy)) {
            return true;
          }

          violations.push({
            ruleId: "exemption-ledger-expired",
            level: findRuleLevel(rules, "exemption-ledger-expired", "error"),
            file: ledgerPath,
            message: `Exemption for ${entry.ruleId} on ${entry.path} expired on ${entry.removeBy}.`,
          });
          return false;
        });
      }
    }
  }

  if (config) {
    for (const docRelativePath of config.docs) {
      const docAbsolutePath = path.join(targetPath, docRelativePath);
      if (!(await exists(docAbsolutePath))) {
        violations.push({
          ruleId: "docs-exist",
          level: findRuleLevel(rules, "docs-exist", "error"),
          file: docAbsolutePath,
          message: `Configured doc is missing: ${docRelativePath}`,
        });
        continue;
      }

      if (docRelativePath.endsWith(".md")) {
        const markdown = await readFile(docAbsolutePath, "utf8");
        if (!TOC_PATTERN.test(markdown)) {
          violations.push({
            ruleId: "docs-toc",
            level: findRuleLevel(rules, "docs-toc", "warn"),
            file: docAbsolutePath,
            message: "Markdown doc is missing '## Table of Contents'.",
          });
        }
      }
    }

    const includePaths = config.include ?? [];
    const ignoreDirs = config.ignore ?? [];
    const files = await collectScannableFiles(targetPath, includePaths, ignoreDirs);
    const fileContents = await Promise.all(
      files.map(async (filePath) => ({
        filePath,
        relativePath: normalizeRelativePath(targetPath, filePath),
        content: await readFile(filePath, "utf8"),
      })),
    );

    for (const rule of rules.rules) {
      const pattern = RULE_PATTERNS[rule.id];
      if (!pattern) continue;

      for (const file of fileContents) {
        if (hasMatchingExemption(exemptions, file.relativePath, rule.id)) {
          continue;
        }

        const matchedScope = findBestScopeMatch(
          file.relativePath,
          config.scopes,
          config.scopePrecedence ?? DEFAULT_SCOPE_PRECEDENCE,
        );
        if (matchedScope === "exempt") {
          continue;
        }

        const level =
          matchedScope === "error" || matchedScope === "warn"
            ? matchedScope
            : normalizeLevel(rule.level);

        const matches = collectPatternViolations(file.content, pattern.regex);
        for (const match of matches) {
          violations.push({
            ruleId: rule.id,
            level,
            file: file.filePath,
            line: match.line,
            message: pattern.message,
            ...remediationForViolation(rule.id, targetPath),
          });
        }
      }
    }
  }

  const hasErrors = violations.some((violation) => violation.level === "error");
  const shouldFail = ciMode ? hasErrors : false;

  return {
    targetPath,
    ciMode,
    violations,
    exitCode: shouldFail ? 1 : 0,
  };
}

export async function initGuidance(
  targetPathInput = ".",
  options: InitOptions = {},
): Promise<InitResult> {
  const targetPath = path.resolve(targetPathInput);
  const rules = await readRules();
  const configPath = path.join(targetPath, rules.configFile);

  await mkdir(targetPath, { recursive: true });

  const hasConfig = await exists(configPath);
  if (!hasConfig || options.force) {
    if (hasConfig && options.force) {
      const existing = parseConfig(await readFile(configPath, "utf8"));
      if (existing?.schemaVersion === 2 || existing?.designContract) {
        throw new GuidanceError(
          "Refusing to force-init over v2 or migrated guidance config. Roll back or edit the existing config instead.",
          {
            code: "E_POLICY",
            exitCode: 3,
            hint: "Roll back or edit the existing config instead of force-initializing over migration state.",
          },
        );
      }
    }

    const config = createBaselineConfig();
    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    return {
      targetPath,
      configPath,
      created: true,
    };
  }

  return {
    targetPath,
    configPath,
    created: false,
  };
}

function defaultDesignState(): GuidanceDesignContractState {
  return {
    mode: "legacy",
    migrationState: "not-started",
  };
}

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalJson(entry)).join(",")}]`;
  }
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function checksum(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function compareSemver(left: string, right: string): number {
  const parse = (value: string): number[] => {
    if (!SEMVER_PATTERN.test(value)) {
      throw rollbackMetadataError();
    }
    return value.split(".").map((part) => Number(part));
  };
  const leftParts = parse(left);
  const rightParts = parse(right);
  for (let index = 0; index < 3; index += 1) {
    const delta = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (delta !== 0) return delta;
  }
  return 0;
}

function assertSupportedWrapperVersion(version: string): void {
  if (
    compareSemver(version, DESIGN_COMPATIBILITY_MANIFEST.legacySupport.rollbackMetadataMinWrapper) <
      0 ||
    compareSemver(version, DESIGN_COMPATIBILITY_MANIFEST.maxWrapperTested) > 0
  ) {
    throw rollbackMetadataError();
  }
}

function isPathInside(rootPath: string, candidatePath: string): boolean {
  const relative = path.relative(rootPath, candidatePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function migrationStateError(message: string): GuidanceError {
  return new GuidanceError(message, {
    code: "E_DESIGN_MIGRATION_STATE_INVALID",
    exitCode: 1,
    hint: "Use --resume only for partial or failed migrations, --rollback for rollback, or --to design-md for a fresh migration.",
  });
}

function partialMigrationError(): GuidanceError {
  return new GuidanceError("Guidance migration stopped after writing partial state.", {
    code: "E_PARTIAL",
    exitCode: 4,
    hint: "Run migrate --resume to finish the migration or migrate --rollback after verifying rollback metadata.",
  });
}

function rollbackMetadataError(): GuidanceError {
  return new GuidanceError(
    "Rollback metadata is missing, unreadable, or outside the project root.",
    {
      code: "E_DESIGN_ROLLBACK_METADATA_UNREADABLE",
      exitCode: 3,
      hint: "Restore the recorded rollback metadata before retrying rollback or resume.",
    },
  );
}

function resolveRollbackMetadataPath(targetPath: string, metadataPath: string): string {
  const resolved = path.resolve(targetPath, metadataPath);
  if (!isPathInside(targetPath, resolved)) {
    throw rollbackMetadataError();
  }
  return resolved;
}

function toConfigRelativePath(targetPath: string, filePath: string): string {
  return path.relative(targetPath, filePath).split(path.sep).join("/");
}

async function quarantineDesignFile(
  targetPath: string,
  rollbackDir: string,
  operationId: string,
): Promise<string | undefined> {
  const designPath = path.join(targetPath, "DESIGN.md");
  if (!(await exists(designPath))) return undefined;

  const content = await readFile(designPath, "utf8");
  const quarantineDir = path.join(rollbackDir, operationId);
  await mkdir(quarantineDir, { recursive: true });

  const baseName = `${checksum(content).slice(0, 12)}-DESIGN.md`;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const fileName = attempt === 0 ? baseName : baseName.replace(/\.md$/, `-${attempt}.md`);
    const candidate = path.join(quarantineDir, fileName);
    try {
      await link(designPath, candidate);
      try {
        await unlink(designPath);
      } catch (error) {
        await unlink(candidate).catch(() => undefined);
        throw error;
      }
      return candidate;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "EEXIST") continue;
      if (code === "ENOENT") return undefined;
      throw error;
    }
  }

  throw new GuidanceError("Unable to allocate a collision-safe DESIGN.md quarantine path.", {
    code: "E_DESIGN_ROLLBACK_METADATA_UNREADABLE",
    exitCode: 3,
    hint: "Remove stale quarantine collisions or choose a clean rollback artifact directory.",
  });
}

function rollbackMetadataDigest(metadata: Record<string, unknown>): string {
  return checksum(canonicalJson(metadata));
}

function rollbackSigningKeyPath(rollbackDir: string): string {
  return path.join(rollbackDir, ROLLBACK_SIGNING_KEY_FILE);
}

function assertRollbackSigningKey(key: string): string {
  const trimmed = key.trim();
  if (!/^[a-f0-9]{64}$/.test(trimmed)) {
    throw rollbackMetadataError();
  }
  return trimmed;
}

async function readRollbackSigningKey(rollbackDir: string): Promise<string> {
  return assertRollbackSigningKey(await readFile(rollbackSigningKeyPath(rollbackDir), "utf8"));
}

async function readOrCreateRollbackSigningKey(rollbackDir: string): Promise<string> {
  await mkdir(rollbackDir, { recursive: true });
  const keyPath = rollbackSigningKeyPath(rollbackDir);
  try {
    return assertRollbackSigningKey(await readFile(keyPath, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const key = randomBytes(32).toString("hex");
  try {
    await writeFile(keyPath, `${key}\n`, { encoding: "utf8", flag: "wx", mode: 0o600 });
    return key;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
    return readRollbackSigningKey(rollbackDir);
  }
}

function rollbackMetadataSignature(metadataDigest: string, signingKey: string): string {
  const signature = createHmac("sha256", signingKey)
    .update(
      [
        metadataDigest,
        DESIGN_COMPATIBILITY_MANIFEST.schema,
        DESIGN_COMPATIBILITY_MANIFEST.wrapperVersion,
        DESIGN_COMPATIBILITY_MANIFEST.parityBaseline.commit,
      ].join(":"),
    )
    .digest("hex");
  return `${ROLLBACK_SIGNATURE_PREFIX}:${signature}`;
}

function stripRollbackMetadataSignature(parsed: Record<string, unknown>): Record<string, unknown> {
  const {
    metadataDigest: _metadataDigest,
    metadataSignature: _metadataSignature,
    ...unsigned
  } = parsed;
  return unsigned;
}

async function buildRollbackMetadata(
  input: RollbackMetadataInput,
): Promise<Record<string, unknown>> {
  const writtenAt = new Date();
  const designPath = path.join(input.targetPath, "DESIGN.md");
  const designContent = await readFile(designPath, "utf8");
  const designChecksum = checksum(designContent);
  const signingKey = await readOrCreateRollbackSigningKey(input.rollbackDir);
  const supportEndsAt = addDays(writtenAt, DESIGN_COMPATIBILITY_MANIFEST.legacySupport.daysAfterGa);
  const failedConfig: GuidanceConfig = {
    ...input.config,
    schemaVersion: input.nextConfig.schemaVersion,
    designContract: {
      ...input.afterState,
      migrationState: "failed",
    },
  };
  const unsigned = {
    schema: ROLLBACK_SCHEMA,
    schemaVersion: ROLLBACK_SCHEMA,
    writtenByWrapperVersion: GUIDANCE_WRAPPER_VERSION,
    writtenAt: writtenAt.toISOString(),
    sourceMode: input.beforeState.mode,
    targetMode: input.afterState.mode,
    sourceSchemaVersion: input.config.schemaVersion,
    targetSchemaVersion: input.nextConfig.schemaVersion,
    targetPath: input.targetPath,
    guidanceConfigPath: input.configPath,
    configPath: input.configPath,
    guidanceConfigChecksum: checksum(input.nextRaw),
    configChecksum: checksum(input.nextRaw),
    designFilePath: designPath,
    designFileChecksum: designChecksum,
    rollbackArtifactDir: input.rollbackDir,
    legacySupportEndsAtAtWrite: formatDateOnly(supportEndsAt),
    operationId: `${writtenAt.toISOString().replace(/[:.]/g, "-")}-${checksum(input.rawConfig).slice(0, 8)}`,
    compatibilityManifest: DESIGN_COMPATIBILITY_MANIFEST.schema,
    signatureKeyId: checksum(signingKey),
    checksums: {
      sourceConfig: checksum(input.rawConfig),
      targetConfig: checksum(input.nextRaw),
      partialConfig: checksum(input.partialRaw),
      failedConfig: checksum(stableJson(failedConfig)),
      config: checksum(input.nextRaw),
      design: designChecksum,
    },
    beforeMode: input.beforeState.mode,
    afterMode: input.afterState.mode,
    beforeSchemaVersion: input.config.schemaVersion,
    afterSchemaVersion: input.nextConfig.schemaVersion,
    createdAt: writtenAt.toISOString(),
    before: JSON.parse(input.rawConfig) as unknown,
  };
  const metadataDigest = rollbackMetadataDigest(unsigned);
  return {
    ...unsigned,
    metadataDigest,
    metadataSignature: rollbackMetadataSignature(metadataDigest, signingKey),
  };
}

function resolveRecordedPath(targetPath: string, recordedPath: string): string {
  return path.resolve(
    path.isAbsolute(recordedPath) ? recordedPath : path.join(targetPath, recordedPath),
  );
}

async function assertExistingPathInside(targetPath: string, candidatePath: string): Promise<void> {
  if (!isPathInside(targetPath, candidatePath)) {
    throw rollbackMetadataError();
  }
  const [targetRealPath, candidateRealPath] = await Promise.all([
    realpath(targetPath),
    realpath(candidatePath),
  ]);
  if (!isPathInside(targetRealPath, candidateRealPath)) {
    throw rollbackMetadataError();
  }
}

function requiredString(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw rollbackMetadataError();
  }
  return value;
}

function requiredNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw rollbackMetadataError();
  }
  return value;
}

async function assertRollbackMetadata(
  targetPath: string,
  configPath: string,
  currentRawConfig: string,
  metadataPath: string,
  parsed: unknown,
): Promise<string> {
  if (!isObject(parsed)) {
    throw rollbackMetadataError();
  }

  const schema = requiredString(parsed.schema);
  if (!DESIGN_COMPATIBILITY_MANIFEST.supportedMigrationSchemas.includes(schema)) {
    throw rollbackMetadataError();
  }

  const writtenByWrapperVersion = requiredString(parsed.writtenByWrapperVersion);
  assertSupportedWrapperVersion(writtenByWrapperVersion);
  const writtenAt = requiredString(parsed.writtenAt);
  if (Number.isNaN(Date.parse(writtenAt))) {
    throw rollbackMetadataError();
  }

  const sourceMode = requiredString(parsed.sourceMode);
  const targetMode = requiredString(parsed.targetMode);
  if (
    !DESIGN_MODES.has(sourceMode as GuidanceDesignMode) ||
    !DESIGN_MODES.has(targetMode as GuidanceDesignMode)
  ) {
    throw rollbackMetadataError();
  }

  const sourceSchemaVersion = requiredNumber(parsed.sourceSchemaVersion);
  const targetSchemaVersion = requiredNumber(parsed.targetSchemaVersion);
  if (
    !SUPPORTED_SCHEMA_VERSIONS.has(sourceSchemaVersion) ||
    !SUPPORTED_SCHEMA_VERSIONS.has(targetSchemaVersion)
  ) {
    throw rollbackMetadataError();
  }

  const recordedTargetPath = requiredString(parsed.targetPath);
  if (path.resolve(recordedTargetPath) !== targetPath) {
    throw rollbackMetadataError();
  }

  const recordedConfigPath = resolveRecordedPath(
    targetPath,
    requiredString(parsed.guidanceConfigPath),
  );
  if (recordedConfigPath !== configPath) {
    throw rollbackMetadataError();
  }
  const designFilePath = resolveRecordedPath(targetPath, requiredString(parsed.designFilePath));
  const rollbackArtifactDir = resolveRecordedPath(
    targetPath,
    requiredString(parsed.rollbackArtifactDir),
  );
  await Promise.all([
    assertExistingPathInside(targetPath, metadataPath),
    assertExistingPathInside(targetPath, recordedConfigPath),
    assertExistingPathInside(targetPath, designFilePath),
    assertExistingPathInside(targetPath, rollbackArtifactDir),
    assertExistingPathInside(targetPath, rollbackSigningKeyPath(rollbackArtifactDir)),
  ]);

  const legacySupportEndsAtAtWrite = requiredString(parsed.legacySupportEndsAtAtWrite);
  if (!ISO_DATE_PATTERN.test(legacySupportEndsAtAtWrite)) {
    throw rollbackMetadataError();
  }
  const operationId = requiredString(parsed.operationId);
  if (!/^[A-Za-z0-9._-]+$/.test(operationId)) {
    throw rollbackMetadataError();
  }

  const guidanceConfigChecksum = requiredString(parsed.guidanceConfigChecksum);
  const designFileChecksum = requiredString(parsed.designFileChecksum);
  const signatureKeyId = requiredString(parsed.signatureKeyId);
  const metadataDigest = requiredString(parsed.metadataDigest);
  const metadataSignature = requiredString(parsed.metadataSignature);
  if (
    !/^[a-f0-9]{64}$/.test(guidanceConfigChecksum) ||
    !/^[a-f0-9]{64}$/.test(designFileChecksum) ||
    !/^[a-f0-9]{64}$/.test(signatureKeyId) ||
    !/^[a-f0-9]{64}$/.test(metadataDigest)
  ) {
    throw rollbackMetadataError();
  }

  const signingKey = await readRollbackSigningKey(rollbackArtifactDir);
  const recomputedDigest = rollbackMetadataDigest(stripRollbackMetadataSignature(parsed));
  if (
    checksum(signingKey) !== signatureKeyId ||
    recomputedDigest !== metadataDigest ||
    rollbackMetadataSignature(metadataDigest, signingKey) !== metadataSignature
  ) {
    throw rollbackMetadataError();
  }

  const checksums = parsed.checksums;
  if (!isObject(checksums)) {
    throw rollbackMetadataError();
  }

  const currentConfigChecksum = checksum(currentRawConfig);
  const acceptedConfigChecksums = [
    checksums.targetConfig,
    checksums.partialConfig,
    checksums.failedConfig,
  ];
  if (
    !acceptedConfigChecksums.includes(currentConfigChecksum) ||
    checksums.config !== guidanceConfigChecksum
  ) {
    throw rollbackMetadataError();
  }

  if (checksum(await readFile(designFilePath, "utf8")) !== designFileChecksum) {
    throw rollbackMetadataError();
  }

  return operationId;
}

function migrationOperation(options: MigrationOptions): MigrationOperation {
  if (options.resume) return "resume";
  if (options.rollback || options.to === "legacy") return "rollback";
  return "fresh";
}

function assertMigrationTransition(
  state: GuidanceDesignContractState,
  operation: MigrationOperation,
): MigrationTransitionRule {
  const rule = MIGRATION_TRANSITION_TABLE.find(
    (entry) => entry.mode === state.mode && entry.migrationState === state.migrationState,
  );
  if (!rule) {
    throw migrationStateError(
      `Invalid guidance migration state: ${state.mode}/${state.migrationState}.`,
    );
  }
  if (!rule.operations.includes(operation)) {
    throw migrationStateError(
      `Guidance migration cannot run ${operation} from ${state.mode}/${state.migrationState}.`,
    );
  }
  return rule;
}

function shouldFailAfterPartialWrite(): boolean {
  return process.env[PARTIAL_FAULT_ENV] === "1";
}

async function requireReadableRollbackMetadata(
  targetPath: string,
  configPath: string,
  currentRawConfig: string,
  state: GuidanceDesignContractState,
): Promise<string> {
  if (!state.rollbackMetadata) {
    throw rollbackMetadataError();
  }

  const metadataPath = resolveRollbackMetadataPath(targetPath, state.rollbackMetadata);
  try {
    const raw = await readFile(metadataPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return await assertRollbackMetadata(
      targetPath,
      configPath,
      currentRawConfig,
      metadataPath,
      parsed,
    );
  } catch (error) {
    if (error instanceof GuidanceError) throw error;
    throw rollbackMetadataError();
  }
}

function assertSingleMigrationOperation(options: MigrationOptions): void {
  const requested = [
    options.to ? "--to" : null,
    options.rollback ? "--rollback" : null,
    options.resume ? "--resume" : null,
  ].filter(Boolean);
  if (requested.length > 1) {
    throw new GuidanceError("Choose one migration operation: --to, --rollback, or --resume.", {
      code: "E_USAGE",
      exitCode: 2,
      hint: "Run one migration operation at a time.",
    });
  }
}

async function readGuidanceConfig(
  targetPath: string,
  configPathInput?: string,
): Promise<{
  configPath: string;
  raw: string;
  config: GuidanceConfig;
}> {
  const configPath = configPathInput ?? path.join(targetPath, (await readRules()).configFile);
  const raw = await readFile(configPath, "utf8");
  const config = parseConfig(raw);
  if (!config) {
    throw new GuidanceError(
      "Config is invalid. Expected supported guidance JSON with v1 fields and optional designContract.",
      {
        code: "E_DESIGN_CONFIG_INVALID",
        exitCode: 2,
        hint: "Use schemaVersion 1 or 2 and preserve the required docs array.",
      },
    );
  }
  return { configPath, raw, config };
}

async function writeAtomic(filePath: string, contents: string): Promise<void> {
  const tempPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await writeFile(tempPath, contents, { encoding: "utf8", flag: "wx" });
    await rename(tempPath, filePath);
  } catch (error) {
    await unlink(tempPath).catch(() => undefined);
    throw error;
  }
}

function newRollbackMetadataPath(rollbackDir: string, rawConfig: string): string {
  return path.join(
    rollbackDir,
    `${checksum(rawConfig).slice(0, 12)}-${randomUUID()}-guidance-rollback.json`,
  );
}

async function writeRollbackMetadata(filePath: string, contents: string): Promise<void> {
  await writeFile(filePath, contents, { encoding: "utf8", flag: "wx" });
}

function migrationLockedError(): GuidanceError {
  return new GuidanceError("Guidance migration is already running for this config.", {
    code: MIGRATION_LOCK_ERROR,
    exitCode: 3,
    hint: "Retry after the active migration completes, or remove a stale migration lock only after verifying no migration process is running.",
  });
}

async function withMigrationLock<T>(
  configPath: string,
  enabled: boolean,
  operation: () => Promise<T>,
): Promise<T> {
  if (!enabled) return operation();

  const lockPath = `${configPath}.migration.lock`;
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  try {
    handle = await open(lockPath, "wx");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw migrationLockedError();
    }
    throw error;
  }

  try {
    await handle.writeFile(`${process.pid}\n${new Date().toISOString()}\n`, "utf8");
    return await operation();
  } finally {
    await handle?.close();
    await unlink(lockPath).catch(() => undefined);
  }
}

export async function migrateGuidanceConfig(
  options: MigrationOptions = {},
): Promise<MigrationResult> {
  assertSingleMigrationOperation(options);
  const targetPath = path.resolve(options.targetPath ?? ".");
  const rules = await readRules();
  const configPath = path.join(targetPath, rules.configFile);
  return withMigrationLock(configPath, Boolean(options.write && !options.dryRun), async () => {
    const { raw, config } = await readGuidanceConfig(targetPath, configPath);
    return migrateGuidanceConfigUnlocked(options, targetPath, configPath, raw, config);
  });
}

async function migrateGuidanceConfigUnlocked(
  options: MigrationOptions,
  targetPath: string,
  configPath: string,
  raw: string,
  config: GuidanceConfig,
): Promise<MigrationResult> {
  const beforeState = config.designContract ?? defaultDesignState();
  const operation = migrationOperation(options);
  const transition = assertMigrationTransition(beforeState, operation);

  const rollbackDir = path.join(targetPath, "artifacts", "design-migrations");
  const isRollback = operation === "rollback";
  const freshMigrationNeedsNewMetadata =
    operation === "fresh" && beforeState.migrationState !== "active";
  const rollbackOperationId = transition.requiresReadableMetadata
    ? await requireReadableRollbackMetadata(targetPath, configPath, raw, beforeState)
    : undefined;
  const rollbackMetadataPath =
    beforeState.rollbackMetadata && !freshMigrationNeedsNewMetadata
      ? resolveRollbackMetadataPath(targetPath, beforeState.rollbackMetadata)
      : newRollbackMetadataPath(rollbackDir, raw);
  const rollbackMetadataConfigPath = toConfigRelativePath(targetPath, rollbackMetadataPath);
  const shouldWriteRollbackMetadata =
    !isRollback && !options.resume && changedMigrationStart(beforeState);

  let afterState: GuidanceDesignContractState;
  if (isRollback) {
    afterState = {
      ...beforeState,
      mode: "legacy",
      migrationState: "rolled-back",
      rollbackMetadata: rollbackMetadataConfigPath,
    };
  } else if (operation === "resume") {
    afterState = {
      ...beforeState,
      mode: beforeState.mode === "design-md" ? "design-md" : (options.to ?? "design-md"),
      migrationState: "active",
      rollbackMetadata: rollbackMetadataConfigPath,
    };
  } else {
    afterState = {
      ...beforeState,
      mode: options.to ?? "design-md",
      migrationState: options.to === "legacy" ? "rolled-back" : "active",
      rollbackMetadata: rollbackMetadataConfigPath,
    };
  }

  const nextConfig: GuidanceConfig = {
    ...config,
    schemaVersion: Math.max(Number(config.schemaVersion ?? 1), 2),
    designContract: afterState,
  };
  const nextRaw = stableJson(nextConfig);
  const partialState: GuidanceDesignContractState = isRollback
    ? {
        ...beforeState,
        migrationState: "partial",
        rollbackMetadata: rollbackMetadataConfigPath,
      }
    : {
        ...afterState,
        migrationState: "partial",
      };
  const partialRaw = stableJson({
    ...config,
    schemaVersion: nextConfig.schemaVersion,
    designContract: partialState,
  });
  const changed = raw !== nextRaw;
  let quarantinePath: string | undefined;

  if (changed && !options.dryRun) {
    if (!options.write) {
      throw new GuidanceError("Guidance migration requires --write unless --dry-run is set.", {
        code: "E_DESIGN_WRITE_REQUIRED",
        exitCode: 3,
        hint: "Re-run with --write to allow mutation, or use --dry-run to preview migration.",
      });
    }
    await mkdir(rollbackDir, { recursive: true });
    if (shouldWriteRollbackMetadata)
      await writeRollbackMetadata(
        rollbackMetadataPath,
        stableJson(
          await buildRollbackMetadata({
            targetPath,
            configPath,
            rollbackDir,
            rawConfig: raw,
            partialRaw,
            nextRaw,
            beforeState,
            afterState,
            config,
            nextConfig,
          }),
        ),
      );

    await writeAtomic(configPath, partialRaw);
    if (shouldFailAfterPartialWrite()) {
      throw partialMigrationError();
    }
    if (isRollback) {
      if (!rollbackOperationId) throw rollbackMetadataError();
      quarantinePath = await quarantineDesignFile(targetPath, rollbackDir, rollbackOperationId);
    }
    await writeAtomic(configPath, nextRaw);
  }

  return {
    targetPath,
    configPath,
    beforeMode: beforeState.mode,
    afterMode: afterState.mode,
    migrationState: afterState.migrationState,
    changed,
    dryRun: Boolean(options.dryRun),
    rollbackMetadataPath,
    quarantinePath,
  };
}

function changedMigrationStart(state: GuidanceDesignContractState): boolean {
  return state.migrationState !== "active";
}

export function formatCheckResult(result: CheckResult): string {
  const lines: string[] = [];
  const prefix =
    result.violations.length === 0
      ? "PASS"
      : result.ciMode && result.exitCode > 0
        ? "FAIL"
        : "WARN";

  lines.push(`${prefix} design-system-guidance check (${result.targetPath})`);

  if (result.violations.length === 0) {
    lines.push("- No violations found.");
  } else {
    for (const violation of result.violations) {
      const location = violation.file
        ? ` (${violation.file}${violation.line ? `:${violation.line}` : ""})`
        : "";
      lines.push(`- [${violation.level}] ${violation.ruleId}: ${violation.message}${location}`);
    }

    if (!result.ciMode) {
      lines.push("- Non-CI mode keeps exit code 0 even when violations are present.");
    }
  }

  lines.push(`- Exit code: ${result.exitCode}`);
  return lines.join("\n");
}
