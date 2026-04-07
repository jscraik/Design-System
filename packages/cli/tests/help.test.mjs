import assert from "node:assert/strict";
import test from "node:test";
import { runCli } from "./test-utils.mjs";

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
  const { stdout: fullStdout } = await runCli(["--help"]);
  assert.equal(code, 0);
  assert.ok(stdout.includes("astudio"), "Should show astudio command");
  // Minimal help should be significantly shorter than full help
  assert.ok(stdout.length < fullStdout.length, "Should be shorter than full help");
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
