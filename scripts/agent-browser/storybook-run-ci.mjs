#!/usr/bin/env node

/**
 * agent-browser Storybook CI runner
 *
 * - Builds Storybook (pnpm storybook:build)
 * - Serves `platforms/web/apps/storybook/storybook-static` via an inline Node static server
 * - Runs `node scripts/agent-browser/storybook-run.mjs` against the server
 * - Always shuts down the server (even on failure)
 *
 * Usage:
 *   pnpm test:agent-browser:storybook:ci
 *
 * Environment:
 *   AGENT_BROWSER_STORYBOOK_PORT=6006
 */

import { spawn } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import http from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");

const HOST = "127.0.0.1";
const PORT = Number.parseInt(process.env.AGENT_BROWSER_STORYBOOK_PORT || "6006", 10);
const BASE_URL = `http://${HOST}:${PORT}`;

const STATIC_DIR = join(rootDir, "platforms", "web", "apps", "storybook", "storybook-static");

function contentTypeForPath(filePath) {
  const ext = extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".ico":
      return "image/x-icon";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}

async function runCmd(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd: rootDir,
      stdio: "inherit",
      ...options,
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`));
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to spawn ${cmd}: ${err.message}`));
    });
  });
}

function createStaticServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const reqUrl = new URL(req.url || "/", BASE_URL);
      let pathname = decodeURIComponent(reqUrl.pathname);

      if (pathname === "/") {
        pathname = "/index.html";
      }

      // Normalize and prevent traversal.
      const normalized = normalize(pathname).replace(/^\.(?=\/)/, "");
      const candidatePath = join(STATIC_DIR, normalized);

      if (!candidatePath.startsWith(STATIC_DIR)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }

      let filePath = candidatePath;
      const fileStat = await stat(filePath).catch(() => null);

      if (!fileStat) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }

      if (fileStat.isDirectory()) {
        filePath = join(filePath, "index.html");
      }

      const buf = await readFile(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", contentTypeForPath(filePath));
      res.end(buf);
    } catch (_err) {
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  return server;
}

async function waitForIndexJson(timeoutMs = 30000) {
  const start = Date.now();
  const url = `${BASE_URL}/index.json`;

  while (Date.now() - start < timeoutMs) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        return;
      }
    } catch (_err) {
      // Not ready yet.
    }

    await new Promise((r) => setTimeout(r, 250));
  }

  throw new Error(`Static Storybook server not ready at ${url} after ${timeoutMs}ms`);
}

async function main() {
  let server;

  try {
    console.log("Building Storybook (static) ...");
    await runCmd("pnpm", ["storybook:build"]);

    console.log(`\\nServing Storybook static at ${BASE_URL}`);
    server = createStaticServer();

    await new Promise((resolve, reject) => {
      server.on("error", (err) => reject(err));
      server.listen(PORT, HOST, () => resolve());
    });

    await waitForIndexJson();

    console.log("\\nRunning agent-browser Storybook smoke ...");
    await runCmd("node", ["scripts/agent-browser/storybook-run.mjs"], {
      env: { ...process.env, AGENT_BROWSER_STORYBOOK_BASE_URL: BASE_URL },
    });

    console.log("\\nCI Storybook smoke tests passed");
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(() => resolve()));
      console.log("\\nStorybook static server stopped");
    }
  }
}

process.on("SIGTERM", () => {
  process.exit(143);
});

process.on("SIGINT", () => {
  process.exit(130);
});

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
