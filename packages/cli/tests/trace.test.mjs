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

test("doctor --json includes trace IDs", async () => {
  const { code, stdout } = await runCli(["doctor", "--json"]);
  assert.equal(code, 0);
  const payload = JSON.parse(stdout);
  assert.equal(payload.schema, "astudio.command.v1");
  assert.equal(typeof payload.meta.request_id, "string");
  assert.equal(typeof payload.meta.trace_id, "string");
  assert.equal(payload.meta.request_id.length, 16);
  assert.equal(payload.meta.trace_id.length, 32);
  assert.ok(/^[0-9a-f]+$/.test(payload.meta.request_id), "request_id should be hex");
  assert.ok(/^[0-9a-f]+$/.test(payload.meta.trace_id), "trace_id should be hex");
});

test("traceparent env var is propagated", async () => {
  const traceId = "4bf92f3577b34da6a3ce929d0e0e4736";
  const parentId = "00f067aa0ba902b7";
  const traceparent = `00-${traceId}-${parentId}-01`;

  const { code, stdout } = await runCli(["doctor", "--json"], { TRACEPARENT: traceparent });
  assert.equal(code, 0);
  const payload = JSON.parse(stdout);
  assert.equal(payload.meta.trace_id, traceId);
  assert.equal(payload.meta.parent_id, parentId);
});

test("ASTUDIO_TRACE_ID env var is used", async () => {
  const traceId = "abc123def45678901234567890123456";

  const { code, stdout } = await runCli(["doctor", "--json"], { ASTUDIO_TRACE_ID: traceId });
  assert.equal(code, 0);
  const payload = JSON.parse(stdout);
  assert.equal(payload.meta.trace_id, traceId.replace(/-/g, "").toLowerCase());
});

test("error response includes trace IDs", async () => {
  const { code, stdout } = await runCli(["tokens", "generate", "--json"]);
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(typeof payload.meta.request_id, "string");
  assert.equal(typeof payload.meta.trace_id, "string");
});
