import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type CoverageRow = {
  name: string;
  source: string;
  upstream?: string;
  fallback?: string;
};

type LocalExport = {
  name: string;
  module: string;
};

const ROOT_DIR = resolve(process.cwd(), "..", "..");
const COVERAGE_PATH = resolve(ROOT_DIR, "docs/design-system/COVERAGE_MATRIX.json");
const INTEGRATION_PATH = resolve(ROOT_DIR, "packages/ui/src/integrations/apps-sdk/index.ts");
const require = createRequire(import.meta.url);

function parseIntegrationExports(): LocalExport[] {
  const raw = readFileSync(INTEGRATION_PATH, "utf8");
  const regex =
    /export\s+\{([^}]+)\}\s+from\s+["'](@openai\/apps-sdk-ui\/components\/[^"']+)["'];/g;
  const exports: LocalExport[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(raw))) {
    const body = match[1] ?? "";
    const module = match[2] ?? "";
    for (const part of body.split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const [name] = trimmed.split(/\s+as\s+/i);
      if (name) {
        exports.push({ name: name.trim(), module });
      }
    }
  }

  return exports.sort((a, b) => a.name.localeCompare(b.name));
}

function loadCoverageMatrix(): CoverageRow[] {
  const raw = readFileSync(COVERAGE_PATH, "utf8");
  return JSON.parse(raw) as CoverageRow[];
}

function loadUpstreamExports(): Set<string> {
  const sampleModule = require.resolve("@openai/apps-sdk-ui/components/Button");
  const componentsDir = resolve(sampleModule, "..", "..");
  const entries = readdirSync(componentsDir, { withFileTypes: true });
  return new Set(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
}

describe("Apps SDK UI drift suite", () => {
  it("keeps local Apps SDK UI re-exports stable", () => {
    const localExports = parseIntegrationExports().map((entry) => `${entry.name}::${entry.module}`);
    // Use toEqual() instead of toMatchSnapshot() due to vitest-axe SnapshotClient compatibility issue
    // TODO: Revert to toMatchSnapshot() when vitest-axe snapshot serialization is fixed
    const expectedExports = [
      "AppsSDKUIProvider::@openai/apps-sdk-ui/components/AppsSDKUIProvider",
      "Badge::@openai/apps-sdk-ui/components/Badge",
      "Button::@openai/apps-sdk-ui/components/Button",
      "Checkbox::@openai/apps-sdk-ui/components/Checkbox",
      "CodeBlock::@openai/apps-sdk-ui/components/CodeBlock",
      "Download::@openai/apps-sdk-ui/components/Icon",
      "Image::@openai/apps-sdk-ui/components/Image",
      "Input::@openai/apps-sdk-ui/components/Input",
      "Popover::@openai/apps-sdk-ui/components/Popover",
      "Sparkles::@openai/apps-sdk-ui/components/Icon",
      "Textarea::@openai/apps-sdk-ui/components/Textarea",
    ];
    expect(localExports).toEqual(expectedExports);
  });

  it("ensures upstream exports include local re-export modules", () => {
    const upstreamExports = loadUpstreamExports();
    const localExports = parseIntegrationExports();
    const missing = localExports.filter((entry) => {
      const moduleName = entry.module.split("/").pop() ?? "";
      return !upstreamExports.has(moduleName);
    });
    expect(missing).toEqual([]);
  });

  it("ensures coverage matrix upstream entries exist in Apps SDK UI", () => {
    const upstreamExports = loadUpstreamExports();
    const coverage = loadCoverageMatrix();
    const iconExports = new Set(
      parseIntegrationExports()
        .filter((entry) => entry.module.endsWith("/Icon"))
        .map((entry) => entry.name),
    );
    const missing = coverage.filter(
      (row) =>
        (row.source === "upstream_reexport" || row.source === "upstream_wrapper") &&
        row.upstream &&
        !upstreamExports.has(row.upstream) &&
        !(iconExports.has(row.upstream) && upstreamExports.has("Icon")),
    );
    expect(missing).toEqual([]);
  });

  it("logs replacement candidates for Radix fallbacks", () => {
    const upstreamExports = loadUpstreamExports();
    const coverage = loadCoverageMatrix();
    const replacementCandidates = coverage.filter(
      (row) => row.source === "radix_fallback" && upstreamExports.has(row.name),
    );

    if (replacementCandidates.length > 0) {
      console.warn("Potential Apps SDK UI replacements for Radix fallbacks detected:");
      for (const row of replacementCandidates) {
        console.warn(`- ${row.name} (fallback: ${row.fallback ?? "radix"})`);
      }
    }

    expect(Array.isArray(replacementCandidates)).toBe(true);
  });
});
