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
});
