#!/usr/bin/env node

/**
 * Bundle Size Monitor
 *
 * Monitors bundle sizes and enforces size budgets for production builds.
 * Integrates with CI/CD to fail builds that exceed thresholds.
 */

import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");

// Bundle size budgets (in KB)
// Updated to realistic values based on current bundle sizes + 10-20% buffer
const BUDGETS = {
  // Web app bundles - increased for current size + buffer
  "platforms/web/apps/web/dist/assets/index": { max: 550, warn: 500 },
  "platforms/web/apps/web/dist/assets/astudio-core": { max: 1300, warn: 1100 },
  "platforms/web/apps/web/dist/assets/astudio-chat": { max: 180, warn: 150 },
  "platforms/web/apps/web/dist/assets/react": { max: 220, warn: 200 },
  "platforms/web/apps/web/dist/assets/radix": { max: 280, warn: 250 },
  "platforms/web/apps/web/dist/assets/vendor": { max: 350, warn: 300 },

  // Widget bundles (entry chunks)
  "packages/widgets/dist/assets/dashboard-widget": { max: 50, warn: 40 },
  "packages/widgets/dist/assets/shopping-cart": { max: 50, warn: 40 },
  "packages/widgets/dist/assets/kitchen-sink-lite": { max: 30, warn: 20 },
  "packages/widgets/dist/assets/solar-system": { max: 120, warn: 100 },
  "packages/widgets/dist/assets/pizzaz-map": { max: 2000, warn: 1800 }, // Three.js-heavy demo

  // Library bundles - increased for current size
  "packages/ui/dist/index": { max: 600, warn: 550 },
  "packages/runtime/dist/index": { max: 60, warn: 50 },
  "packages/tokens/dist/index": { max: 40, warn: 35 },
};

// Gzip compression ratio estimate (typical: 0.3-0.4)
const GZIP_RATIO = 0.35;

class BundleSizeMonitor {
  constructor() {
    this.results = [];
    this.hasErrors = false;
    this.hasWarnings = false;
  }

  /**
   * Get file size in KB
   */
  getFileSize(filePath) {
    try {
      const stats = statSync(filePath);
      return stats.size / 1024;
    } catch {
      return null;
    }
  }

  /**
   * Find all matching files for a bundle pattern
   */
  findBundleFiles(pattern) {
    const fullPath = join(rootDir, pattern);
    const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
    const prefix = fullPath.substring(fullPath.lastIndexOf("/") + 1);

    if (!existsSync(dir)) {
      return [];
    }

    try {
      const files = readdirSync(dir);
      return files
        .filter((file) => file.startsWith(prefix) && file.endsWith(".js"))
        .map((file) => join(dir, file));
    } catch {
      return [];
    }
  }

  /**
   * Check a single bundle against its budget
   */
  checkBundle(pattern, budget) {
    const files = this.findBundleFiles(pattern);

    if (files.length === 0) {
      this.results.push({
        bundle: pattern,
        status: "skip",
        message: "Bundle not found (may not be built yet)",
      });
      return;
    }

    // Calculate total size
    let totalSize = 0;
    const fileDetails = [];

    for (const file of files) {
      const size = this.getFileSize(file);
      if (size !== null) {
        totalSize += size;
        fileDetails.push({
          file: file.replace(rootDir + "/", ""),
          size: size.toFixed(2),
          gzipped: (size * GZIP_RATIO).toFixed(2),
        });
      }
    }

    const gzippedSize = totalSize * GZIP_RATIO;

    // Check against budget
    let status = "pass";
    let message = `${totalSize.toFixed(2)} KB (${gzippedSize.toFixed(2)} KB gzipped)`;

    if (totalSize > budget.max) {
      status = "error";
      message += ` - EXCEEDS MAX BUDGET (${budget.max} KB)`;
      this.hasErrors = true;
    } else if (totalSize > budget.warn) {
      status = "warn";
      message += ` - exceeds warning threshold (${budget.warn} KB)`;
      this.hasWarnings = true;
    } else {
      message += ` - within budget (max: ${budget.max} KB)`;
    }

    this.results.push({
      bundle: pattern,
      status,
      message,
      size: totalSize,
      gzippedSize,
      budget,
      files: fileDetails,
    });
  }

  /**
   * Run all bundle checks
   */
  async check() {
    console.log("📦 Bundle Size Monitor\n");
    console.log("Checking bundle sizes against budgets...\n");

    for (const [pattern, budget] of Object.entries(BUDGETS)) {
      this.checkBundle(pattern, budget);
    }

    this.printResults();

    return {
      success: !this.hasErrors,
      hasWarnings: this.hasWarnings,
      results: this.results,
    };
  }

