import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".build",
  ".wrangler",
  ".swiftpm",
  ".turbo",
  "dist",
  "build",
  "reports",
  "test-results",
  "_temp",
  ".agent",
]);

const DEFAULT_IGNORE_FILES = new Set(["pnpm-lock.yaml"]);

export function globToRegex(pattern) {
  let regex = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  regex = regex.replace(/\*\*/g, ".*");
  regex = regex.replace(/(?<!\.)\*/g, "[^/]*");
  regex = regex.replace(/\?/g, ".");
  return new RegExp("^" + regex + "$");
}

export function isPathAllowed(filePath, allowPatterns = []) {
  if (!allowPatterns.length) return false;
  return allowPatterns.some((pattern) => globToRegex(pattern).test(filePath));
}

export function isPathIgnored(filePath, ignorePatterns = []) {
  return ignorePatterns.some((pattern) => globToRegex(pattern).test(filePath));
}

export function lineNumberAt(content, index) {
  if (index <= 0) return 1;
  let count = 1;
  let i = 0;
  while (i < index) {
    const next = content.indexOf("\n", i);
    if (next === -1 || next >= index) break;
    count += 1;
    i = next + 1;
  }
  return count;
}

export async function walkFiles(rootDir, options) {
  const {
    extensions = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"],
    ignoreDirs = DEFAULT_IGNORE_DIRS,
    ignoreFiles = DEFAULT_IGNORE_FILES,
  } = options || {};

  const results = [];

  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (ignoreDirs.has(entry.name)) continue;
        await walk(fullPath);
      } else if (entry.isFile()) {
        if (ignoreFiles.has(entry.name)) continue;
        const ext = path.extname(entry.name);
        if (!extensions.includes(ext)) continue;
        results.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return results;
}

export async function readText(filePath) {
  return await readFile(filePath, "utf8");
}

export function extractImportSources(content) {
  const sources = [];
  const importRegex = /\b(?:import|export)\s+[^;]*?from\s+["']([^"']+)["']/g;
  const requireRegex = /\brequire\(\s*["']([^"']+)["']\s*\)/g;
  const dynamicImportRegex = /\bimport\(\s*["']([^"']+)["']\s*\)/g;

  for (const regex of [importRegex, requireRegex, dynamicImportRegex]) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      sources.push({ source: match[1], index: match.index });
    }
  }

  return sources;
}

export function extractNamedImports(content) {
  const results = [];
  const regex = /\bimport\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawList = match[1];
    const source = match[2];
    const names = rawList
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => entry.split(/\s+as\s+/i)[0].trim())
      .filter(Boolean);
    results.push({ source, names, index: match.index });
  }
  return results;
}

export function extractClassNameStrings(content) {
  const results = [];
  const patterns = [
    /className\s*=\s*"([^"]*)"/g,
    /className\s*=\s*'([^']*)'/g,
    /className\s*=\s*\{\s*`([\s\S]*?)`\s*\}/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      results.push({ value: match[1], index: match.index });
    }
  }
  return results;
}

export function extractStyleBlocks(content) {
  const results = [];
  const regex = /style\s*=\s*\{\{[\s\S]*?\}\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({ value: match[0], index: match.index });
  }
  return results;
}
