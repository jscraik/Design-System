#!/usr/bin/env node

import type { Server } from "node:http";

import { TokenWatcher } from "./watch-tokens.js";

/**
 * Development tools orchestrator for token workflows.
 *
 * Coordinates token hot reload and a lightweight status server.
 */

interface DevToolsConfig {
  enableHotReload: boolean;
  enableStatusServer: boolean;
  verbose: boolean;
}

class DevToolsOrchestrator {
  private config: DevToolsConfig;
  private processes: Map<string, Server> = new Map();
  private tokenWatcher?: TokenWatcher;

  constructor(config: Partial<DevToolsConfig> = {}) {
    this.config = {
      enableHotReload: true,
      enableStatusServer: true,
      verbose: false,
      ...config,
    };
  }

  /**
   * Start all development tools
   */
  async start(): Promise<void> {
    console.log("🚀 Starting token development tools...");

    if (this.config.verbose) {
      console.log("Configuration:", this.config);
    }

    try {
      if (this.config.enableHotReload) {
        await this.startTokenHotReload();
      }

      if (this.config.enableStatusServer) {
        await this.startStatusServer();
      }

      console.log("✅ Development tools started successfully");
      console.log("   Press Ctrl+C to stop all tools");

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

    if (this.tokenWatcher) {
      console.log("   Stopping token watcher...");
    }

    for (const [name, server] of this.processes) {
      console.log(`   Stopping ${name}...`);
      server.close();
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

    setTimeout(() => {
      this.tokenWatcher?.start();
    }, 100);
  }

  private async startStatusServer(): Promise<void> {
    console.log("📊 Starting status server...");

    const { createServer } = await import("node:http");
    const server = createServer((req, res) => {
      if (req.url === "/status") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            tools: {
              tokenWatcher: this.config.enableHotReload ? "running" : "disabled",
              statusServer: "running",
            },
          }),
        );
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <html>
          <head><title>AStudio Tokens Dev Tools</title></head>
          <body>
            <h1>🛠️ AStudio Tokens Development Tools</h1>
            <ul>
              <li>Token Hot Reload: ${this.config.enableHotReload ? "✅ Active" : "⏸ Disabled"}</li>
              <li>Status Server: ✅ Active</li>
            </ul>
            <p><a href="/status">View Status JSON</a></p>
          </body>
        </html>
      `);
    });

    server.listen(3001, () => {
      console.log("   Status dashboard: http://localhost:3001");
    });

    this.processes.set("status-server", server);
  }
}

function main(): void {
  const args = process.argv.slice(2);

  const config: Partial<DevToolsConfig> = {
    verbose: args.includes("--verbose") || args.includes("-v"),
    enableHotReload: !args.includes("--no-hot-reload"),
    enableStatusServer: !args.includes("--no-status"),
  };

  const orchestrator = new DevToolsOrchestrator(config);
  orchestrator.start();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DevToolsOrchestrator };
