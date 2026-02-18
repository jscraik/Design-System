#!/usr/bin/env node

import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { join } from "node:path";

interface WatchConfig {
  debounceMs: number;
  verbose: boolean;
}

class TokenWatcher {
  private config: WatchConfig;
  private debounceTimer: NodeJS.Timeout | null = null;
  private isGenerating = false;

  constructor(config: Partial<WatchConfig> = {}) {
    this.config = {
      debounceMs: 300,
      verbose: false,
      ...config,
    };
  }

  /**
   * Start watching token source files for changes
   */
  start(): void {
    const watchPaths = [
      join(process.cwd(), "src/colors.ts"),
      join(process.cwd(), "src/spacing.ts"),
      join(process.cwd(), "src/typography.ts"),
    ];

    console.log("🔍 Watching token files for changes...");
    if (this.config.verbose) {
      console.log("   Watching:", watchPaths.map((p) => p.replace(process.cwd(), ".")).join(", "));
    }

    watchPaths.forEach((path) => {
      watch(path, { persistent: true }, (eventType, _filename) => {
        if (eventType === "change") {
          this.handleFileChange(path);
        }
      });
    });

    // Keep process alive
    process.on("SIGINT", () => {
      console.log("\n👋 Stopping token watcher...");
      process.exit(0);
    });

    console.log("✅ Token watcher started. Press Ctrl+C to stop.");
  }

  private handleFileChange(filePath: string): void {
    if (this.isGenerating) {
      if (this.config.verbose) {
        console.log("⏳ Generation in progress, queuing change...");
      }
      return;
    }

    // Clear existing debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Debounce file changes
    this.debounceTimer = setTimeout(async () => {
      await this.regenerateTokens(filePath);
    }, this.config.debounceMs);
  }

  private async regenerateTokens(changedFile: string): Promise<void> {
    this.isGenerating = true;
    const startTime = Date.now();

    try {
      const fileName = changedFile.split("/").pop();
      console.log(`\n🔄 Token change detected in ${fileName}`);

      if (this.config.verbose) {
        console.log(`   Full path: ${changedFile}`);
      }

      await this.runGeneration();

      const duration = Date.now() - startTime;
      console.log(`✅ Tokens regenerated in ${duration}ms`);

      // Notify about hot reload
      this.notifyHotReload();
    } catch (error) {
      console.error("❌ Token regeneration failed:", error);
      if (error instanceof Error) {
        console.error("   Error:", error.message);
      }
    } finally {
      this.isGenerating = false;
    }
  }

  private notifyHotReload(): void {
    console.log("🔥 Hot reload: your dev server should pick up CSS/token changes");
    console.log("   • Vite: ensure HMR is running");
    console.log("   • Storybook: restart if styles look stale");
  }

  private runGeneration(): Promise<void> {
    return new Promise((resolve, reject) => {
      const args = ["generate"];
      const child = spawn("pnpm", args, {
        cwd: process.cwd(),
        stdio: this.config.verbose ? "inherit" : "pipe",
      });

      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Token generation failed with exit code ${code}`));
        }
      });
    });
  }
}

// CLI interface
function main(): void {
  const args = process.argv.slice(2);
  const verbose = args.includes("--verbose") || args.includes("-v");
  const debounceMs = parseInt(
    args.find((arg) => arg.startsWith("--debounce="))?.split("=")[1] || "300",
    10,
  );

  const watcher = new TokenWatcher({ verbose, debounceMs });
  watcher.start();
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { TokenWatcher };
