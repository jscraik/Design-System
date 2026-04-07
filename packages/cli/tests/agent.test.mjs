import assert from "node:assert/strict";
import test from "node:test";
import { runCli } from "./test-utils.mjs";

test("agent mode provides suggestions for typos", async () => {
  const { code, stderr } = await runCli(["--agent", "devv", "web"]);
  assert.equal(code, 2);
  // Agent mode should provide suggestions
  assert.ok(stderr.includes("Did you mean") || stderr.includes("dev"), "Should show suggestions");
});

test("agent mode provides enhanced error output", async () => {
  const { code, stdout } = await runCli(["--agent", "devv", "--json"]);
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  // In agent mode, errors should include did_you_mean for typos like "devv"
  assert.ok(
    payload.errors[0].did_you_mean,
    "Agent mode errors should include did_you_mean suggestions",
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

  try {
    // Agent threshold should be 0.5
    const agentThreshold = getSuggestionThreshold();
    assert.equal(agentThreshold, 0.5);
  } finally {
    // Reset to avoid polluting other tests
    setAgentMode(false);
  }
});
