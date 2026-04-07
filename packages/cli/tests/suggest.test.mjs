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

test("suggestCommand finds close matches", async () => {
  const { suggestCommand } = await import("../src/utils/suggest.ts");

  // "devv" should suggest "dev"
  const devvResult = suggestCommand("devv", ["dev", "build", "test"]);
  assert.ok(devvResult);
  assert.equal(devvResult.suggestion, "dev");
  assert.ok(devvResult.confidence > 0.6);

  // "bulid" should suggest "build"
  const buildResult = suggestCommand("bulid", ["dev", "build", "test"]);
  assert.ok(buildResult);
  assert.equal(buildResult.suggestion, "build");
  assert.ok(buildResult.confidence > 0.5); // bulid->build has lower confidence
});

test("suggestCommand returns undefined for poor matches", async () => {
  const { suggestCommand } = await import("../src/utils/suggest.ts");

  const result = suggestCommand("xyz", ["dev", "build", "test"]);
  assert.equal(result, undefined);
});

test("suggestFlag handles flag normalization", async () => {
  const { suggestFlag } = await import("../src/utils/suggest.ts");

  const result = suggestFlag("--jsonn", ["--json", "--plain", "--verbose"]);
  assert.ok(result);
  assert.equal(result.suggestion, "--json");
  assert.equal(result.type, "flag");
});

test("typo in command suggests correction --json", async () => {
  const { code, stdout } = await runCli(["devv", "--json"]);
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.ok(payload.errors[0].did_you_mean);
  assert.ok(payload.errors[0].did_you_mean.length > 0);
  assert.equal(payload.errors[0].did_you_mean[0].suggestion, "dev");
});

test("policy error includes fix_suggestion --json", async () => {
  const { code, stdout } = await runCli(["tokens", "generate", "--json"]);
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.ok(payload.errors[0].fix_suggestion);
  assert.ok(payload.errors[0].fix_suggestion.includes("--write"));
});
