#!/usr/bin/env node
/**
 * Token Drift Detector
 *
 * Compares CSS custom properties declared in packages/tokens/dist/
 * against those consumed in packages/ui/src/.
 *
 * Exit 0 = no drift (all consumed vars are declared in tokens)
 * Exit 1 = drift found (vars consumed in ui that aren't in tokens output)
 *
 * Usage:
 *   node scripts/check-token-drift.mjs              # report only
 *   node scripts/check-token-drift.mjs --fail       # exit 1 on drift (CI mode)
 *   node scripts/check-token-drift.mjs --json       # JSON output
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const TOKEN_DIST_DIRS = [
  path.join(repoRoot, "packages/tokens/dist"),
];

const UI_SRC_DIRS = [
  path.join(repoRoot, "packages/ui/src"),
  path.join(repoRoot, "packages/effects/src"),
  path.join(repoRoot, "packages/widgets/src"),
];

const TOKEN_DECLARATION_PATTERN = /--[\w-]+(?=\s*:)/g;
const TOKEN_CONSUMPTION_PATTERN = /var\(\s*(--[\w-]+)/g;

// CSS vars that are allowed to be consumed without being in tokens/dist
// (browser built-ins, third-party overrides, etc.)
const ALLOWLIST = new Set([
  "--sb-",       // Storybook internals (prefix match below)
  "--radix-",    // Radix UI internals
]);

const isAllowlisted = (varName) =>
  [...ALLOWLIST].some((prefix) => varName.startsWith(prefix));

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function gatherFiles(dirs, extensions) {
  const results = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
          walk(full);
        } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
          results.push(full);
        }
      }
    };
    walk(dir);
  }
  return results;
}

function extractMatches(filePath, pattern) {
  const content = fs.readFileSync(filePath, "utf8");
  const matches = new Set();
  let m;
  const re = new RegExp(pattern.source, pattern.flags);
  while ((m = re.exec(content)) !== null) {
    matches.add(m[1] ?? m[0]);
  }
  return matches;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const failOnDrift = args.includes("--fail");
const jsonOutput = args.includes("--json");

// 1. Collect all declared token vars from tokens/dist (CSS + JS)
const declaredTokens = new Set();

const tokenDistFiles = gatherFiles(TOKEN_DIST_DIRS, [".css", ".js", ".ts"]);
for (const file of tokenDistFiles) {
  if (file.endsWith(".d.ts") || file.includes("node_modules")) continue;
  const content = fs.readFileSync(file, "utf8");
  let m;
  const re = new RegExp(TOKEN_DECLARATION_PATTERN.source, TOKEN_DECLARATION_PATTERN.flags);
  while ((m = re.exec(content)) !== null) {
    declaredTokens.add(m[0]);
  }
}

// 2. Collect all consumed vars from ui/effects/widgets src
const consumedMap = new Map(); // varName → Set<filePath>

const uiFiles = gatherFiles(UI_SRC_DIRS, [".css", ".ts", ".tsx", ".js"]);
for (const file of uiFiles) {
  if (file.includes("node_modules") || file.includes(".storybook")) continue;
  const content = fs.readFileSync(file, "utf8");
  let m;
  const re = new RegExp(TOKEN_CONSUMPTION_PATTERN.source, TOKEN_CONSUMPTION_PATTERN.flags);
  while ((m = re.exec(content)) !== null) {
    const varName = m[1];
    if (!consumedMap.has(varName)) consumedMap.set(varName, new Set());
    consumedMap.get(varName).add(path.relative(repoRoot, file));
  }
}

// 3. Find drift = consumed vars not in declared tokens (and not allowlisted)
const driftEntries = [];
for (const [varName, files] of consumedMap) {
  if (declaredTokens.has(varName)) continue;
  if (isAllowlisted(varName)) continue;
  driftEntries.push({ varName, files: [...files] });
}

driftEntries.sort((a, b) => a.varName.localeCompare(b.varName));

// 4. Output
const result = {
  schema_version: 1,
  summary: {
    declaredTokenCount: declaredTokens.size,
    consumedVarCount: consumedMap.size,
    driftCount: driftEntries.length,
    status: driftEntries.length === 0 ? "ok" : "drift",
  },
  drift: driftEntries,
};

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`\n📊 Token Drift Report`);
  console.log(`   Declared in tokens/dist : ${result.summary.declaredTokenCount}`);
  console.log(`   Consumed in ui/effects  : ${result.summary.consumedVarCount}`);
  console.log(`   Drifted vars            : ${result.summary.driftCount}`);

  if (driftEntries.length === 0) {
    console.log(`\n✅ No drift — all consumed CSS vars are declared in tokens.\n`);
  } else {
    console.log(`\n❌ Drift detected — ${driftEntries.length} consumed var(s) not in tokens output:\n`);
    for (const { varName, files } of driftEntries) {
      console.log(`  ${varName}`);
      for (const f of files.slice(0, 3)) {
        console.log(`    → ${f}`);
      }
      if (files.length > 3) console.log(`    → …and ${files.length - 3} more`);
    }
    console.log("");
  }
}

if (failOnDrift && driftEntries.length > 0) {
  process.exit(1);
}
