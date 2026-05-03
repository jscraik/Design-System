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
const dependencyFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

function extractModuleSpecifiers(content) {
  const specifiers = [];
  const patterns = [
    /\bimport\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/gs,
    /\bexport\s+(?:[^"']*?\s+from\s+)["']([^"']+)["']/gs,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/gs,
    /\brequire\s*\(\s*["']([^"']+)["']\s*\)/gs,
  ];
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      specifiers.push(match[1]);
    }
  }
  return specifiers;
}

function extractManifestDependencySpecifiers(content, relativePath) {
  if (path.basename(relativePath) !== "package.json") {
    return [];
  }
  const manifest = JSON.parse(content);
  const specifiers = [];
  for (const field of dependencyFields) {
    const dependencies = manifest[field];
    if (!dependencies || typeof dependencies !== "object" || Array.isArray(dependencies)) {
      continue;
    }
    specifiers.push(...Object.keys(dependencies));
  }
  return specifiers;
}

function isForbiddenSpecifier(specifier) {
  return forbiddenPatterns.some((pattern) => specifier.includes(pattern));
}

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
    const specifiers = [
      ...extractModuleSpecifiers(content),
      ...extractManifestDependencySpecifiers(content, relativePath),
    ];
    for (const specifier of specifiers) {
      if (isForbiddenSpecifier(specifier)) {
        violations.push(
          `${relativePath}: contains forbidden validation fixture import ${specifier}`,
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
