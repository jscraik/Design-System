#!/usr/bin/env node
/**
 * agent-browser smoke test runner
 *
 * Executes CLI-based flows against built web app preview.
 * Captures JSON snapshots and screenshots for each flow step.
 *
 * Usage:
 *   pnpm test:agent-browser
 *   AGENT_BROWSER_BASE_URL=http://localhost:5173 pnpm test:agent-browser
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");

const BASE_URL = process.env.AGENT_BROWSER_BASE_URL || "http://127.0.0.1:5173";
const SESSION_PREFIX = "astudio-smoke";
let SESSION_NAME = SESSION_PREFIX;
const RESULTS_DIR =
  process.env.AGENT_BROWSER_RESULTS_DIR || join(rootDir, "test-results", "agent-browser");
const SCREENSHOTS_DIR = join(RESULTS_DIR, "screenshots");
const SNAPSHOTS_DIR = join(RESULTS_DIR, "snapshots");

// Retry configuration for transient daemon errors
const MAX_FLOW_ATTEMPTS = Number(process.env.MAX_FLOW_ATTEMPTS) || 3;
const FLOW_RETRY_BASE_DELAY_MS = Number(process.env.FLOW_RETRY_BASE_DELAY_MS) || 1000;

[RESULTS_DIR, SCREENSHOTS_DIR, SNAPSHOTS_DIR].forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

const cliPath = existsSync(join(rootDir, "node_modules", ".bin", "agent-browser"))
  ? join(rootDir, "node_modules", ".bin", "agent-browser")
  : "agent-browser";

const TRANSIENT_DAEMON_PATTERNS = [
  /resource temporarily unavailable/i,
  /daemon may be busy or unresponsive/i,
  /command timed out/i,
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientDaemonError(message) {
  return TRANSIENT_DAEMON_PATTERNS.some((pattern) => pattern.test(message));
}

function flowSessionName(flowName, attempt) {
  return `${SESSION_PREFIX}-${flowName.toLowerCase().replace(/\s+/g, "-")}-${attempt}`;
}

async function closeSession() {
  try {
    await runAgentBrowserOnce(["--session", SESSION_NAME, "close"], 5000);
  } catch {
    // Session may not exist, ignore
  }
}

function runAgentBrowserOnce(args, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cliPath, args, {
      stdio: ["ignore", "pipe", "pipe"],
      cwd: rootDir,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      proc.kill("SIGTERM");
      setTimeout(() => {
        if (!proc.killed) {
          proc.kill("SIGKILL");
        }
      }, 2000);
      reject(
        new Error(
          `agent-browser command timed out after ${timeoutMs}ms: ${cliPath} ${args.join(" ")}`,
        ),
      );
    }, timeoutMs);

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      clearTimeout(timeoutId);
      if (settled) return;
      settled = true;
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(
          new Error(`agent-browser exited with code ${code}\nstdout: ${stdout}\nstderr: ${stderr}`),
        );
      }
    });

    proc.on("error", (err) => {
      clearTimeout(timeoutId);
      if (settled) return;
      settled = true;
      reject(new Error(`Failed to spawn agent-browser: ${err.message}`));
    });
  });
}

async function runAgentBrowser(args, options = {}) {
  const maxAttempts = options.maxAttempts ?? 5;
  const baseDelayMs = options.baseDelayMs ?? 1500;

  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await runAgentBrowserOnce(args, options.timeoutMs);
    } catch (error) {
      lastError = error;
      if (!isTransientDaemonError(error.message) || attempt === maxAttempts) {
        throw error;
      }
      const delay = baseDelayMs * attempt;
      console.warn(
        `agent-browser transient daemon error (attempt ${attempt}/${maxAttempts}); retrying in ${delay}ms`,
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

async function openUrl(url) {
  await runAgentBrowser(["--session", SESSION_NAME, "open", url]);
  await runAgentBrowser(["--session", SESSION_NAME, "wait", "500"]);
}

async function captureSnapshot(name) {
  const { stdout } = await runAgentBrowser(["--session", SESSION_NAME, "snapshot", "-i", "--json"]);

  const data = JSON.parse(stdout.trim());
  const snapshotPath = join(SNAPSHOTS_DIR, `${name}.json`);
  writeFileSync(snapshotPath, JSON.stringify(data, null, 2));

  return data;
}

async function takeScreenshot(name) {
  const screenshotPath = join(SCREENSHOTS_DIR, `${name}.png`);
  await runAgentBrowser(["--session", SESSION_NAME, "screenshot", "--full", screenshotPath]);
}

function selectRef(refs, predicate) {
  const entries = Object.entries(refs ?? {});
  for (const [key, value] of entries) {
    if (predicate(value)) {
      return key;
    }
  }
  return null;
}

function requireRef(refKey, message) {
  if (!refKey) {
    throw new Error(message);
  }
}

async function flowChatShell() {
  console.log("Flow: ChatShell");
  const url = `${BASE_URL}/`;

  await openUrl(url);
  const data = await captureSnapshot("chatshell-open");
  await takeScreenshot("chatshell-open");

  const textboxRef = selectRef(data?.data?.refs, (ref) => ref?.role === "textbox");

  requireRef(textboxRef, "Textbox not found on ChatShell");

  if (CHAT_SHELL_READ_ONLY_MODE) {
    console.log("ChatShell interaction skipped (read-only mode); refs validated");
    return;
  }

  await runAgentBrowser([
    "--session",
    SESSION_NAME,
    "fill",
    `@${textboxRef}`,
    "Smoke test message",
  ]);
  await runAgentBrowser(["--session", SESSION_NAME, "press", "Enter"], {
    timeoutMs: 10000,
    maxAttempts: 3,
  });
  await runAgentBrowser(["--session", SESSION_NAME, "wait", "500"]);
  await captureSnapshot("chatshell-after-send");
  await takeScreenshot("chatshell");
}

async function runFlowWithRetries(name, flowFn) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_FLOW_ATTEMPTS; attempt += 1) {
    SESSION_NAME = flowSessionName(name, attempt);

    try {
      await flowFn();
      await closeSession();
      return;
    } catch (error) {
      lastError = error;

      if (
        !isTransientDaemonError(String(error?.message || error)) ||
        attempt >= MAX_FLOW_ATTEMPTS
      ) {
        await closeSession();
        throw error;
      }

      const delayMs = FLOW_RETRY_BASE_DELAY_MS * attempt;
      console.warn(
        `Flow ${name} hit transient daemon error (attempt ${attempt}/${MAX_FLOW_ATTEMPTS}); retrying in ${delayMs}ms`,
      );
      await closeSession();
      await sleep(delayMs);
    }
  }

  throw lastError;
}

async function flowHarnessModal() {
  console.log("Flow: Harness Modal");
  const url = `${BASE_URL}/harness`;

  await openUrl(url);
  await captureSnapshot("harness-open");
  await takeScreenshot("harness-open");
  await runAgentBrowser([
    "--session",
    SESSION_NAME,
    "find",
    "role",
    "button",
    "click",
    "--name",
    "Open Settings",
  ]);
  await runAgentBrowser(["--session", SESSION_NAME, "wait", "500"]);
  await captureSnapshot("harness-modal-open");
  await takeScreenshot("harness-modal");
  await runAgentBrowser(["--session", SESSION_NAME, "press", "Escape"]);
  await runAgentBrowser(["--session", SESSION_NAME, "wait", "300"]);
}

async function flowWidgetSwitch() {
  console.log("Flow: Widget Switch");
  const url = `${BASE_URL}/harness`;

  await openUrl(url);
  await captureSnapshot("harness-widget-start");
  await takeScreenshot("harness-widget-start");
  await runAgentBrowser(["--session", SESSION_NAME, "find", "text", "Chat View", "click"]);
  await runAgentBrowser(["--session", SESSION_NAME, "wait", "500"]);
  await captureSnapshot("widget-chat-view");
  await takeScreenshot("widget-chat-view");

  await runAgentBrowser(["--session", SESSION_NAME, "find", "text", "Dashboard Widget", "click"]);
  await runAgentBrowser(["--session", SESSION_NAME, "wait", "500"]);
  await captureSnapshot("widget-dashboard");
  await takeScreenshot("widget-dashboard");
}

async function flowTemplateList() {
  console.log("Flow: Template List");
  const url = `${BASE_URL}/templates`;

  await openUrl(url);
  await captureSnapshot("templates-list");
  await takeScreenshot("templates-list");
}

async function flowTemplateDetail() {
  console.log("Flow: Template Detail");
  const url = `${BASE_URL}/templates/template-shell`;

  await openUrl(url);
  await captureSnapshot("template-detail");
  await takeScreenshot("template-detail");
}

async function main() {
  console.log("Starting agent-browser smoke tests");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Results: ${RESULTS_DIR}`);
  console.log("");

  const flows = [
    { name: "ChatShell", fn: flowChatShell },
    { name: "Harness Modal", fn: flowHarnessModal },
    { name: "Widget Switch", fn: flowWidgetSwitch },
    { name: "Template List", fn: flowTemplateList },
    { name: "Template Detail", fn: flowTemplateDetail },
  ];

  let passed = 0;
  let failed = 0;

  for (const flow of flows) {
    try {
      await runFlowWithRetries(flow.name, flow.fn);
      passed += 1;
      console.log(`PASS: ${flow.name}`);
    } catch (error) {
      failed += 1;
      console.error(`FAIL: ${flow.name}`);
      console.error(`Error: ${error.message}`);
    }
  }

  console.log("");
  console.log(`Results: ${passed}/${flows.length} passed`);

  if (failed > 0) {
    console.error(`${failed} flow(s) failed`);
    process.exit(1);
  }

  console.log("All smoke tests passed");
  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
