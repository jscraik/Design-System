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

test("--help-topic=safety shows safety help", async () => {
  const { code, stdout } = await runCli(["--help-topic=safety"]);
  assert.equal(code, 0);
  assert.ok(stdout.includes("Safety"), "Should show safety topic");
  assert.ok(stdout.includes("--exec"), "Should mention --exec flag");
});

test("--help-topic=output shows output help", async () => {
  const { code, stdout } = await runCli(["--help-topic=output"]);
  assert.equal(code, 0);
  assert.ok(stdout.includes("Output"), "Should show output topic");
  assert.ok(stdout.includes("--json"), "Should mention --json flag");
});

test("--help-topic=unknown shows error and list", async () => {
  const { code, stderr } = await runCli(["--help-topic=unknown"]);
  assert.equal(code, 2);
  assert.ok(stderr.includes("Unknown help topic"), "Should show error");
  assert.ok(stderr.includes("Available help topics"), "Should list topics");
});

test("--help=minimal shows minimal help", async () => {
  const { code, stdout } = await runCli(["--help=minimal"]);
  assert.equal(code, 0);
  assert.ok(stdout.includes("astudio"), "Should show astudio command");
  // Minimal help should be short
  assert.ok(stdout.length < 200, "Should be minimal length");
});

test("help-topics command lists topics", async () => {
  const { code, stdout } = await runCli(["help-topics"]);
  assert.equal(code, 0);
  assert.ok(stdout.includes("safety"), "Should list safety topic");
  assert.ok(stdout.includes("output"), "Should list output topic");
});

test("topic help includes examples", async () => {
  const { code, stdout } = await runCli(["--help-topic=safety"]);
  assert.equal(code, 0);
  assert.ok(stdout.includes("Examples:"), "Should include examples section");
  assert.ok(stdout.includes("astudio dev"), "Should include dev example");
});
