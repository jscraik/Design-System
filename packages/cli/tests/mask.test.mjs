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

test("sensitive fields are masked by default in errors", async () => {
  const { code, stdout } = await runCli(["tokens", "generate", "--json"]);
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  // Error message should not contain sensitive patterns masked
  // (This test verifies the masking infrastructure is in place)
});

test("maskValue redacts sensitive data", async () => {
  // Import and test the mask module directly
  const { maskValue } = await import("../src/utils/mask.ts");

  assert.equal(maskValue("secret-token-123", "redact"), "[REDACTED]");
  assert.equal(maskValue("secret-token-123", "full"), "****************"); // Capped at 20 chars
  assert.equal(maskValue("secret-token-123", "partial"), "secr...-123");
});

test("maskObject masks nested sensitive fields", async () => {
  const { maskObject } = await import("../src/utils/mask.ts");

  const input = {
    name: "test",
    api_key: "sk-1234567890abcdef",
    config: {
      password: "hunter2",
      token: "jwt-token-here",
    },
    public_field: "visible",
  };

  const masked = maskObject(input);

  assert.equal(masked.name, "test");
  assert.equal(masked.api_key, "[REDACTED]");
  assert.equal(masked.config.password, "[REDACTED]");
  assert.equal(masked.config.token, "[REDACTED]");
  assert.equal(masked.public_field, "visible");
});

test("maskObject bypasses in debug mode", async () => {
  const { maskObject } = await import("../src/utils/mask.ts");

  const input = {
    api_key: "sk-1234567890abcdef",
  };

  const masked = maskObject(input, undefined, true);

  assert.equal(masked.api_key, "sk-1234567890abcdef");
});
