#!/usr/bin/env node

/**
 * Version Synchronization Script
 *
 * Synchronizes versions across npm packages.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Configuration
const CONFIG = {
  packages: [
    "packages/ui",
    "packages/runtime",
    "packages/tokens",
    "packages/widgets",
    "packages/cloudflare-template",
  ],
};

class VersionSynchronizer {
  constructor() {
    this.rootVersion = this.getRootVersion();
  }

  /**
   * Get version from root package.json
   */
  getRootVersion() {
    try {
      const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
      return packageJson.version || "0.1.0";
    } catch (error) {
      console.warn("Warning: Could not read root package.json, using default version 0.1.0", error);
      return "0.1.0";
    }
  }

  /**
   * Synchronize all package versions
   */
  async synchronize() {
    console.log("🔄 Synchronizing versions...");
    console.log(`Target version: ${this.rootVersion}`);
    console.log("=".repeat(50));

    let updated = 0;
    let errors = 0;

    for (const packagePath of CONFIG.packages) {
      try {
        if (await this.updateNpmPackage(packagePath)) {
          updated++;
        }
      } catch (error) {
        console.error(`❌ Failed to update ${packagePath}:`, error.message);
        errors++;
      }
    }

    console.log("=".repeat(50));
    console.log(`✅ Updated: ${updated} packages`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} packages`);
    }
    console.log("🔄 Version synchronization complete");

    return { updated, errors };
  }

  /**
   * Update npm package version
   */
  async updateNpmPackage(packagePath) {
    const packageJsonPath = join(packagePath, "package.json");

    if (!existsSync(packageJsonPath)) {
      console.log(`  ⏭️  Skipping ${packagePath} (no package.json)`);
      return false;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

    if (packageJson.version === this.rootVersion) {
      console.log(`  ✓  ${packagePath} already at v${this.rootVersion}`);
      return false;
    }

    packageJson.version = this.rootVersion;
    writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

    console.log(`  ✅ Updated ${packagePath} to v${this.rootVersion}`);
    return true;
  }

  /**
   * Get current version from package
   */
  getCurrentVersion(packagePath) {
    const packageJsonPath = join(packagePath, "package.json");
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      return packageJson.version;
    }

    return null;
  }

  /**
   * List all package versions
   */
  listVersions() {
    console.log("📋 Current package versions:");
    console.log("=".repeat(50));

    for (const packagePath of CONFIG.packages) {
      const version = this.getCurrentVersion(packagePath);
      const status = version === this.rootVersion ? "✓" : "❌";
      console.log(`  ${status} ${packagePath}: ${version || "unknown"}`);
    }

    console.log("=".repeat(50));
    console.log(`Root version: ${this.rootVersion}`);
  }

  /**
   * Check for version mismatches without writing files
   * Returns true if mismatches found
   */
  checkVersions() {
    console.log("🔍 Checking version synchronization...");
    console.log(`Target version: ${this.rootVersion}`);
    console.log("=".repeat(50));

    const mismatches = [];

    for (const packagePath of CONFIG.packages) {
      const packageJsonPath = join(packagePath, "package.json");
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
        if (packageJson.version !== this.rootVersion) {
          console.log(`  ❌ ${packagePath}: ${packageJson.version} (expected ${this.rootVersion})`);
          mismatches.push({
            packagePath,
            current: packageJson.version,
            expected: this.rootVersion,
          });
        } else {
          console.log(`  ✓  ${packagePath}: ${packageJson.version}`);
        }
      }
    }

    console.log("=".repeat(50));
    if (mismatches.length > 0) {
      console.log(
        `❌ Found ${mismatches.length} version mismatch${mismatches.length > 1 ? "es" : ""}`,
      );
      return true;
    }

    console.log(`✅ All packages synchronized to v${this.rootVersion}`);
    return false;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const synchronizer = new VersionSynchronizer();

  if (args.includes("--check") || args.includes("-c")) {
    const hasMismatch = synchronizer.checkVersions();
    if (hasMismatch) {
      process.exit(1);
    }
    return;
  }

  if (args.includes("--list") || args.includes("-l")) {
    synchronizer.listVersions();
    return;
  }

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Version Synchronization Script

Usage: node scripts/version-sync.mjs [options]

Options:
  --check, -c    Check for version mismatches without writing (exits non-zero if found)
  --list, -l    List current package versions
  --help, -h    Show this help message

Examples:
  node scripts/version-sync.mjs          # Synchronize all packages
  node scripts/version-sync.mjs --list   # List current versions
  node scripts/version-sync.mjs --check  # Check for mismatches (read-only)
    `);
    return;
  }

  const result = await synchronizer.synchronize();

  if (result.errors > 0) {
    process.exit(1);
  }
}

// Export for testing
export { VersionSynchronizer };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
