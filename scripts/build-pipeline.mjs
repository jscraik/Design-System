#!/usr/bin/env node

/**
 * Enhanced Monorepo Build Pipeline
 *
 * Supports web builds for npm packages with version synchronization,
 * incremental builds, and automated testing.
 */

import { spawn } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, join } from "node:path";

// Configuration
const CONFIG = {
  platforms: ["web"],
  packages: {
    npm: ["packages/ui", "packages/runtime", "packages/tokens", "packages/widgets"],
  },
  outputs: {
    web: [
      "packages/ui/dist",
      "packages/runtime/dist",
      "packages/tokens/dist",
      "packages/widgets/dist",
    ],
  },
  cacheDir: ".build-cache",
  manifestFile: ".build-cache/build-manifest.json",
};

class BuildPipeline {
  constructor() {
    this.startTime = Date.now();
    this.results = [];
    this.manifest = this.loadManifest();
  }

  /**
   * Main build entry point
   */
  async build(options = {}) {
    const {
      platforms = CONFIG.platforms,
      incremental = true,
      skipTests = false,
      syncVersions = false,
    } = options;

    console.log("🚀 Enhanced Monorepo Build Pipeline");
    console.log(`Platforms: ${platforms.join(", ")}`);
    console.log(`Incremental: ${incremental ? "enabled" : "disabled"}`);
    console.log("=".repeat(60));

    try {
      // Step 1: Version synchronization (optional)
      if (syncVersions) {
        await this.synchronizeVersions();
      }

      // Step 2: Token generation (cross-platform)
      await this.generateTokens(incremental);

      // Step 3: Platform builds
      for (const platform of platforms) {
        await this.buildPlatform(platform, incremental);
      }

      // Step 4: Testing (if not skipped)
      if (!skipTests) {
        await this.runTests(platforms);
      }

      // Step 5: Update manifest
      await this.updateManifest();

      this.printSummary();
      return { success: true, results: this.results };
    } catch (error) {
      console.error("❌ Build failed:", error.message);
      return { success: false, error: error.message, results: this.results };
    }
  }

  /**
   * Synchronize versions across npm packages
   */
  async synchronizeVersions() {
    console.log("\n📋 Synchronizing versions...");

    const rootPackageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const version = rootPackageJson.version || "0.1.0";

    // Update npm packages
    for (const packagePath of CONFIG.packages.npm) {
      const packageJsonPath = join(packagePath, "package.json");
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
        if (packageJson.version !== version) {
          packageJson.version = version;
          writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
          console.log(`  ✅ Updated ${packagePath} to v${version}`);
        }
      }
    }

