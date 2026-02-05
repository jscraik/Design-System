#!/usr/bin/env node

/**
 * Simple internal link checker for markdown files.
 * - Scans *.md files in the repo (excluding common build dirs)
 * - Validates relative links to files/directories
 * - Ignores external links (http/https/mailto/tel)
 */

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".build-cache",
  ".next",
  ".turbo",
  ".pnpm",
  ".cache",
  "_temp",
  "_docs",
]);

const LINK_RE = /!?\[[^\]]*\]\(([^)]+)\)/g;

function isExternal(link) {
  return (
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("mailto:") ||
    link.startsWith("tel:")
  );
}

function normalizeLink(raw) {
  let link = raw.trim();
  if (link.startsWith("<") && link.endsWith(">")) {
    link = link.slice(1, -1);
  }
  if (
    (link.startsWith('"') && link.endsWith('"')) ||
    (link.startsWith("'") && link.endsWith("'"))
  ) {
    link = link.slice(1, -1);
  }
  return link;
}

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".") {
      // Still allow .github and .kiro docs
      if (entry.isDirectory() && (entry.name === ".github" || entry.name === ".kiro")) {
        await walk(path.join(dir, entry.name), files);
      }
      continue;
    }
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(path.join(dir, entry.name), files);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function checkFile(file) {
  const content = await readFile(file, "utf8");
  const errors = [];
  const lines = content.split("\n");
  let inFence = false;

  for (let i = 0; i < lines.length; i += 1) {
    const lineText = lines[i];
    if (lineText.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    LINK_RE.lastIndex = 0;
    let match;
    while ((match = LINK_RE.exec(lineText)) !== null) {
      const raw = match[1];
      if (!raw) continue;
      const link = normalizeLink(raw);
      if (!link || link.startsWith("#") || isExternal(link)) {
        continue;
      }

      const [pathPart] = link.split("#");
      const [cleanPath] = pathPart.split("?");
      if (!cleanPath) continue;

      const target = cleanPath.startsWith("/")
        ? path.join(ROOT, cleanPath)
        : path.resolve(path.dirname(file), cleanPath);

      const ok = await exists(target);
      if (!ok) {
        errors.push({
          file: path.relative(ROOT, file),
          link,
          target: path.relative(ROOT, target),
          line: i + 1,
          column: match.index + 1,
        });
      }
    }
  }

  return errors;
}

async function main() {
  const files = await walk(ROOT);
  const allErrors = [];

  for (const file of files) {
    const errors = await checkFile(file);
    allErrors.push(...errors);
  }

  if (allErrors.length === 0) {
    console.log("✅ All markdown links resolved");
    process.exit(0);
  }

  console.error(`❌ Broken markdown links: ${allErrors.length}`);
  for (const err of allErrors) {
    console.error(
      `- ${err.file}:${err.line}:${err.column} -> ${err.link} (missing: ${err.target})`,
    );
  }

  process.exit(1);
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
