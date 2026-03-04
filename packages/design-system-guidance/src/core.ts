import { access, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  CheckOptions,
  CheckResult,
  GuidanceConfig,
  GuidanceRule,
  GuidanceViolation,
  InitOptions,
  InitResult,
  RuleLevel,
  RulesDocument,
} from "./types.js";

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
};

function getPackageRoot(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), "..");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeLevel(level: string | undefined): RuleLevel {
  return level === "error" ? "error" : "warn";
}

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

function parseConfig(raw: string): GuidanceConfig | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) return null;

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

    return {
      schemaVersion: Number(parsed.schemaVersion ?? 1),
      docs,
      include,
      ignore,
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

export function createBaselineConfig(): GuidanceConfig {
  return {
    ...DEFAULT_CONFIG,
    docs: [...DEFAULT_CONFIG.docs],
    include: [...(DEFAULT_CONFIG.include ?? [])],
    ignore: [...(DEFAULT_CONFIG.ignore ?? [])],
  };
}

export function isCiEnvironment(): boolean {
  const value = process.env.CI;
  return typeof value === "string" && value.length > 0 && value.toLowerCase() !== "false";
}

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
        message: "Config is invalid. Expected JSON with docs/include/ignore string arrays.",
      });
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

    for (const rule of rules.rules) {
      const pattern = RULE_PATTERNS[rule.id];
      if (!pattern) continue;
      for (const filePath of files) {
        const content = await readFile(filePath, "utf8");
        const matches = collectPatternViolations(content, pattern.regex);
        for (const match of matches) {
          violations.push({
            ruleId: rule.id,
            level: normalizeLevel(rule.level),
            file: filePath,
            line: match.line,
            message: pattern.message,
          });
        }
      }
    }
  }

  const hasErrors = violations.some((violation) => violation.level === "error");
  const hasWarnings = violations.some((violation) => violation.level === "warn");
  const shouldFail = ciMode ? hasErrors || hasWarnings : false;

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

export function formatCheckResult(result: CheckResult): string {
  const lines: string[] = [];
  const prefix = result.violations.length === 0 ? "PASS" : result.ciMode ? "FAIL" : "WARN";

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
