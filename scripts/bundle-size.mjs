#!/usr/bin/env node

/**
 * Bundle Size Monitoring Script
 *
 * Analyzes bundle sizes and reports against configured budgets.
 * Can be run in CI to fail builds that exceed size limits.
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Configuration
const CONFIG = {
  // Size budgets in KB
  budgets: {
    // Widget bundles
    "widget-*.js": 500,
    "widget-*.css": 50,
    // Vendor chunks
    "vendor-react*.js": 150,
    "vendor-motion*.js": 100,
    "vendor-three*.js": 300,
    // Main bundles
    "index*.js": 200,
    "index*.css": 100,
  },
  // Directories to scan
  directories: ["packages/widgets/dist", "packages/ui/dist", "platforms/web/apps/web/dist/assets"],
  // Warn threshold (percentage of budget)
  warnThreshold: 0.8,
  // Fail threshold (percentage of budget)
  failThreshold: 1.0,
};

function formatSize(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  }
  return `${(kb / 1024).toFixed(2)} MB`;
}

function matchPattern(filename, pattern) {
  const regex = new RegExp(`^${pattern.replace(/\*/g, ".*").replace(/\./g, "\\.")}$`);
  return regex.test(filename);
}

function getBudget(filename) {
  for (const [pattern, budget] of Object.entries(CONFIG.budgets)) {
    if (matchPattern(filename, pattern)) {
      return budget * 1024; // Convert KB to bytes
    }
  }
  return null;
}

function analyzeDirectory(dir) {
  const results = [];

  if (!existsSync(dir)) {
    return results;
  }

  const files = readdirSync(dir);

  for (const file of files) {
    const filepath = join(dir, file);
    const stat = statSync(filepath);

    if (stat.isDirectory()) {
      results.push(...analyzeDirectory(filepath));
      continue;
    }

    if (!file.endsWith(".js") && !file.endsWith(".css")) {
      continue;
    }

    const size = stat.size;
    const budget = getBudget(file);

    results.push({
      file,
      path: filepath,
      size,
      budget,
      ratio: budget ? size / budget : null,
    });
  }

  return results;
}

function printReport(results) {
  console.log("\n📦 Bundle Size Report\n");
  console.log("=".repeat(80));

  let hasWarnings = false;
  let hasErrors = false;

  // Group by status
  const overBudget = [];
  const nearBudget = [];
  const underBudget = [];
  const noBudget = [];

  for (const result of results) {
    if (result.budget === null) {
      noBudget.push(result);
    } else if (result.ratio >= CONFIG.failThreshold) {
      overBudget.push(result);
      hasErrors = true;
    } else if (result.ratio >= CONFIG.warnThreshold) {
      nearBudget.push(result);
      hasWarnings = true;
    } else {
      underBudget.push(result);
    }
  }

  // Print over budget (errors)
  if (overBudget.length > 0) {
    console.log("\n❌ Over Budget:\n");
    for (const r of overBudget) {
      const percent = ((r.ratio - 1) * 100).toFixed(1);
      console.log(
        `  ${r.file}: ${formatSize(r.size)} (${percent}% over ${formatSize(r.budget)} budget)`,
      );
    }
  }

  // Print near budget (warnings)
  if (nearBudget.length > 0) {
    console.log("\n⚠️  Near Budget:\n");
    for (const r of nearBudget) {
      const percent = (r.ratio * 100).toFixed(1);
      console.log(
        `  ${r.file}: ${formatSize(r.size)} (${percent}% of ${formatSize(r.budget)} budget)`,
      );
    }
  }

  // Print under budget (success)
  if (underBudget.length > 0) {
    console.log("\n✅ Under Budget:\n");
    for (const r of underBudget) {
      const percent = (r.ratio * 100).toFixed(1);
      console.log(
        `  ${r.file}: ${formatSize(r.size)} (${percent}% of ${formatSize(r.budget)} budget)`,
      );
    }
  }

  // Print files without budget
  if (noBudget.length > 0) {
    console.log("\n📋 No Budget Configured:\n");
    for (const r of noBudget) {
      console.log(`  ${r.file}: ${formatSize(r.size)}`);
    }
  }

  // Summary
  console.log(`\n${"=".repeat(80)}`);
  const totalSize = results.reduce((sum, r) => sum + r.size, 0);
  console.log(`\nTotal: ${formatSize(totalSize)}`);
  console.log(`Files analyzed: ${results.length}`);

  if (hasErrors) {
    console.log("\n❌ Build failed: Some bundles exceed their size budget.\n");
    return 1;
  }

  if (hasWarnings) {
    console.log("\n⚠️  Build passed with warnings: Some bundles are near their size budget.\n");
    return 0;
  }

  console.log("\n✅ All bundles are within budget.\n");
  return 0;
}

function main() {
  const results = [];

  for (const dir of CONFIG.directories) {
    results.push(...analyzeDirectory(dir));
  }

  if (results.length === 0) {
    console.log("No bundle files found. Run build first.");
    return 0;
  }

  // Sort by size descending
  results.sort((a, b) => b.size - a.size);

  const exitCode = printReport(results);

  // In CI, exit with error code if over budget
  if (process.env.CI && exitCode !== 0) {
    process.exit(exitCode);
  }

  return exitCode;
}

main();
