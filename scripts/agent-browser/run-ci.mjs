#!/usr/bin/env node
/**
 * agent-browser CI smoke test runner
 *
 * Starts Vite preview server, runs smoke tests, and cleans up.
 *
 * Usage:
 *   pnpm test:agent-browser:ci
 */

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");

const PORT = "4173";
const HOST = "127.0.0.1";
const BASE_URL = `http://${HOST}:${PORT}`;

let serverProcess = null;

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`Server ready at ${url}`);
        return;
      }
    } catch (_error) {
      // Server not ready yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Server not ready at ${url} after ${timeout}ms`);
}

async function startServer() {
  console.log(`Starting preview server on port ${PORT}`);

  serverProcess = spawn(
    "pnpm",
    ["-C", "platforms/web/apps/web", "preview", "--", "--host", HOST, "--port", PORT],
    {
      cwd: rootDir,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NODE_ENV: "production" },
    },
  );

  serverProcess.stdout.on("data", (data) => {
    console.log(`[server] ${data}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`[server] ${data}`);
  });

  await waitForServer(BASE_URL);
}

async function stopServer() {
  if (!serverProcess) {
    return;
  }

  console.log("Stopping preview server");
  serverProcess.kill("SIGTERM");

  setTimeout(() => {
    if (serverProcess && !serverProcess.killed) {
      console.log("Force killing preview server");
      serverProcess.kill("SIGKILL");
    }
  }, 5000);

  await new Promise((resolve) => serverProcess.on("exit", resolve));
  console.log("Preview server stopped");
}

async function runSmokeTests() {
  console.log("Running smoke tests");
  console.log("");

  const proc = spawn("node", ["scripts/agent-browser/run.mjs"], {
    cwd: rootDir,
    stdio: "inherit",
    env: { ...process.env, AGENT_BROWSER_BASE_URL: BASE_URL },
  });

  await new Promise((resolve, reject) => {
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Smoke tests failed with exit code ${code}`));
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to run smoke tests: ${err.message}`));
    });
  });
}

async function main() {
  try {
    await startServer();
    await runSmokeTests();
    console.log("");
    console.log("CI smoke tests passed");
  } catch (error) {
    console.error("");
    console.error(`CI smoke tests failed: ${error.message}`);
    throw error;
  } finally {
    await stopServer();
  }
}

process.on("SIGTERM", async () => {
  console.log("");
  console.log("Received SIGTERM, cleaning up");
  await stopServer();
  process.exit(143);
});

process.on("SIGINT", async () => {
  console.log("");
  console.log("Received SIGINT, cleaning up");
  await stopServer();
  process.exit(130);
});

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
