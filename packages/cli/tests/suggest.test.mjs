import assert from "node:assert/strict";
import test from "node:test";
import { suggestCommand, suggestFlag } from "../src/utils/suggest.ts";

test("suggestCommand finds close matches", async () => {
  const commands = ["dev", "build", "test", "lint"];

  const suggestion = suggestCommand("devv", commands);
  assert.ok(suggestion, "Should suggest for 'devv' typo");
  assert.equal(suggestion?.suggestion, "dev");
  assert.ok(suggestion?.confidence >= 0.75, "Should have high confidence");
});

test("suggestCommand returns undefined for poor matches", async () => {
  const commands = ["dev", "build", "test"];

  const suggestion = suggestCommand("xyz", commands);
  assert.equal(suggestion, undefined, "Should not suggest for unrelated input");
});

test("suggestFlag handles flag normalization", async () => {
  const flags = ["--help", "--version", "--json", "--exec"];

  const suggestion = suggestFlag("--jsoon", flags);
  assert.ok(suggestion, "Should suggest for '--jsoon' typo");
  assert.equal(suggestion?.suggestion, "--json");
});
