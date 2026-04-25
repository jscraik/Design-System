import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadRuleManifest, manifestPath } from "./manifest.js";
import { parseDesignContract } from "./parser.js";
import type {
  DesignContract,
  DesignFinding,
  LintOptions,
  LintResult,
  RuleManifestEntry,
} from "./types.js";

function bodyText(contract: DesignContract): string {
  return contract.sections
    .map((section) => `${section.title}\n${section.body}`)
    .join("\n")
    .toLowerCase();
}

function hasSection(contract: DesignContract, titlePattern: RegExp): boolean {
  return contract.sections.some((section) => titlePattern.test(section.title));
}

function predicatePasses(
  rule: RuleManifestEntry,
  contract: DesignContract,
  normalizedBodyText: string,
): boolean {
  switch (rule.predicate) {
    case "requires-h1":
      return contract.sections.filter((section) => section.level === 1).length === 1;
    case "mentions-surface-role-shell":
      return normalizedBodyText.includes("shell") && normalizedBodyText.includes("surface");
    case "mentions-loading-empty-error":
      return (
        normalizedBodyText.includes("loading") &&
        normalizedBodyText.includes("empty") &&
        normalizedBodyText.includes("error")
      );
    case "requires-scoped-focus":
      return (
        normalizedBodyText.includes("focus") &&
        (normalizedBodyText.includes("scoped") || normalizedBodyText.includes("scope"))
      );
    case "mentions-reduced-motion":
      return (
        normalizedBodyText.includes("reduced-motion") ||
        normalizedBodyText.includes("reduced motion")
      );
    case "mentions-dynamic-viewport-or-safe-area":
      return (
        normalizedBodyText.includes("dynamic viewport") ||
        normalizedBodyText.includes("safe-area") ||
        normalizedBodyText.includes("safe area")
      );
    case "mentions-lifecycle-and-coverage-sources":
      return (
        normalizedBodyText.includes("component_lifecycle.json") &&
        normalizedBodyText.includes("coverage_matrix.json") &&
        hasSection(contract, /routing|component/i)
      );
    case "mentions-component-lifecycle":
      return (
        normalizedBodyText.includes("component_lifecycle.json") &&
        hasSection(contract, /routing|component/i)
      );
    case "mentions-coverage-matrix":
      return (
        normalizedBodyText.includes("coverage_matrix.json") &&
        hasSection(contract, /routing|component/i)
      );
    default:
      return false;
  }
}

function findLine(contract: DesignContract, rule: RuleManifestEntry): number | undefined {
  if (rule.group === "ui.hierarchy") return 1;
  const section = contract.sections.find((entry) =>
    entry.body.toLowerCase().includes(rule.group.split(".")[1]),
  );
  return section?.line;
}

export async function lintDesignContract(
  markdown: string,
  options: LintOptions = {},
): Promise<LintResult> {
  const contract = await parseDesignContract(markdown, options);
  const manifest = await loadRuleManifest();
  const normalizedBodyText = bodyText(contract);
  const findings: DesignFinding[] = [];

  for (const rule of manifest.rules) {
    if (predicatePasses(rule, contract, normalizedBodyText)) continue;
    findings.push({
      id: rule.id,
      severity: options.warningsAsErrors && rule.severity === "warn" ? "error" : rule.severity,
      message: rule.message,
      line: findLine(contract, rule),
      sourceRef: {
        ruleId: rule.id,
        manifestPath: manifestPath(),
        sourcePath: rule.sourcePath,
        predicate: rule.predicate,
      },
    });
  }

  return {
    kind: "astudio.design.lint.v1",
    contract,
    findings,
    ok: findings.every((finding) => finding.severity !== "error"),
  };
}

export async function lintDesignFile(
  filePath: string,
  options: LintOptions = {},
): Promise<LintResult> {
  const absolutePath = path.resolve(filePath);
  const markdown = await readFile(absolutePath, "utf8");
  return lintDesignContract(markdown, { ...options, filePath: absolutePath });
}
