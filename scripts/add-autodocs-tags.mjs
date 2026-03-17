#!/usr/bin/env node
// Add tags: ['autodocs'] to all story meta exports that don't already have tags.
// Run: node scripts/add-autodocs-tags.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const STORY_DIRS = [
  path.join(repoRoot, "packages/ui/src"),
  path.join(repoRoot, "packages/effects/stories"),
  path.join(repoRoot, "packages/widgets"),
];

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && !entry.name.startsWith(".")) {
      walk(full, results);
    } else if (entry.isFile() && entry.name.endsWith(".stories.tsx")) {
      results.push(full);
    }
  }
  return results;
}

const files = STORY_DIRS.flatMap((d) => walk(d));
let patched = 0;
let skipped = 0;

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");

  // Skip if already has tags:
  if (/\btags\s*:/.test(src)) {
    skipped++;
    continue;
  }

  // Find the meta object opening: "const meta" followed by "= {"
  // Insert tags right after the first opening brace of the meta object
  const metaPattern = /(const meta[^=\n]*=\s*\{)/;
  const match = metaPattern.exec(src);
  if (!match) {
    skipped++;
    continue;
  }

  src = src.replace(match[1], `${match[1]}\n  tags: ['autodocs'],`);
  fs.writeFileSync(file, src, "utf8");
  patched++;
  console.log(`  + ${path.relative(repoRoot, file)}`);
}

console.log(`\nDone. Patched: ${patched} | Skipped: ${skipped} | Total: ${files.length}`);
