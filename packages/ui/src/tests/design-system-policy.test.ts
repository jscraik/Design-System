import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

type CoverageRow = {
  name: string;
  source: "upstream_reexport" | "upstream_wrapper" | "radix_fallback" | "local_primitive";
  upstream: string | null;
  fallback: string | null;
  why_missing_upstream: string | null;
  migration_trigger: string | null;
  a11y_contract_ref: string | null;
};

const ROOT_DIR = resolve(process.cwd(), "..", "..");
const MATRIX_PATH = join(ROOT_DIR, "docs/design-system/COVERAGE_MATRIX.json");
const MATRIX_DOC_PATH = join(ROOT_DIR, "docs/design-system/COVERAGE_MATRIX.md");
const COMPONENTS_DIR = join(ROOT_DIR, "packages/ui/src/components");

const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const PX_VALUE_REGEX = /\b\d+(?:\.\d+)?px\b/;
const TOKEN_VAR_REGEX = /var\(--foundation-/;
const FOUNDATION_COLOR_PREFIXES = [
  "bg-foundation-",
  "text-foundation-",
  "border-foundation-",
  "ring-foundation-",
  "shadow-foundation-",
  "decoration-foundation-",
];

function readCoverageMatrix(): CoverageRow[] {
  return JSON.parse(readFileSync(MATRIX_PATH, "utf8")) as CoverageRow[];
}

function collectFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }
    if (!fullPath.endsWith(".ts") && !fullPath.endsWith(".tsx")) continue;
    if (fullPath.endsWith(".stories.tsx") || fullPath.endsWith(".test.tsx")) continue;
    files.push(fullPath);
  }

  return files;
}

function extractStyleBlocks(content: string): string[] {
  const blocks: string[] = [];
  const regex = /style=\{\{[\s\S]*?\}\}/g;
  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(content))) {
    blocks.push(match[0]);
  }
  return blocks;
}