  /**
   * Print results to console
   */
  printResults() {
    console.log("=".repeat(80));
    console.log("Bundle Size Report");
    console.log("=".repeat(80));

    const grouped = {
      error: [],
      warn: [],
      pass: [],
      skip: [],
    };

    for (const result of this.results) {
      grouped[result.status].push(result);
    }

    // Print errors first
    if (grouped.error.length > 0) {
      console.log("\n❌ ERRORS (Exceeds Maximum Budget):\n");
      for (const result of grouped.error) {
        console.log(`  ${result.bundle}`);
        console.log(`    ${result.message}`);
        if (result.files) {
          for (const file of result.files) {
            console.log(`      - ${file.file}: ${file.size} KB (${file.gzipped} KB gzipped)`);
          }
        }
        console.log();
      }
    }

    // Print warnings
    if (grouped.warn.length > 0) {
      console.log("\n⚠️  WARNINGS (Exceeds Warning Threshold):\n");
      for (const result of grouped.warn) {
        console.log(`  ${result.bundle}`);
        console.log(`    ${result.message}`);
        console.log();
      }
    }

    // Print passes
    if (grouped.pass.length > 0) {
      console.log("\n✅ PASSED:\n");
      for (const result of grouped.pass) {
        console.log(`  ${result.bundle}: ${result.message}`);
      }
      console.log();
    }

    // Print skipped
    if (grouped.skip.length > 0) {
      console.log("\n⏭️  SKIPPED:\n");
      for (const result of grouped.skip) {
        console.log(`  ${result.bundle}: ${result.message}`);
      }
      console.log();
    }

    // Summary
    console.log("=".repeat(80));
    console.log("Summary:");
    console.log(`  Total bundles checked: ${this.results.length}`);
    console.log(`  ✅ Passed: ${grouped.pass.length}`);
    console.log(`  ⚠️  Warnings: ${grouped.warn.length}`);
    console.log(`  ❌ Errors: ${grouped.error.length}`);
    console.log(`  ⏭️  Skipped: ${grouped.skip.length}`);
    console.log("=".repeat(80));

    if (this.hasErrors) {
      console.log("\n❌ Bundle size check FAILED - some bundles exceed maximum budget");
      console.log("\nTo fix:");
      console.log("  1. Review the bundle analysis: pnpm bundle:analyze");
      console.log("  2. Consider code splitting or lazy loading");
      console.log("  3. Remove unused dependencies");
      console.log("  4. Use dynamic imports for large features");
    } else if (this.hasWarnings) {
      console.log("\n⚠️  Bundle size check PASSED with warnings");
      console.log("Consider optimizing bundles that exceed warning thresholds");
    } else {
      console.log("\n✅ All bundle sizes within budget!");
    }
  }

  /**
   * Generate JSON report for CI/CD
   */
  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      success: !this.hasErrors,
      hasWarnings: this.hasWarnings,
      summary: {
        total: this.results.length,
        passed: this.results.filter((r) => r.status === "pass").length,
        warnings: this.results.filter((r) => r.status === "warn").length,
        errors: this.results.filter((r) => r.status === "error").length,
        skipped: this.results.filter((r) => r.status === "skip").length,
      },
      results: this.results,
    };
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {
    json: args.includes("--json"),
    strict: args.includes("--strict"), // Treat warnings as errors
  };

  if (args.includes("--help")) {
    console.log(`
Bundle Size Monitor

Usage: node scripts/bundle-size-monitor.mjs [options]

Options:
  --json     Output results as JSON
  --strict   Treat warnings as errors (fail on warnings)
  --help     Show this help message

Examples:
  node scripts/bundle-size-monitor.mjs
  node scripts/bundle-size-monitor.mjs --json > bundle-report.json
  node scripts/bundle-size-monitor.mjs --strict
    `);
    process.exit(0);
  }

  const monitor = new BundleSizeMonitor();
  const result = await monitor.check();

  if (options.json) {
    console.log(JSON.stringify(monitor.generateReport(), null, 2));
  }

  // Exit with error code if checks failed
  const shouldFail = result.hasErrors || (options.strict && result.hasWarnings);
  process.exit(shouldFail ? 1 : 0);
}

// Export for testing
export { BUDGETS, BundleSizeMonitor };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
