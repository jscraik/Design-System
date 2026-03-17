#!/usr/bin/env node
/**
 * interaction-coverage-gate.mjs
 *
 * Reports what % of component story *files* contain at least one play() function
 * (i.e. an interaction test). Warns below 40%, hard-fails below 10%.
 *
 * Usage:
 *   node platforms/web/apps/storybook/scripts/interaction-coverage-gate.mjs
 *
 * Add to CI:
 *   run: node platforms/web/apps/storybook/scripts/interaction-coverage-gate.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../../../..");

// Only check component stories, not doc/design-system stories
const COMPONENT_ROOTS = [
  "packages/ui/src/app/chat",
  "packages/ui/src/app/settings",
  "packages/ui/src/app/modals",
  "packages/ui/src/components/ui/base",
  "packages/ui/src/components/ui/forms",
  "packages/ui/src/components/ui/navigation",
  "packages/ui/src/components/ui/overlays",
  "packages/ui/src/components/ui/feedback",
  "packages/ui/src/components/ui/data-display",
  "packages/ui/src/components/ui/chat",
  "packages/ui/src/templates",
  "packages/effects/stories",
];

const WARN_THRESHOLD = 40; // % — yellow
const FAIL_THRESHOLD = 10; // % — red (hard fail)

function findStoryFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findStoryFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".stories.tsx")) {
      results.push(full);
    }
  }
  return results;
}

function hasPlayFunction(content) {
  // Match `play:` as a story property (not inside a comment or string)
  return /^\s+play\s*:/m.test(content) || /,\s*play\s*:/s.test(content);
}

const storyFiles = COMPONENT_ROOTS.flatMap((rel) => findStoryFiles(path.join(repoRoot, rel)));

let covered = 0;
const missing = [];

for (const file of storyFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const rel = path.relative(repoRoot, file);
  if (hasPlayFunction(content)) {
    covered++;
  } else {
    missing.push(rel);
  }
}

const total = storyFiles.length;
const pct = total > 0 ? Math.round((covered / total) * 100) : 0;

const icon = pct >= WARN_THRESHOLD ? "✅" : pct >= FAIL_THRESHOLD ? "⚠️" : "❌";
console.log(
  `\nInteraction coverage: ${icon} ${covered}/${total} story files have play() functions (${pct}%)`,
);

if (missing.length > 0 && pct < WARN_THRESHOLD) {
  console.log(`\nFiles without interaction tests (${missing.length}):`);
  missing.slice(0, 20).forEach((f) => console.log(`  ${f}`));
  if (missing.length > 20) console.log(`  ... and ${missing.length - 20} more`);
}

console.log(`\nThresholds: warn=${WARN_THRESHOLD}%  fail=${FAIL_THRESHOLD}%`);

if (pct < FAIL_THRESHOLD) {
  console.error(`\n❌ Interaction coverage critically low (${pct}% < ${FAIL_THRESHOLD}%).`);
  console.error(`   Add play() functions to component stories to cover user interactions.`);
  process.exit(1);
} else if (pct < WARN_THRESHOLD) {
  console.warn(`\n⚠️  Interaction coverage below target (${pct}% < ${WARN_THRESHOLD}%).`);
  console.warn(`   Consider adding play() functions to the files listed above.`);
  // Warning only — does not fail CI
}
