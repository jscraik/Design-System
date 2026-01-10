import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const cliPath = path.resolve(pkgRoot, "src/index.ts");
const fixturesDir = path.resolve(__dirname, "fixtures");

const baseEnv = {
  ...process.env,
  NO_COLOR: "1",
  TERM: "dumb",
  COLUMNS: "80",
  LINES: "24",
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

test("help output matches snapshot", async () => {
  const { code, stdout, stderr } = await runCli(["--help"]);
  assert.equal(code, 0);
  const expected = fs.readFileSync(path.join(fixturesDir, "help.txt"), "utf8");
  assert.equal(stdout, expected);
  assert.equal(stderr, "");
});

test("dev help output matches snapshot", async () => {
  const { code, stdout, stderr } = await runCli(["dev", "--help"]);
  assert.equal(code, 0);
  const expected = fs.readFileSync(path.join(fixturesDir, "dev-help.txt"), "utf8");
  assert.equal(stdout, expected);
  assert.equal(stderr, "");
});

test("doctor --json emits valid envelope", async () => {
  const { code, stdout } = await runCli(["doctor", "--json"]);
  assert.equal(code, 0);
  const payload = JSON.parse(stdout);
  assert.equal(payload.schema, "astudio.command.v1");
  assert.equal(payload.meta.tool, "astudio");
  assert.equal(typeof payload.meta.version, "string");
  assert.ok(["success", "warn", "error"].includes(payload.status));
  assert.ok(Array.isArray(payload.errors));
  assert.ok(payload.data && typeof payload.data === "object");
});

test("policy error returns E_POLICY and exit code 3", async () => {
  const { code, stdout } = await runCli(["tokens", "generate", "--json"]);
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_POLICY");
});