describe("Design system policy checks", () => {
  test("No parallel components for Apps SDK exports", () => {
    const rows = readCoverageMatrix();
    const upstreamRows = rows.filter(
      (row) => row.source === "upstream_reexport" || row.source === "upstream_wrapper",
    );
    const duplicateNames = new Set<string>();
    const counts = new Map<string, number>();

    for (const row of rows) {
      counts.set(row.name, (counts.get(row.name) ?? 0) + 1);
    }

    for (const row of upstreamRows) {
      if ((counts.get(row.name) ?? 0) > 1) {
        duplicateNames.add(row.name);
      }
    }

    expect([...duplicateNames]).toEqual([]);
  });

  test("Coverage matrix includes required mapping metadata", () => {
    const rows = readCoverageMatrix();
    const missingUpstream = rows.filter(
      (row) =>
        (row.source === "upstream_reexport" || row.source === "upstream_wrapper") && !row.upstream,
    );
    const missingFallbackMeta = rows.filter(
      (row) =>
        row.source === "radix_fallback" &&
        (!row.why_missing_upstream || !row.migration_trigger || !row.a11y_contract_ref),
    );

    expect(missingUpstream).toEqual([]);
    expect(missingFallbackMeta).toEqual([]);
  });

  test("Coverage matrix docs include entries and upstream version reference", () => {
    const rows = readCoverageMatrix();
    const docContent = readFileSync(MATRIX_DOC_PATH, "utf8");
    const missingEntries = rows.filter((row) => !docContent.includes(`| ${row.name} |`));

    expect(docContent).toMatch(/Upstream version:\s+@openai\/apps-sdk-ui\s+/);
    expect(missingEntries).toEqual([]);
  });

  test("Inline styles avoid raw hex colors and px spacing", () => {
    const files = collectFiles(COMPONENTS_DIR);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      const styleBlocks = extractStyleBlocks(content);
      for (const block of styleBlocks) {
        if (TOKEN_VAR_REGEX.test(block)) continue;
        if (HEX_COLOR_REGEX.test(block) || PX_VALUE_REGEX.test(block)) {
          violations.push(file);
          break;
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test("Base components avoid foundation color utilities", () => {
    const baseDir = join(ROOT_DIR, "packages/ui/src/components/ui/base");
    const files = collectFiles(baseDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (FOUNDATION_COLOR_PREFIXES.some((prefix) => content.includes(prefix))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  test("Feedback components avoid foundation color utilities", () => {
    const feedbackDir = join(ROOT_DIR, "packages/ui/src/components/ui/feedback");
    const files = collectFiles(feedbackDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (FOUNDATION_COLOR_PREFIXES.some((prefix) => content.includes(prefix))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  test("Navigation components avoid foundation color utilities", () => {
    const navigationDir = join(ROOT_DIR, "packages/ui/src/components/ui/navigation");
    const files = collectFiles(navigationDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (FOUNDATION_COLOR_PREFIXES.some((prefix) => content.includes(prefix))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  test("Data display components avoid foundation color utilities", () => {
    const dataDisplayDir = join(ROOT_DIR, "packages/ui/src/components/ui/data-display");
    const files = collectFiles(dataDisplayDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (FOUNDATION_COLOR_PREFIXES.some((prefix) => content.includes(prefix))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  test("Templates avoid foundation color utilities", () => {
    const templatesDir = join(ROOT_DIR, "packages/ui/src/templates");
    const files = collectFiles(templatesDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (FOUNDATION_COLOR_PREFIXES.some((prefix) => content.includes(prefix))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  test("Overlay components avoid foundation color utilities", () => {
    const overlaysDir = join(ROOT_DIR, "packages/ui/src/components/ui/overlays");
    const files = collectFiles(overlaysDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (FOUNDATION_COLOR_PREFIXES.some((prefix) => content.includes(prefix))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  test("Form components avoid foundation color utilities", () => {
    const formsDir = join(ROOT_DIR, "packages/ui/src/components/ui/forms");
    const files = collectFiles(formsDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (FOUNDATION_COLOR_PREFIXES.some((prefix) => content.includes(prefix))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  test("App surfaces avoid foundation color utilities", () => {
    const appDir = join(ROOT_DIR, "packages/ui/src/app");
    const files = collectFiles(appDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (FOUNDATION_COLOR_PREFIXES.some((prefix) => content.includes(prefix))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  test("Widget surfaces avoid foundation color utilities", () => {
    const widgetsDir = join(ROOT_DIR, "packages/widgets/src");
    const files = collectFiles(widgetsDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (FOUNDATION_COLOR_PREFIXES.some((prefix) => content.includes(prefix))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  test("Theme defines responsive text usage slots and on-color variants", () => {
    const themePath = join(ROOT_DIR, "packages/ui/src/styles/theme.css");
    const content = readFileSync(themePath, "utf8");
    const requiredVars = [
      "--text-hero",
      "--text-heading",
      "--text-body",
      "--text-placeholder",
      "--text-caption",
      "--text-hero-on-color",
      "--text-heading-on-color",
      "--text-body-on-color",
      "--text-placeholder-on-color",
      "--text-caption-on-color",
      "--color-text-hero",
      "--color-text-heading",
      "--color-text-body",
      "--color-text-placeholder",
      "--color-text-caption",
      "--color-text-hero-on-color",
      "--color-text-heading-on-color",
      "--color-text-body-on-color",
      "--color-text-placeholder-on-color",
      "--color-text-caption-on-color",
    ];

    requiredVars.forEach((variable) => {
      expect(content).toContain(variable);
    });
  });

  test("Theme defines interactive and status state slots", () => {
    const themePath = join(ROOT_DIR, "packages/ui/src/styles/theme.css");
    const content = readFileSync(themePath, "utf8");
    const requiredVars = [
      "--interactive",
      "--interactive-hover",
      "--interactive-active",
      "--interactive-disabled",
      "--status-success",
      "--status-success-muted",
      "--status-error",
      "--status-error-muted",
      "--status-warning",
      "--color-interactive",
      "--color-interactive-hover",
      "--color-interactive-active",
      "--color-interactive-disabled",
      "--color-status-success",
      "--color-status-success-muted",
      "--color-status-error",
      "--color-status-error-muted",
      "--color-status-warning",
    ];

    requiredVars.forEach((variable) => {
      expect(content).toContain(variable);
    });
  });
});
