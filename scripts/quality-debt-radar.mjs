import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CONTRACT_PATH = "docs/operations/quality-debt-radar.categories.json";
const TEMPLATE_PATH = "reports/qa/quality-debt-burndown-template.md";
const DEFAULT_REPORT_DIR = "reports/qa";
const SERVICE_ID = 'service:"quality-debt-radar"';
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

/**
 * Print command-line usage instructions for the quality-debt-radar script and exit.
 * @param {number} exitCode - Process exit code to use when exiting; defaults to 0 (success).
 */
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

/**
 * Read and parse a JSON file located under the repository root.
 * @param {string} relativePath - Path relative to the project root (ROOT) to the JSON file.
 * @returns {*} The parsed JSON value.
 */
function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(ROOT, relativePath), "utf8"));
}

/**
 * Read a UTF-8 text file located under the repository root.
 * @param {string} relativePath - File path relative to the repository root (`process.cwd()`).
 * @returns {string} The file contents decoded as UTF-8.
 */
function readText(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

/**
 * Ensure a file exists at the given path relative to the repository root and return its absolute path.
 * @param {string} relativePath - Path relative to the repository root (ROOT) to verify.
 * @returns {string} The absolute filesystem path to the required file.
 * @throws {Error} If the file does not exist.
 */
function requireFile(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Required file missing: ${relativePath}`);
  }
  return absolutePath;
}

/**
 * Assert that a value is a plain object (non-null and not an array).
 * @param {*} value - The value to verify.
 * @param {string} label - Human-readable name included in the error message on failure.
 * @throws {Error} If `value` is null/undefined, not an object, or is an array; the error message is "`<label> must be an object.`".
 */
function assertPlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

/**
 * Ensure the freshness configuration is a plain object and contains each required freshness field as a positive integer.
 *
 * @param {Object} freshness - Freshness configuration object. Must include the required numeric fields (e.g., alignment/work-outstanding stale thresholds) and each must be an integer greater than zero.
 * @throws {Error} If `freshness` is not a plain object or any required freshness field is missing or not a positive integer.
 */
function validateFreshnessContract(freshness) {
  assertPlainObject(freshness, "Radar contract freshness");
  for (const field of REQUIRED_FRESHNESS_FIELDS) {
    if (!Number.isInteger(freshness[field]) || freshness[field] <= 0) {
      throw new Error(`Radar contract freshness.${field} must be a positive integer.`);
    }
  }
}

/**
 * Validate that a category's `status_rules` object exists and contains non-empty string rules.
 *
 * Verifies `category.status_rules` is a plain object and that each required key (`green`, `amber`, `red`)
 * is present and a non-empty string.
 *
 * @param {Object} category - Radar category object to validate; expected to have `id` and `status_rules` properties.
 * @throws {Error} If `status_rules` is not a plain object or any required status field is missing or not a non-empty string.
 */
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

/**
 * Load and validate the radar contract JSON from the configured contract path.
 *
 * Validations performed include schema version check, freshness contract shape,
 * presence of at least one category, required category fields (`id`, `label`,
 * `owner`, `description`, `probe`), uniqueness of category `id`s, non-empty
 * `source_anchors` and `source_commands`, valid `status_rules`, and existence
 * of each referenced source file and the report template.
 *
 * @returns {Object} The parsed and validated contract object.
 * @throws {Error} If the contract schema_version is unsupported.
 * @throws {Error} If the freshness contract is invalid.
 * @throws {Error} If no categories are defined.
 * @throws {Error} If a category is missing a required field (`id`, `label`, `owner`, `description`, or `probe`).
 * @throws {Error} If duplicate category `id`s are present.
 * @throws {Error} If a category lacks `source_anchors` or `source_commands`.
 * @throws {Error} If a category's `status_rules` are invalid.
 * @throws {Error} If any referenced source file or the template file is missing.
 */
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

/**
 * Format a Date as an ISO UTC date string in YYYY-MM-DD form.
 * @param {Date} date - The date to format.
 * @returns {string} The date formatted as `YYYY-MM-DD`.
 */
function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Compute the ISO-style year-week label for a given date using UTC.
 *
 * @param {Date} date - Date whose ISO week is computed; the date is interpreted in UTC (local time component is ignored).
 * @returns {string} Year-week string in the format `YYYY-Www` with the week number padded to two digits (e.g., `2026-W04`).
 */
function getIsoWeek(date) {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc - yearStart) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/**
 * Parse a `YYYY-MM-DD` date string and return a UTC Date set to midnight of that day.
 * @param {string} value - Date string in `YYYY-MM-DD` format.
 * @returns {Date} The corresponding `Date` at `T00:00:00Z` (UTC).
 * @throws {Error} If `value` does not match `YYYY-MM-DD` or does not produce a valid date.
 */
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

/**
 * Load and parse the project's biome.json file.
 * @returns {Object} The parsed JSON content of biome.json.
 */
function parseBiome() {
  return readJson("biome.json");
}

/**
 * Collects disabled linter rules from grouped rule settings.
 * @param {Record<string, Record<string, string>>|undefined|null} ruleGroups - Mapping of rule group names to rule name→setting maps; falsy values are treated as empty.
 * @returns {string[]} Array of disabled rule identifiers formatted as `group.rule`.
 */
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

/**
 * Determine a status label from an issue count, with an optional override for unavailable data.
 * @param {number} count - Number of issues; treated as zero for no issues and greater than zero for issues present.
 * @param {boolean} [redWhenUnavailable=false] - If true, treat the result as unavailable and return `"Red"` regardless of `count`.
 * @returns {string} `"Green"` when `count` is 0 (and not overridden), `"Amber"` when `count` is greater than 0 (and not overridden), `"Red"` when `redWhenUnavailable` is true.
 */
function statusFromCount(count, redWhenUnavailable = false) {
  if (redWhenUnavailable) return "Red";
  return count === 0 ? "Green" : "Amber";
}

/**
 * Checks two documents for unresolved accessibility coverage markers.
 *
 * @param {string} coverageText - The full text of the COVERAGE_MATRIX document.
 * @param {string} a11yText - The full text of the A11Y_CONTRACTS (or related) document.
 * @returns {{clear: boolean, unresolvedLines: string[]}} `clear` is `true` when no unresolved markers are found, `false` otherwise; `unresolvedLines` lists the trimmed lines that contain unresolved markers.
 */
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

/**
 * Create a normalized result object representing a category probe outcome.
 * @param {Object} category - The contract category object the result pertains to.
 * @param {string} status - Human-readable status label for the category (e.g., "Green", "Amber", "Red").
 * @param {string} freshness - Freshness indicator for the evidence source (e.g., "Fresh", "Stale", "Unavailable").
 * @param {*} metric - Numeric or textual metric summarizing the probe result.
 * @param {string} trend - Short trend indicator or description (e.g., "improving", "worse", "no-change").
 * @param {string} notes - Additional contextual notes or diagnostic messages.
 * @param {string} nextAction - Suggested next action owner-visible next step.
 * @returns {{category: Object, status: string, freshness: string, metric: *, trend: string, owner: *, notes: string, nextAction: string}} The normalized result object, including `owner` copied from `category.owner`.
 */
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

/**
 * Probes Biome configuration for disabled linter rules for the given radar category.
 *
 * @param {object} category - The contract category object being evaluated.
 * @returns {object} A normalized result object describing the category's linter-rule debt:
 *                   `status` ("Green", "Amber", or "Red"), `freshness` ("Fresh" or "Unavailable"),
 *                   `metric` (disabled rule count summary), `trend`, `notes`, and `nextAction`.
 *                   If Biome cannot be read or parsed, returns a result with `status: "Red"`,
 *                   `freshness: "Unavailable"`, `metric: "biome.json unreadable"`, and the
 *                   underlying error message placed in `notes`.
 */
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

/**
 * Evaluates accessibility (a11y) evidence and Biome suppressions for a category and produces a normalized result.
 *
 * @param {Object} category - Category metadata from the contract used to populate result fields (expects at least `owner` and `label`).
 * @returns {Object} Result object with keys: `category`, `status`, `freshness`, `metric`, `trend`, `owner`, `notes`, and `nextAction`. `status` is `"Green"` when no Biome a11y rules are disabled and no unresolved coverage markers are found, otherwise `"Amber"`. On read/parse failures the function returns a `"Red"` result with `freshness: "Unavailable"`, `metric: "a11y source unreadable"`, and `notes` containing the underlying error message.
 */
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

/**
 * Assess whether CSS files are included in Biome's lint surface for the given contract category.
 * @param {Object} category - The contract category to evaluate.
 * @returns {Object} A result object containing `category`, `status`, `freshness`, `metric`, `trend`, `notes`, and `nextAction`. `status` is `"Green"` when CSS is included, `"Amber"` when CSS is explicitly excluded, or `"Red"` with `freshness` `"Unavailable"` if evidence cannot be read.
 */
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

/**
 * Extracts the first capturing group's value from the given text using the provided regular expression.
 * @param {string} text - The string to search.
 * @param {RegExp} regex - A regular expression containing at least one capturing group.
 * @returns {string|null} The substring matched by the first capturing group, or `null` if the regex does not match.
 */
function extractDate(text, regex) {
  const match = text.match(regex);
  return match?.[1] ?? null;
}

/**
 * Compute the whole-day difference between a parsed date string and a reference date.
 *
 * @param {string|undefined|null} dateString - A date string parseable by `Date` (e.g., "YYYY-MM-DD"). If falsy or not a valid date, the function treats the date as unavailable.
 * @param {Date} generatedOn - Reference date to compare against.
 * @returns {number} The number of full days from the parsed date to `generatedOn` (floor of the difference). Returns `Infinity` when `dateString` is falsy or invalid.
 */
function daysBetween(dateString, generatedOn) {
  if (!dateString) return Number.POSITIVE_INFINITY;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY;
  return Math.floor((generatedOn - date) / 86400000);
}

/**
 * Checks the upstream alignment stamp file and reports category status based on its age.
 *
 * @param {Object} category - Radar category metadata used for result attribution.
 * @param {Object} contract - Parsed radar contract; expects `contract.freshness.alignment_stale_after_days` to define staleness threshold.
 * @param {string} generatedOn - ISO date string (YYYY-MM-DD) representing the report generation date used to compute stamp age.
 * @returns {Object} A normalized result object containing `category`, `status` ("Green" | "Amber" | "Red"), `freshness` ("Fresh" | "Stale" | "Unavailable"), `metric` (verification timestamp or a message), `trend`, `notes`, and `nextAction`.
 */
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

/**
 * Assess work-outstanding reliability markers and determine the category's status, freshness, and remediation guidance.
 *
 * @param {Object} category - Contract category being evaluated; used to populate the result and owner.
 * @param {Object} contract - Parsed radar contract, used for freshness thresholds.
 * @param {string} generatedOn - Reference date in `YYYY-MM-DD` format used to compute ages for staleness checks.
 * @returns {Object} A normalized result object containing `category`, `status`, `freshness`, `metric`, `trend`, `owner`, `notes`, and `nextAction`. `metric` reports the count of reliability markers; `freshness` is `"Fresh"`, `"Stale"`, or `"Unavailable"` and `status` reflects the evaluated posture (`"Green"`, `"Amber"`, or `"Red"`).
 */
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

/**
 * Dispatches the category to its configured probe and returns the probe result.
 *
 * @param {Object} category - Contract category object describing the radar category and its probe.
 * @param {Object} contract - Parsed radar contract used by probes that require contract-level freshness thresholds.
 * @param {string} generatedOn - ISO date string (YYYY-MM-DD) representing the report generation date used for age/staleness checks.
 * @returns {Object} A normalized result object with the keys: `category`, `status`, `freshness`, `metric`, `trend`, `owner`, `notes`, and `nextAction`. `status` will be one of `"Green"`, `"Amber"`, `"Red"`, or `"Unavailable"`.
 */
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

/**
 * Determine the overall worst status among category results.
 * @param {Array<Object>} results - Array of result objects; each must include a `status` string (e.g., `"Green"`, `"Amber"`, `"Red"`).
 * @returns {string} The highest-severity status present (`"Green"`, `"Amber"`, or `"Red"`), falling back to `"Red"` if no known status is found.
 */
function overallPosture(results) {
  const worst = results.reduce(
    (current, result) => Math.max(current, STATUS_RANK.get(result.status) ?? 2),
    0,
  );
  return [...STATUS_RANK.entries()].find(([, rank]) => rank === worst)?.[0] ?? "Red";
}

/**
 * List existing weekly quality-debt burndown report files.
 *
 * Scans the reports directory for files matching the pattern
 * `quality-debt-burndown-YYYY-WWW.md` and returns their relative paths sorted
 * lexically. If the reports directory does not exist, returns an empty array.
 * @returns {string[]} Relative paths (under the reports directory) to matching report files, sorted.
 */
function currentReports() {
  const reportDir = path.join(ROOT, DEFAULT_REPORT_DIR);
  if (!existsSync(reportDir)) return [];
  return readdirSync(reportDir)
    .filter((name) => /^quality-debt-burndown-\d{4}-W\d{2}\.md$/.test(name))
    .map((name) => path.join(DEFAULT_REPORT_DIR, name))
    .sort();
}

/**
 * Build the weekly Quality Debt Burn-down Markdown report from contract data and probe results.
 *
 * @param {Object} contract - Parsed radar contract containing category definitions and source commands.
 * @param {Array<Object>} results - Array of per-category result objects (status, freshness, metric, trend, owner, notes, nextAction, category).
 * @param {Object} options - Report generation options.
 * @param {string} options.generatedOn - ISO date string for when the report was generated (YYYY-MM-DD).
 * @param {string} options.week - ISO week identifier used in the report filename (e.g., `2026-W17`).
 * @return {string} The complete report body as a Markdown-formatted string.
 */
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

/**
 * Parse CLI positional command and recognized flags into a command string and an options object.
 *
 * Recognized flags:
 * - `--plain` or `--no-color` sets `options.plain = true`
 * - `--output <path>` sets `options.output`
 * - `--date <YYYY-MM-DD>` sets `options.date`
 * - `--week <YYYY-WW>` sets `options.week`
 * - `--help` or `-h` triggers usage and exits
 *
 * @param {string[]} argv - Argument list where the first element is the command and the remainder are flags/values.
 * @returns {{ command: string|undefined, options: { plain?: boolean, output?: string, date?: string, week?: string } }} Parsed command and options.
 * @throws {Error} Throws `Unknown argument: <arg>` for unrecognized flags.
 */
function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === "--") {
    } else if (arg === "--plain" || arg === "--no-color") {
      options.plain = true;
    } else if (arg === "--output") {
      options.output = readFlagValue(rest, index, arg);
      index += 1;
    } else if (arg === "--date") {
      options.date = readFlagValue(rest, index, arg);
      index += 1;
    } else if (arg === "--week") {
      options.week = readFlagValue(rest, index, arg);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      usage(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return { command, options };
}

/**
 * Read the required value after a flag and reject missing or flag-looking values.
 *
 * @param {string[]} args - Parsed argument tail after the command.
 * @param {number} index - Current flag index.
 * @param {string} flag - Flag name that requires a following value.
 * @returns {string} The next argument value for the flag.
 * @throws {Error} If the next value is missing or starts with `-`.
 */
function readFlagValue(args, index, flag) {
  const value = args[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

/**
 * Validate the radar contract against the Markdown template and report existing generated files.
 *
 * Throws if any contract category label is not present in the template.
 * Also prints a brief confirmation and the number of generated reports to stdout.
 *
 * @throws {Error} If the template is missing a category label (message: "Template is missing category label: <label>").
 */
function check() {
  const contract = loadContract();
  const template = readText(TEMPLATE_PATH);
  for (const category of contract.categories) {
    if (!template.includes(category.label)) {
      throw new Error(`Template is missing category label: ${category.label}`);
    }
  }
  const reports = currentReports();
  console.log(`quality-debt: contract ok (${contract.categories.length} categories) ${SERVICE_ID}`);
  console.log(`quality-debt: generated reports found ${reports.length} ${SERVICE_ID}`);
}

/**
 * Generate and write the weekly quality-debt burndown Markdown report.
 *
 * Loads and validates the radar contract, evaluates each category probe for the
 * provided generation date/week, renders the report Markdown, ensures the
 * output directory exists, writes the file, and logs the written path and
 * overall posture.
 *
 * @param {Object} options - Report generation options.
 * @param {string} [options.date] - Generation date as `YYYY-MM-DD`; when provided it is parsed as UTC.
 * @param {string} [options.week] - ISO week string in the form `YYYY-WW` to name the report (overrides computed week).
 * @param {string} [options.output] - Output file path (absolute or relative to repository root).
 * @throws {Error} If `options.week` is provided but does not match the expected `YYYY-WW` format.
 */
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
  console.log(`quality-debt: wrote ${output} ${SERVICE_ID}`);
  console.log(`quality-debt: posture ${overallPosture(results)} (warn-first) ${SERVICE_ID}`);
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
  console.error(`quality-debt: ${SERVICE_ID} ${error.message}`);
  process.exitCode = 1;
}
