#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productRoots = ["packages", "platforms", "apps"];
const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  "validation-prototype",
]);
const scannedExtensions = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".json"]);
const forbiddenPatterns = ["packages/validation-prototype", "design-studio-tree-shaking-prototype"];

async function* walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) continue;
      yield* walk(absolutePath);
      continue;
    }
    if (entry.isFile() && scannedExtensions.has(path.extname(entry.name))) {
      yield absolutePath;
    }
  }
}

const violations = [];
for (const root of productRoots) {
  const rootPath = path.join(repoRoot, root);
  for await (const filePath of walk(rootPath)) {
    const relativePath = path.relative(repoRoot, filePath);
    const content = await readFile(filePath, "utf8");
    for (const pattern of forbiddenPatterns) {
      if (content.includes(pattern)) {
        violations.push(
          `${relativePath}: contains forbidden validation fixture reference ${pattern}`,
        );
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Product code must not import packages/validation-prototype.");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("validation-prototype import ban check passed.");
