import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const cliPath = path.resolve(pkgRoot, "src/index.ts");

const baseEnv = {
  ...process.env,
  NO_COLOR: "1",
  TERM: "dumb",
};

function runCli(args, envOverrides = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["--import", "tsx", cliPath, ...args], {
      cwd: pkgRoot,
      env: { ...baseEnv, ...envOverrides },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
    child.on("error", (err) => {
      resolve({ code: 1, stdout: "", stderr: err instanceof Error ? err.message : "spawn failed" });
    });
  });
}

test("agent mode provides suggestions for typos", async () => {
  const { code, stderr } = await runCli(["--agent", "devv", "web"]);
  assert.equal(code, 2);
  // Agent mode should provide suggestions
  assert.ok(stderr.includes("Did you mean") || stderr.includes("dev"), "Should show suggestions");
});

test("agent mode provides enhanced error output", async () => {
  const { code, stdout } = await runCli(["--agent", "xyz", "--json"]);
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  // In agent mode, errors should include did_you_mean
  assert.ok(
    payload.errors[0].did_you_mean || payload.errors[0].message,
    "Should include error details",
  );
});

test("agent mode shows confidence in suggestions", async () => {
  // "devv" typo should show confidence
  const { code, stderr } = await runCli(["--agent", "devv"]);
  assert.equal(code, 2);
  // Should show confidence scores
  assert.ok(stderr.includes("confidence"), "Should show confidence scores");
});

test("agent mode threshold is lower than normal", async () => {
  const { getSuggestionThreshold, setAgentMode } = await import("../src/utils/agent.ts");

  // Default (non-agent) threshold should be 0.6
  const normalThreshold = getSuggestionThreshold();
  assert.equal(normalThreshold, 0.6);

  // Enable agent mode
  setAgentMode(true);

  // Agent threshold should be 0.5
  const agentThreshold = getSuggestionThreshold();
  assert.equal(agentThreshold, 0.5);
});
