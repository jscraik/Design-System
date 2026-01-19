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
import { dirname, join } from "node:path";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");

const BASE_URL = process.env.AGENT_BROWSER_BASE_URL || "http://127.0.0.1:5173";
const SESSION_NAME = "astudio-smoke";
const RESULTS_DIR =
  process.env.AGENT_BROWSER_RESULTS_DIR || join(rootDir, "test-results", "agent-browser");
const SCREENSHOTS_DIR = join(RESULTS_DIR, "screenshots");
const SNAPSHOTS_DIR = join(RESULTS_DIR, "snapshots");

[RESULTS_DIR, SCREENSHOTS_DIR, SNAPSHOTS_DIR].forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

const cliPath = existsSync(join(rootDir, "node_modules", ".bin", "agent-browser"))
  ? join(rootDir, "node_modules", ".bin", "agent-browser")
  : "agent-browser";

function runAgentBrowser(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cliPath, args, {
      stdio: ["ignore", "pipe", "pipe"],
      cwd: rootDir,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(
          new Error(
            `agent-browser exited with code ${code}\nstdout: ${stdout}\nstderr: ${stderr}`,
          ),
        );
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to spawn agent-browser: ${err.message}`));
    });
  });
}

async function openUrl(url) {
  await runAgentBrowser(["--session", SESSION_NAME, "open", url]);
  await runAgentBrowser(["--session", SESSION_NAME, "wait", "500"]);
}

async function captureSnapshot(name) {
  const { stdout } = await runAgentBrowser([
    "--session",
    SESSION_NAME,
    "snapshot",
    "-i",
    "--json",
  ]);

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
  const sendButtonRef = selectRef(
    data?.data?.refs,
    (ref) => ref?.role === "button" && ref?.name && /send|submit/i.test(ref.name),
  );

  requireRef(textboxRef, "Textbox not found on ChatShell");
  requireRef(sendButtonRef, "Send button not found on ChatShell");

  await runAgentBrowser(["--session", SESSION_NAME, "fill", `@${textboxRef}`, "Smoke test message"]);
  await runAgentBrowser(["--session", SESSION_NAME, "click", `@${sendButtonRef}`]);
  await runAgentBrowser(["--session", SESSION_NAME, "wait", "500"]);
  await captureSnapshot("chatshell-after-send");
  await takeScreenshot("chatshell");
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

  await runAgentBrowser([
    "--session",
    SESSION_NAME,
    "find",
    "text",
    "Dashboard Widget",
    "click",
  ]);
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
      await flow.fn();
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
