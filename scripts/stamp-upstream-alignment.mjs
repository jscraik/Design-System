#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const alignmentPath = resolve("docs/design-system/UPSTREAM_ALIGNMENT.md");
const packagePath = resolve("packages/ui/package.json");

const alignment = readFileSync(alignmentPath, "utf8");
const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
const version = pkg.dependencies?.["@openai/apps-sdk-ui"] ?? "unknown";
const verifiedAt = new Date().toISOString();
const driftCommit = process.env.GITHUB_SHA ?? "local";

const lines = alignment.split("\n");
const updated = lines.map((line) => {
  if (line.startsWith("- Verified at:")) {
    return `- Verified at: ${verifiedAt}`;
  }
  if (line.startsWith("- apps-sdk-ui version:")) {
    return `- apps-sdk-ui version: ${version}`;
  }
  if (line.startsWith("- Drift suite commit:")) {
    return `- Drift suite commit: ${driftCommit}`;
  }
  return line;
});

writeFileSync(alignmentPath, updated.join("\n"), "utf8");
console.log(`Stamped upstream alignment log at ${verifiedAt}`);