    this.results.push({ step: "version-sync", success: true, version });
  }

  /**
   * Generate design tokens for all platforms
   */
  async generateTokens(incremental = true) {
    console.log("\n🎨 Generating design tokens...");

    const needsRegeneration = incremental ? this.needsTokenRegeneration() : true;

    if (!needsRegeneration) {
      console.log("  ⏭️  Tokens up to date, skipping generation");
      this.results.push({ step: "token-generation", success: true, skipped: true });
      return;
    }

    try {
      // Generate tokens using existing script
      await this.runCommand("pnpm", ["generate:tokens"], { cwd: process.cwd() });

      // Verify outputs exist
      const expectedOutputs = [
        "packages/tokens/src/foundations.css",
        "packages/tokens/docs/outputs/manifest.json",
      ];

      for (const output of expectedOutputs) {
        if (!existsSync(output)) {
          throw new Error(`Expected token output not found: ${output}`);
        }
      }

      console.log("  ✅ Token generation complete");
      this.results.push({ step: "token-generation", success: true });
    } catch (error) {
      console.error("  ❌ Token generation failed:", error.message);
      throw error;
    }
  }

  /**
   * Build platform-specific artifacts
   */
  async buildPlatform(platform, incremental = true) {
    console.log(`\n🔨 Building ${platform} platform...`);

    switch (platform) {
      case "web":
        await this.buildWebPlatform(incremental);
        break;
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  /**
   * Build web platform (npm packages)
   */
  async buildWebPlatform(incremental = true) {
    const packages = CONFIG.packages.npm;

    for (const packagePath of packages) {
      if (!existsSync(join(packagePath, "package.json"))) {
        console.log(`  ⏭️  Skipping ${packagePath} (no package.json)`);
        continue;
      }

      const needsBuild = incremental ? this.needsPackageBuild(packagePath) : true;

      if (!needsBuild) {
        console.log(`  ⏭️  ${packagePath} up to date, skipping build`);
        continue;
      }

      try {
        console.log(`  🔨 Building ${packagePath}...`);
        await this.runCommand("pnpm", ["build"], { cwd: packagePath });
        console.log(`  ✅ ${packagePath} build complete`);

        this.results.push({
          step: "web-build",
          package: packagePath,
          success: true,
        });
      } catch (error) {
        console.error(`  ❌ ${packagePath} build failed:`, error.message);
        throw error;
      }
    }
  }

  /**
   * Run tests for specified platforms
   */
  async runTests(platforms) {
    console.log("\n🧪 Running tests...");

    const testSuites = [];

    if (platforms.includes("web")) {
      const { webPort, widgetsPort } = await this.resolvePlaywrightPorts();
      const playwrightEnv = {
        ...process.env,
        PLAYWRIGHT_WEB_PORT: String(webPort),
        PLAYWRIGHT_WIDGETS_PORT: String(widgetsPort),
      };

      testSuites.push(
        { name: "Unit Tests", command: "pnpm", args: ["test"], cwd: "packages/ui" },
        {
          name: "MCP Contract Tests",
          command: "pnpm",
          args: ["test:mcp-contract"],
          cwd: process.cwd(),
        },
        {
          name: "E2E Tests",
          command: "pnpm",
          args: ["test:e2e:web"],
          cwd: process.cwd(),
          env: playwrightEnv,
        },
        {
          name: "A11y Tests",
          command: "pnpm",
          args: ["test:a11y:widgets"],
          cwd: process.cwd(),
          env: playwrightEnv,
        },
      );
    }

    for (const suite of testSuites) {
      try {
        console.log(`  🧪 Running ${suite.name}...`);
        await this.runCommand(suite.command, suite.args, {
          cwd: suite.cwd,
          env: suite.env ?? process.env,
        });
        console.log(`  ✅ ${suite.name} passed`);

        this.results.push({
          step: "test",
          suite: suite.name,
          success: true,
        });
      } catch (error) {
        console.error(`  ❌ ${suite.name} failed:`, error.message);
        this.results.push({
          step: "test",
          suite: suite.name,
          success: false,
          error: error.message,
        });
        // Continue with other tests
      }
    }

    const failedSuites = this.results.filter(
      (result) => result.step === "test" && result.success === false,
    );
    if (failedSuites.length > 0) {
      const failedList = failedSuites.map((suite) => suite.suite).join(", ");
      throw new Error(`Test failures: ${failedList}`);
    }
  }

  /**
   * Resolve non-conflicting ports for Playwright webServer usage.
   */
  async resolvePlaywrightPorts() {
    const envWebPort = this.parseEnvPort("PLAYWRIGHT_WEB_PORT");
    const envWidgetsPort = this.parseEnvPort("PLAYWRIGHT_WIDGETS_PORT");

    const webPort = envWebPort ?? (await this.findAvailablePort(5174, 25)) ?? 5174;
    const widgetsBase = envWidgetsPort ?? webPort + 1;
    const widgetsPort =
      envWidgetsPort ?? (await this.findAvailablePort(widgetsBase, 25)) ?? widgetsBase;

    return { webPort, widgetsPort };
  }

  /**
   * Parse a port from environment variables.
   */
  parseEnvPort(name) {
    const value = process.env[name];
    if (!value) return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  /**
   * Find an available TCP port starting from a base.
   */
  async findAvailablePort(startPort, attempts = 10, host = "127.0.0.1") {
    for (let port = startPort; port < startPort + attempts; port += 1) {
      const available = await new Promise((resolve) => {
        const server = createServer();
        server.once("error", () => resolve(false));
        server.once("listening", () => {
          server.close(() => resolve(true));
        });
        server.listen(port, host);
      });

      if (available) return port;
    }

    return null;
  }

  /**
   * Check if tokens need regeneration based on source file changes
   */
  needsTokenRegeneration() {
    const sourceFiles = [
      "packages/tokens/src/colors.ts",
      "packages/tokens/src/spacing.ts",
      "packages/tokens/src/typography.ts",
      "packages/tokens/src/generator.ts",
    ];

    const outputFiles = [
      "packages/tokens/src/foundations.css",
      "packages/tokens/docs/outputs/manifest.json",
    ];

    return this.needsRebuild(sourceFiles, outputFiles);
  }

  /**
   * Check if npm package needs rebuild
   */
  needsPackageBuild(packagePath) {
    const sourceGlobs = [
      join(packagePath, "src/**/*"),
      join(packagePath, "package.json"),
      join(packagePath, "tsconfig.json"),
    ];

    const outputDir = join(packagePath, "dist");

    if (!existsSync(outputDir)) {
      return true;
    }

    const newestSourceMtime = this.getNewestFileMtime(sourceGlobs);
    const newestOutputMtime = this.getNewestFileMtimeInDir(outputDir);

    if (newestOutputMtime === null) {
      return true;
    }

    return newestSourceMtime > newestOutputMtime;
  }

  /**
   * Get newest file mtime from glob patterns
   */
  getNewestFileMtime(globs) {
    let newestMtime = 0;

    for (const glob of globs) {
      try {
        const files = this.expandGlob(glob);
        for (const file of files) {
          if (existsSync(file)) {
            const fileStat = statSync(file);
            newestMtime = Math.max(newestMtime, fileStat.mtime.getTime());
          }
        }
      } catch (error) {
        void error;
      }
    }

    return newestMtime;
  }

  /**
   * Get newest file mtime in a directory (recursively)
   */
  getNewestFileMtimeInDir(dir) {
    let newestMtime = null;

    try {
      const files = this.getAllFiles(dir);
      for (const file of files) {
        const fileStat = statSync(file);
        const mtime = fileStat.mtime.getTime();
        if (newestMtime === null || mtime > newestMtime) {
          newestMtime = mtime;
        }
      }
    } catch (error) {
      void error;
    }

    return newestMtime;
  }

  /**
   * Simple glob expansion (basic implementation)
   */
  expandGlob(pattern) {
    if (pattern.includes("**/")) {
      const baseDir = pattern.split("**/")[0];
      const extensionPattern = pattern.split("**/")[1];

      if (extensionPattern === "*") {
        if (existsSync(baseDir)) {
          return this.getAllFiles(baseDir);
        }
      } else if (extensionPattern.startsWith("*.") && !extensionPattern.includes("*.")) {
        const extension = extensionPattern.slice(1);
        if (existsSync(baseDir)) {
          return this.getAllFiles(baseDir).filter((file) => file.endsWith(extension));
        }
      } else if (existsSync(baseDir)) {
        return this.getAllFiles(baseDir);
      }
    }

    return existsSync(pattern) ? [pattern] : [];
  }

  /**
   * Recursively get all files in directory
   */
  getAllFiles(dir) {
    const files = [];
    try {
      const items = require("node:fs").readdirSync(dir);
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          files.push(...this.getAllFiles(fullPath));
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      void error;
      // Ignore errors
    }
    return files;
  }

  /**
   * Generic rebuild check based on source and output files
   */
  needsRebuild(sourceFiles, outputFiles) {
    // If any output file is missing, rebuild needed
    for (const output of outputFiles) {
      if (!existsSync(output)) {
        return true;
      }
    }

    // Find the newest source file and oldest output file
    let newestSource = 0;
    let oldestOutput = Infinity;

    for (const source of sourceFiles) {
      if (existsSync(source)) {
        const stat = statSync(source);
        newestSource = Math.max(newestSource, stat.mtime.getTime());
      }
    }

    for (const output of outputFiles) {
      if (existsSync(output)) {
        const stat = statSync(output);
        oldestOutput = Math.min(oldestOutput, stat.mtime.getTime());
      }
    }

    return newestSource > oldestOutput;
  }

  /**
   * Load build manifest
   */
  loadManifest() {
    if (existsSync(CONFIG.manifestFile)) {
      try {
        return JSON.parse(readFileSync(CONFIG.manifestFile, "utf8"));
      } catch (error) {
        console.warn("Warning: Could not load build manifest, starting fresh");
        void error;
      }
    }

    return {
      version: "1.0.0",
      builds: {},
      lastBuild: null,
    };
  }

  /**
   * Update build manifest
   */
  async updateManifest() {
    await mkdir(dirname(CONFIG.manifestFile), { recursive: true });

    this.manifest.lastBuild = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      results: this.results,
      success: this.results.every((r) => r.success !== false),
    };

    writeFileSync(CONFIG.manifestFile, JSON.stringify(this.manifest, null, 2));
  }

  /**
   * Run command with promise interface
   */
  runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: "inherit",
        shell: true,
        ...options,
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}: ${command} ${args.join(" ")}`));
        }
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }

  /**
   * Print build summary
   */
  printSummary() {
    const duration = Date.now() - this.startTime;
    const successful = this.results.filter((r) => r.success === true).length;
    const failed = this.results.filter((r) => r.success === false).length;
    const skipped = this.results.filter((r) => r.skipped === true).length;

    console.log(`\n${"=".repeat(60)}`);
    console.log("📊 Build Summary");
    console.log("=".repeat(60));
    console.log(`Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    console.log(`Skipped: ${skipped}`);

    if (failed === 0) {
      console.log("\n✅ Build completed successfully!");
    } else {
      console.log("\n❌ Build completed with errors.");
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--platforms":
        options.platforms = args[++i]?.split(",") || CONFIG.platforms;
        break;
      case "--no-incremental":
        options.incremental = false;
        break;
      case "--sync-versions":
        options.syncVersions = true;
        break;
      case "--skip-tests":
        options.skipTests = true;
        break;
      case "--help":
        console.log(`
Enhanced Monorepo Build Pipeline

Usage: node scripts/build-pipeline.mjs [options]

Options:
  --platforms <list>    Comma-separated list of platforms (web)
  --sync-versions       Synchronize versions before building
  --no-incremental      Disable incremental builds
  --skip-tests          Skip running tests
  --help                Show this help message

Examples:
  node scripts/build-pipeline.mjs
  node scripts/build-pipeline.mjs --platforms web
  node scripts/build-pipeline.mjs --no-incremental --skip-tests
  node scripts/build-pipeline.mjs --sync-versions
        `);
        process.exit(0);
        break;
    }
  }

  const pipeline = new BuildPipeline();
  const result = await pipeline.build(options);

  process.exit(result.success ? 0 : 1);
}

// Export for testing
export { BuildPipeline };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
