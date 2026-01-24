#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "fs";
import { resolve } from "path";

function parseIntegrationExports() {
  const filePath = resolve("packages/ui/src/integrations/apps-sdk/index.ts");
  const raw = readFileSync(filePath, "utf8");
  const regex = /export\s+\{([^}]+)\}\s+from\s+["']@openai\/apps-sdk-ui\/components\/[^"']+["'];/g;
  const exports = new Set();
  let match;

  while ((match = regex.exec(raw))) {
    const body = match[1] ?? "";
    for (const part of body.split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const [name] = trimmed.split(/\s+as\s+/i);
      if (name) {
        exports.add(name.trim());
      }
    }
  }

  return exports;
}

function loadCoverageMatrix() {
  const matrixPath = resolve("docs/design-system/COVERAGE_MATRIX.json");
  const raw = readFileSync(matrixPath, "utf8");
  return JSON.parse(raw);
}

function loadIconExports() {
  const iconTypesPath = resolve(
    "node_modules/@openai/apps-sdk-ui/dist/types/components/Icon/index.d.ts",
  );
  if (!existsSync(iconTypesPath)) {
    return [];
  }

  const raw = readFileSync(iconTypesPath, "utf8");
  const regex = /export\s+\{\s+default\s+as\s+([A-Za-z0-9_]+)\s+\}/g;
  const exports = new Set();
  let match;

  while ((match = regex.exec(raw))) {
    const name = match[1];
    if (name) {
      exports.add(name);
    }
  }

  return [...exports];
}

async function loadUpstreamExports() {
  try {
    const typesPath = resolve(
      "node_modules/@openai/apps-sdk-ui/dist/types/components",
    );
    if (!existsSync(typesPath)) {
      throw new Error(`Missing apps-sdk-ui types path: ${typesPath}`);
    }

    const entries = readdirSync(typesPath, { withFileTypes: true });
    const componentNames = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    const upstreamExports = new Set(componentNames);
    loadIconExports().forEach((name) => upstreamExports.add(name));

    return upstreamExports;
  } catch (error) {
    console.error("Failed to enumerate @openai/apps-sdk-ui components:", error);
    process.exit(1);
  }
}

async function main() {
  const localExports = parseIntegrationExports();
  const upstreamExports = await loadUpstreamExports();
  const coverage = loadCoverageMatrix();

  const missing = [...localExports].filter((name) => !upstreamExports.has(name));
  const extra = [...upstreamExports].filter((name) => !localExports.has(name));

  const missingUpstream = coverage.filter(
    (row) =>
      (row.source === "upstream_reexport" || row.source === "upstream_wrapper") &&
      row.upstream &&
      !upstreamExports.has(row.upstream),
  );

  if (missing.length > 0) {
    console.error("Apps SDK UI drift detected: local re-exports missing upstream components:");
    missing.forEach((name) => console.error(`- ${name}`));
    process.exit(1);
  }

  if (missingUpstream.length > 0) {
    console.error(
      "Apps SDK UI drift detected: coverage matrix references missing upstream exports:",
    );
    missingUpstream.forEach((row) => console.error(`- ${row.name} → ${row.upstream}`));
    process.exit(1);
  }

  if (extra.length > 0) {
    console.warn("Apps SDK UI has additional components not re-exported locally:");
    extra.forEach((name) => console.warn(`- ${name}`));
  }

  const replacementCandidates = coverage.filter(
    (row) => row.source === "radix_fallback" && upstreamExports.has(row.name),
  );

  if (replacementCandidates.length > 0) {
    console.warn("Potential Apps SDK UI replacements for Radix fallbacks detected:");
    replacementCandidates.forEach((row) => {
      console.warn(`- ${row.name} (fallback: ${row.fallback ?? "radix"})`);
    });
  }

  console.log("Apps SDK UI drift check passed.");
}

await main();
