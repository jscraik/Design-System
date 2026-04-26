import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CONTRACT_PATH = "docs/operations/quality-debt-radar.categories.json";
const TEMPLATE_PATH = "reports/qa/quality-debt-burndown-template.md";
const DEFAULT_REPORT_DIR = "reports/qa";
const REQUIRED_FRESHNESS_FIELDS = [
  "weekly_snapshot_days",
  "alignment_stale_after_days",
  "work_outstanding_stale_after_days",
];
const REQUIRED_STATUS_FIELDS = ["green", "amber", "red"];
const STATUS_RANK = new Map([
  ["Green", 0],
  ["Amber", 1],
  ["Red", 2],
]);

function usage(exitCode = 0) {
  const text = [
    "Usage:",
    "  node scripts/quality-debt-radar.mjs check [--plain|--no-color]",
    "  node scripts/quality-debt-radar.mjs report [--output <path>] [--date YYYY-MM-DD] [--week YYYY-WW] [--plain|--no-color]",
    "",
    "The report command is warn-first: amber/red categories are reported, not process-failed.",
  ].join("\n");
  console.log(text);
  process.exit(exitCode);
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function readText(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

function requireFile(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Required file missing: ${relativePath}`);
  }
  return absolutePath;
}

function assertPlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

function validateFreshnessContract(freshness) {
  assertPlainObject(freshness, "Radar contract freshness");
  for (const field of REQUIRED_FRESHNESS_FIELDS) {
    if (!Number.isInteger(freshness[field]) || freshness[field] <= 0) {
      throw new Error(`Radar contract freshness.${field} must be a positive integer.`);
    }
  }
}

function validateStatusRules(category) {
  assertPlainObject(category.status_rules, `Radar category ${category.id} status_rules`);
  for (const field of REQUIRED_STATUS_FIELDS) {
    if (
      typeof category.status_rules[field] !== "string" ||
      category.status_rules[field].trim() === ""
    ) {
      throw new Error(`Radar category ${category.id} status_rules.${field} must be a string.`);
    }
  }
}

function loadContract() {
  const contract = readJson(CONTRACT_PATH);
  if (contract.schema_version !== 1) {
    throw new Error(`Unsupported radar contract schema_version: ${contract.schema_version}`);
  }
  validateFreshnessContract(contract.freshness);
  if (!Array.isArray(contract.categories) || contract.categories.length === 0) {
    throw new Error("Radar contract must define at least one category.");
  }
  const ids = new Set();
  for (const category of contract.categories) {
    for (const field of ["id", "label", "owner", "description", "probe"]) {
      if (!category[field]) {
        throw new Error(`Radar category is missing ${field}: ${JSON.stringify(category)}`);
      }
    }
    if (ids.has(category.id)) {
      throw new Error(`Duplicate radar category id: ${category.id}`);
    }
    ids.add(category.id);
    if (!Array.isArray(category.source_anchors) || category.source_anchors.length === 0) {
      throw new Error(`Radar category ${category.id} needs source_anchors.`);
    }
    if (!Array.isArray(category.source_commands) || category.source_commands.length === 0) {
      throw new Error(`Radar category ${category.id} needs source_commands.`);
    }
    validateStatusRules(category);
    for (const sourceAnchor of category.source_anchors) {
      requireFile(sourceAnchor);
    }
  }
  requireFile(TEMPLATE_PATH);
  return contract;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function getIsoWeek(date) {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc - yearStart) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function parseDateOption(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Expected --date YYYY-MM-DD, got: ${value}`);
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid --date value: ${value}`);
  }
  return parsed;
}

function parseBiome() {
  return readJson("biome.json");
}

function countDisabledRules(ruleGroups) {
  const disabled = [];
  for (const [groupName, rules] of Object.entries(ruleGroups ?? {})) {
    for (const [ruleName, value] of Object.entries(rules ?? {})) {
      if (value === "off") {
        disabled.push(`${groupName}.${ruleName}`);
      }
    }
  }
  return disabled;
}

function statusFromCount(count, redWhenUnavailable = false) {
  if (redWhenUnavailable) return "Red";
  return count === 0 ? "Green" : "Amber";
}

function verifyCoverageCleared(coverageText, a11yText) {
  const unresolvedPattern = /\b(host-only|pending evidence|unresolved|requires host)\b/i;
  const unresolvedLines = [...coverageText.split("\n"), ...a11yText.split("\n")]
    .filter((line) => unresolvedPattern.test(line))
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    clear: unresolvedLines.length === 0,
    unresolvedLines,
  };
}

function makeResult(category, status, freshness, metric, trend, notes, nextAction) {
  return {
    category,
    status,
    freshness,
    metric,
    trend,
    owner: category.owner,
    notes,
    nextAction,
  };
}

function probeBiomeDisabledRules(category) {
  try {
    const biome = parseBiome();
    const disabled = countDisabledRules(biome.linter?.rules);
    return makeResult(
      category,
      statusFromCount(disabled.length),
      "Fresh",
      `${disabled.length} disabled linter rules`,
      "baseline",
      disabled.length
        ? `Disabled groups include ${disabled.slice(0, 5).join(", ")}${disabled.length > 5 ? "..." : ""}.`
        : "No disabled linter rules detected.",
      disabled.length
        ? "Review disabled Biome rules and promote one suppressing rule family per week."
        : "Keep Biome rule suppressions at zero.",
    );
  } catch (error) {
    return makeResult(
      category,
      "Red",
      "Unavailable",
      "biome.json unreadable",
      "unknown",
      error.message,
      "Repair biome.json before trusting lint debt status.",
    );
  }
}

function probeA11yDisabledRules(category) {
  try {
    const biome = parseBiome();
    const disabled = countDisabledRules({ a11y: biome.linter?.rules?.a11y ?? {} });
    const a11yText = readText("docs/design-system/A11Y_CONTRACTS.md");
    const coverageText = readText("docs/design-system/COVERAGE_MATRIX.md");
    const coverage = verifyCoverageCleared(coverageText, a11yText);
    const status = disabled.length === 0 && coverage.clear ? "Green" : "Amber";
    return makeResult(
      category,
      status,
      "Fresh",
      `${disabled.length} disabled a11y rules; ${coverage.unresolvedLines.length} unresolved coverage markers`,
      "baseline",
      disabled.length
        ? `Biome a11y suppressions remain: ${disabled.join(", ")}.`
        : coverage.clear
          ? "No disabled Biome a11y rules or unresolved coverage markers detected."
          : `Coverage still has unresolved evidence markers: ${coverage.unresolvedLines.slice(0, 3).join("; ")}.`,
      disabled.length || !coverage.clear
        ? "Retire or scope disabled a11y rules and keep host-only widget evidence explicit."
        : "Keep a11y suppressions at zero and refresh host-only evidence.",
    );
  } catch (error) {
    return makeResult(
      category,
      "Red",
      "Unavailable",
      "a11y source unreadable",
      "unknown",
      error.message,
      "Repair a11y contract sources before release-owner signoff.",
    );
  }
}

function probeCssLintCoverageGap(category) {
  try {
    const biome = parseBiome();
    const includes = biome.files?.includes ?? [];
    const cssExcluded = includes.some((entry) => entry.startsWith("!") && entry.endsWith(".css"));
    return makeResult(
      category,
      cssExcluded ? "Amber" : "Green",
      "Fresh",
      cssExcluded ? "CSS excluded from Biome" : "CSS included in Biome",
      "baseline",
      cssExcluded
        ? "Biome still excludes CSS from the lint surface, so CSS debt stays warn-first."
        : "CSS appears inside the Biome lint surface.",
      cssExcluded
        ? "Add or document an equivalent CSS lint check before promoting this category to green."
        : "Keep CSS lint coverage active.",
    );
  } catch (error) {
    return makeResult(
      category,
      "Red",
      "Unavailable",
      "CSS lint source unreadable",
      "unknown",
      error.message,
      "Repair biome.json before trusting CSS lint coverage status.",
    );
  }
}

function extractDate(text, regex) {
  const match = text.match(regex);
  return match?.[1] ?? null;
}

function daysBetween(dateString, generatedOn) {
  if (!dateString) return Number.POSITIVE_INFINITY;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY;
  return Math.floor((generatedOn - date) / 86400000);
}

function probeUpstreamAlignmentStamp(category, contract, generatedOn) {
  try {
    const text = readText("docs/design-system/UPSTREAM_ALIGNMENT.md");
    const verifiedAt = extractDate(text, /Last verified:\s+([0-9T:.-]+Z?)/i);
    const ageDays = daysBetween(verifiedAt, generatedOn);
    const staleAfter = contract.freshness.alignment_stale_after_days;
    const stale = ageDays > staleAfter;
    return makeResult(
      category,
      stale ? "Amber" : "Green",
      stale ? "Stale" : "Fresh",
      verifiedAt ? `last verified ${verifiedAt}` : "no verification stamp",
      "baseline",
      stale
        ? `Alignment stamp is ${Number.isFinite(ageDays) ? `${ageDays} days` : "unknown age"} old.`
        : "Alignment stamp is inside the freshness window.",
      stale
        ? "Run pnpm test:drift and refresh the upstream alignment stamp before release signoff."
        : "Keep drift verification current.",
    );
  } catch (error) {
    return makeResult(
      category,
      "Red",
      "Unavailable",
      "alignment source unreadable",
      "unknown",
      error.message,
      "Repair upstream alignment evidence before trusting integration drift status.",
    );
  }
}

function probeWorkOutstandingReliabilityMarkers(category, contract, generatedOn) {
  try {
    const text = readText("docs/work/work_outstanding.md");
    const markerRegex =
      /\b(blocked|unstable|flaky|host-only|requires host|port binding|failed|failing)\b/gi;
    const markers = text.match(markerRegex) ?? [];
    const lastUpdated = extractDate(text, /Last updated:?\**\s*([0-9-]{10})/i);
    const ageDays = daysBetween(lastUpdated, generatedOn);
    const stale = ageDays > contract.freshness.work_outstanding_stale_after_days;
    const status = markers.length === 0 && !stale ? "Green" : "Amber";
    return makeResult(
      category,
      status,
      stale ? "Stale" : "Fresh",
      `${markers.length} reliability markers`,
      "baseline",
      stale
        ? `Reliability source is ${Number.isFinite(ageDays) ? `${ageDays} days` : "unknown age"} old and still documents blocked/unstable gates.`
        : markers.length
          ? "Reliability markers remain documented for host-only or flaky gates."
          : "No reliability markers detected.",
      markers.length || stale
        ? "Refresh docs/work/work_outstanding.md from current CI/host evidence and retire stale blockers."
        : "Keep reliability notes current.",
    );
  } catch (error) {
    return makeResult(
      category,
      "Red",
      "Unavailable",
      "gate reliability source unreadable",
      "unknown",
      error.message,
      "Repair gate reliability evidence before release-owner signoff.",
    );
  }
}

function evaluateCategory(category, contract, generatedOn) {
  switch (category.probe) {
    case "biome_disabled_rules":
      return probeBiomeDisabledRules(category);
    case "a11y_disabled_rules":
      return probeA11yDisabledRules(category);
    case "css_excluded_from_biome":
      return probeCssLintCoverageGap(category);
    case "upstream_alignment_stamp":
      return probeUpstreamAlignmentStamp(category, contract, generatedOn);
    case "work_outstanding_reliability_markers":
      return probeWorkOutstandingReliabilityMarkers(category, contract, generatedOn);
    default:
      return makeResult(
        category,
        "Red",
        "Unavailable",
        "unknown probe",
        "unknown",
        `Unsupported probe: ${category.probe}`,
        "Add probe support before trusting this category.",
      );
  }
}

function overallPosture(results) {
  const worst = results.reduce(
    (current, result) => Math.max(current, STATUS_RANK.get(result.status) ?? 2),
    0,
  );
  return [...STATUS_RANK.entries()].find(([, rank]) => rank === worst)?.[0] ?? "Red";
}

function currentReports() {
  const reportDir = path.join(ROOT, DEFAULT_REPORT_DIR);
  if (!existsSync(reportDir)) return [];
  return readdirSync(reportDir)
    .filter((name) => /^quality-debt-burndown-\d{4}-W\d{2}\.md$/.test(name))
    .map((name) => path.join(DEFAULT_REPORT_DIR, name))
    .sort();
}

function renderReport(contract, results, options) {
  const posture = overallPosture(results);
  const nonGreen = results.filter((result) => result.status !== "Green");
  const staleOrUnavailable = results.filter((result) => result.freshness !== "Fresh");
  const reportRows = results
    .map(
      (result) =>
        `| ${result.category.label} | ${result.status} | ${result.freshness} | ${result.metric} | ${result.trend} | \`${result.owner}\` | ${result.notes} |`,
    )
    .join("\n");
  const actions = nonGreen
    .map((result) => `- [ ] ${result.category.label}: ${result.nextAction} (${result.owner})`)
    .join("\n");
  const staleSources = staleOrUnavailable
    .map((result) => `  - ${result.category.label}: ${result.freshness} - ${result.metric}`)
    .join("\n");
  const evidenceLinks = [
    "- Policy check output: `pnpm test:policy`",
    "- Drift suite output: `pnpm test:drift`",
    "- Coverage check output: `pnpm ds:matrix:check`",
    "- Lint output: `pnpm lint`",
    "- Radar check output: `pnpm quality-debt:check`",
  ].join("\n");

  return `# Quality Debt Burn-down

**Week:** \`${options.week}\`
**Generated on:** \`${options.generatedOn}\`
**Owner:** \`@platform\`
**Source contract:** \`/docs/operations/quality-debt-radar.md\`
**Category map:** \`/docs/operations/quality-debt-radar.categories.json\`

## Table of Contents

- [Summary](#summary)
- [Category Status](#category-status)
- [Trend vs Previous Week](#trend-vs-previous-week)
- [Top Actions for Next Week](#top-actions-for-next-week)
- [Release Impact Notes](#release-impact-notes)
- [Data Freshness and Gaps](#data-freshness-and-gaps)
- [Evidence Links](#evidence-links)

## Summary

- Overall posture: ${posture}
- Key movement: baseline snapshot generated by \`scripts/quality-debt-radar.mjs\`
- Notable risk: ${nonGreen.length ? `${nonGreen.length} categories are warn-first amber/red.` : "No non-green categories detected."}
- Warn-first mode: this report records debt visibility and release-owner context; it does not fail CI by category posture.

## Category Status

| Category | Current status | Freshness | Metric | Trend | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- |
${reportRows}

## Trend vs Previous Week

- Improved categories:
  - Baseline snapshot; no previous generated report was compared.
- Regressed categories:
  - Baseline snapshot; no previous generated report was compared.
- No-change categories:
  - ${results.map((result) => result.category.label).join(", ")}

## Top Actions for Next Week

${actions || "- [ ] Keep all radar categories green and current. (@platform)"}

## Release Impact Notes

- Release-go/no-go concerns:
  - Warn-first radar posture is ${posture}. Amber categories require owner acknowledgment before release signoff; red/unavailable categories require explicit mitigation.
- Required mitigations before release:
  - Refresh stale/unavailable sources and attach command evidence to the release checklist.

## Data Freshness and Gaps

- Stale sources:
${staleSources || "  - None"}
- Unavailable sources:
${
  results
    .filter((result) => result.freshness === "Unavailable")
    .map((result) => `  - ${result.category.label}: ${result.notes}`)
    .join("\n") || "  - None"
}
- Follow-up owners and due dates:
${nonGreen.map((result) => `  - ${result.owner} - next weekly radar review - ${result.nextAction}`).join("\n") || "  - None"}

## Evidence Links

${evidenceLinks}

## Source Commands

${contract.categories
  .map(
    (category) =>
      `- ${category.label}: ${category.source_commands.map((command) => `\`${command}\``).join(", ")}`,
  )
  .join("\n")}
`;
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === "--") {
    } else if (arg === "--plain" || arg === "--no-color") {
      options.plain = true;
    } else if (arg === "--output") {
      options.output = rest[++index];
    } else if (arg === "--date") {
      options.date = rest[++index];
    } else if (arg === "--week") {
      options.week = rest[++index];
    } else if (arg === "--help" || arg === "-h") {
      usage(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return { command, options };
}

function check() {
  const contract = loadContract();
  const template = readText(TEMPLATE_PATH);
  for (const category of contract.categories) {
    if (!template.includes(category.label)) {
      throw new Error(`Template is missing category label: ${category.label}`);
    }
  }
  const reports = currentReports();
  console.log(`quality-debt: contract ok (${contract.categories.length} categories)`);
  console.log(`quality-debt: generated reports found ${reports.length}`);
}

function report(options) {
  const contract = loadContract();
  const generatedDate = options.date ? parseDateOption(options.date) : new Date();
  const generatedOn = isoDate(generatedDate);
  const week = options.week ?? getIsoWeek(generatedDate);
  if (!/^\d{4}-W\d{2}$/.test(week)) {
    throw new Error(`Expected --week YYYY-WW, got: ${week}`);
  }
  const output =
    options.output ?? path.join(DEFAULT_REPORT_DIR, `quality-debt-burndown-${week}.md`);
  const outputPath = path.isAbsolute(output) ? output : path.join(ROOT, output);
  const results = contract.categories.map((category) =>
    evaluateCategory(category, contract, generatedDate),
  );
  const body = renderReport(contract, results, { generatedOn, week });
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, body);
  console.log(`quality-debt: wrote ${output}`);
  console.log(`quality-debt: posture ${overallPosture(results)} (warn-first)`);
}

try {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (!command || command === "--help" || command === "-h") usage(0);
  if (command === "check") {
    check();
  } else if (command === "report") {
    report(options);
  } else {
    usage(1);
  }
} catch (error) {
  console.error(`quality-debt: ${error.message}`);
  process.exitCode = 1;
}
