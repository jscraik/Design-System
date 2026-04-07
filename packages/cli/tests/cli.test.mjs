import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { pkgRoot, runCli } from "./test-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.resolve(__dirname, "fixtures");

// Extend baseEnv with terminal dimensions for consistent snapshots
const snapshotEnv = {
  COLUMNS: "80",
  LINES: "24",
};

test("help output matches snapshot", async () => {
  const { code, stdout, stderr } = await runCli(["--help"], snapshotEnv);
  assert.equal(code, 0);
  const expected = fs.readFileSync(path.join(fixturesDir, "help.txt"), "utf8");
  assert.equal(stdout, expected);
  assert.equal(stderr, "");
});

test("dev help output matches snapshot", async () => {
  const { code, stdout, stderr } = await runCli(["dev", "--help"], snapshotEnv);
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
