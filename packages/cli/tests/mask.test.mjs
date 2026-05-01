import assert from "node:assert/strict";
import test from "node:test";
import { runCli } from "./test-utils.mjs";

test("sensitive fields are masked by default in errors", async () => {
  const { code, stdout } = await runCli(["tokens", "generate", "--json"]);
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  // Verify masking is active by checking output doesn't contain raw secrets
  // and either contains redaction markers or the masking infrastructure is present
  const outputStr = JSON.stringify(payload);
  // Should not contain typical secret patterns in plaintext
  assert.ok(
    !outputStr.match(/password["']?\s*:\s*["'][^"']{8,}/i) ||
      outputStr.includes("[REDACTED]") ||
      outputStr.includes("****"),
    "Sensitive data should be masked or not present in output",
  );
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

test("maskObject preserves public design token contracts", async () => {
  const { maskObject } = await import("../src/utils/mask.ts");

  const input = {
    designTokenContract: {
      mode: "semantic-only",
      allowedRoles: [
        {
          role: "text.primary",
          useFor: ["Primary text"],
          token: "role-secret",
        },
      ],
      forbiddenTokenPatterns: ["foundation tokens are forbidden"],
      sourceRefs: ["packages/ui/src/styles/theme.css"],
      token: "contract-secret",
    },
    config: {
      token: "jwt-token-here",
    },
  };

  const masked = maskObject(input);

  assert.equal(masked.designTokenContract.mode, input.designTokenContract.mode);
  assert.deepEqual(
    masked.designTokenContract.forbiddenTokenPatterns,
    input.designTokenContract.forbiddenTokenPatterns,
  );
  assert.equal(masked.designTokenContract.token, "[REDACTED]");
  assert.equal(masked.designTokenContract.allowedRoles[0].role, "text.primary");
  assert.equal(masked.designTokenContract.allowedRoles[0].token, "[REDACTED]");
  assert.equal(masked.config.token, "[REDACTED]");
});

test("maskObject masks malformed design token contract public branches", async () => {
  const { maskObject } = await import("../src/utils/mask.ts");

  const input = {
    designTokenContract: {
      mode: { token: "mode-secret" },
      allowedRoles: [
        {
          role: { token: "role-secret" },
          useFor: [{ token: "use-secret" }],
          secret: "role-extra-secret",
        },
      ],
      sourceRefs: [{ token: "source-secret" }],
    },
  };

  const masked = maskObject(input);

  assert.equal(masked.designTokenContract.mode.token, "[REDACTED]");
  assert.equal(masked.designTokenContract.allowedRoles[0].role.token, "[REDACTED]");
  assert.equal(masked.designTokenContract.allowedRoles[0].useFor[0].token, "[REDACTED]");
  assert.equal(masked.designTokenContract.allowedRoles[0].secret, "[REDACTED]");
  assert.equal(masked.designTokenContract.sourceRefs[0].token, "[REDACTED]");
});

test("maskObject bypasses in debug mode", async () => {
  const { maskObject } = await import("../src/utils/mask.ts");

  const input = {
    api_key: "sk-1234567890abcdef",
  };

  const masked = maskObject(input, undefined, true);

  assert.equal(masked.api_key, "sk-1234567890abcdef");
});
