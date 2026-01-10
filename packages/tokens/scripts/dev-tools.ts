#!/usr/bin/env node

import { ChildProcess, spawn } from "child_process";
import type { Server } from "http";
import { join } from "path";

import { TokenWatcher } from "./watch-tokens.js";

/**
 * Development tools orchestrator for AStudioSwift
 *
 * Coordinates hot reload, documentation generation, and debugging tools
 * for an integrated development experience.
 */

interface DevToolsConfig {
  enableHotReload: boolean;
  enableDocGeneration: boolean;
  enablePerformanceMonitoring: boolean;
  verbose: boolean;
}

class DevToolsOrchestrator {
  private config: DevToolsConfig;
  private processes: Map<string, ChildProcess | Server> = new Map();
  private tokenWatcher?: TokenWatcher;

  constructor(config: Partial<DevToolsConfig> = {}) {
    this.config = {
      enableHotReload: true,
      enableDocGeneration: true,
      enablePerformanceMonitoring: true,
      verbose: false,
      ...config,
    };
  }

  /**
   * Start all development tools
   */
  async start(): Promise<void> {
    console.log("🚀 Starting AStudioSwift development tools...");

    if (this.config.verbose) {
      console.log("Configuration:", this.config);
    }

    try {
      // Start token hot reload
      if (this.config.enableHotReload) {
        await this.startTokenHotReload();
      }

      // Start documentation generation
      if (this.config.enableDocGeneration) {
        await this.startDocumentationWatcher();
      }

      // Start performance monitoring
      if (this.config.enablePerformanceMonitoring) {
        await this.startPerformanceMonitoring();
      }

      console.log("✅ All development tools started successfully");
      console.log("   Press Ctrl+C to stop all tools");

      // Handle graceful shutdown
      process.on("SIGINT", () => this.stop());
      process.on("SIGTERM", () => this.stop());
    } catch (error) {
      console.error("❌ Failed to start development tools:", error);
      await this.stop();
      process.exit(1);
    }
  }

  /**
   * Stop all development tools
   */
  async stop(): Promise<void> {
    console.log("\n🛑 Stopping development tools...");

    // Stop token watcher
    if (this.tokenWatcher) {
      console.log("   Stopping token watcher...");
      // TokenWatcher doesn't have a stop method, it handles SIGINT internally
    }

    // Stop all child processes
    for (const [name, process] of this.processes) {
      console.log(`   Stopping ${name}...`);
      if ("kill" in process) {
        process.kill("SIGTERM");
      } else {
        process.close();
      }
    }

    this.processes.clear();
    console.log("✅ All development tools stopped");
    process.exit(0);
  }

  private async startTokenHotReload(): Promise<void> {
    console.log("🔥 Starting token hot reload...");

    this.tokenWatcher = new TokenWatcher({
      verbose: this.config.verbose,
      debounceMs: 300,
    });

    // Start in a separate process to avoid blocking
    setTimeout(() => {
      this.tokenWatcher!.start();
    }, 100);
  }

  private async startDocumentationWatcher(): Promise<void> {
    console.log("📚 Starting documentation watcher...");

    const swiftPackagePath = join(process.cwd(), "../../platforms/apple/swift/ui-swift");
    const docsOutputPath = join(swiftPackagePath, "docs/components.md");

    // Generate initial documentation
    await this.generateDocumentation(swiftPackagePath, docsOutputPath);

    // Watch for Swift file changes
    const { watch } = await import("fs");
    const componentsPath = join(swiftPackagePath, "Sources/AStudioSwift/Components");

    watch(componentsPath, { recursive: true }, async (eventType, filename) => {
      if (filename && filename.endsWith(".swift") && eventType === "change") {
        console.log(`📝 Swift component changed: ${filename}`);
        await this.generateDocumentation(swiftPackagePath, docsOutputPath);
      }
    });
  }

  private async generateDocumentation(sourcePath: string, outputPath: string): Promise<void> {
    try {
      const process = spawn(
        "swift",
        [join(sourcePath, "scripts/generate-docs.swift"), sourcePath, outputPath],
        {
          stdio: this.config.verbose ? "inherit" : "pipe",
        },
      );

      await new Promise<void>((resolve, reject) => {
        process.on("close", (code) => {
          if (code === 0) {
            console.log("✅ Documentation updated");
            resolve();
          } else {
            reject(new Error(`Documentation generation failed with code ${code}`));
          }
        });

        process.on("error", reject);
      });
    } catch (error) {
      console.error("❌ Documentation generation failed:", error);
    }
  }

  private async startPerformanceMonitoring(): Promise<void> {
    console.log("⚡ Starting performance monitoring...");

    // Create a simple HTTP server to serve performance metrics
    const { createServer } = await import("http");
    const server = createServer((req, res) => {
      if (req.url === "/metrics") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            tools: {
              tokenWatcher: "running",
              documentationWatcher: "running",
              performanceMonitor: "running",
            },
            message: "Performance metrics available in Xcode previews",
          }),
        );
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
                    <html>
                        <head><title>AStudioSwift Dev Tools</title></head>
                        <body>
                            <h1>🛠️ AStudioSwift Development Tools</h1>
                            <p>Development tools are running. Check Xcode previews for performance metrics.</p>
                            <ul>
                                <li>Token Hot Reload: ✅ Active</li>
                                <li>Documentation Generation: ✅ Active</li>
                                <li>Performance Monitoring: ✅ Active</li>
                            </ul>
                            <p><a href="/metrics">View Metrics JSON</a></p>
                        </body>
                    </html>
                `);
      }
    });

    server.listen(3001, () => {
      console.log("   Performance dashboard: http://localhost:3001");
    });

    // Store server reference for cleanup
    this.processes.set("performance-server", server);
  }
}

// CLI interface
function main(): void {
  const args = process.argv.slice(2);

  const config: Partial<DevToolsConfig> = {
    verbose: args.includes("--verbose") || args.includes("-v"),
    enableHotReload: !args.includes("--no-hot-reload"),
    enableDocGeneration: !args.includes("--no-docs"),
    enablePerformanceMonitoring: !args.includes("--no-performance"),
  };

  const orchestrator = new DevToolsOrchestrator(config);
  orchestrator.start();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DevToolsOrchestrator };
