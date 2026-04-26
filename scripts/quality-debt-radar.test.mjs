import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = process.cwd();

function run(args, env = {}) {
  return spawnSync("node", ["scripts/quality-debt-radar.mjs", ...args], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, ...env },
  });
}

const check = run(["check"]);
assert.equal(check.status, 0, check.stderr || check.stdout);
assert.match(check.stdout, /quality-debt: contract ok/);

const plainCheck = run(["check", "--plain"]);
assert.equal(plainCheck.status, 0, plainCheck.stderr || plainCheck.stdout);
assert.match(plainCheck.stdout, /quality-debt: contract ok/);

const noColorCheck = run(["check", "--no-color"]);
assert.equal(noColorCheck.status, 0, noColorCheck.stderr || noColorCheck.stdout);
assert.match(noColorCheck.stdout, /quality-debt: contract ok/);

const tempDir = mkdtempSync(path.join(tmpdir(), "quality-debt-radar-"));
try {
  const output = path.join(tempDir, "quality-debt-burndown-2026-W17.md");
  const unsupportedProbeContract = path.join(tempDir, "unsupported-probe.json");
  const contract = JSON.parse(
    readFileSync(path.join(ROOT, "docs/operations/quality-debt-radar.categories.json"), "utf8"),
  );
  contract.categories[0] = { ...contract.categories[0], probe: "missing_probe" };
  writeFileSync(unsupportedProbeContract, JSON.stringify(contract, null, 2));

  const unsupportedProbeCheck = run(["check"], {
    QUALITY_DEBT_RADAR_CONTRACT_PATH: unsupportedProbeContract,
  });
  assert.equal(
    unsupportedProbeCheck.status,
    1,
    unsupportedProbeCheck.stderr || unsupportedProbeCheck.stdout,
  );
  assert.match(unsupportedProbeCheck.stderr, /uses unsupported probe: missing_probe/);

  const impossibleDate = run(["report", "--date", "2026-02-31", "--output", output]);
  assert.equal(impossibleDate.status, 1, impossibleDate.stderr || impossibleDate.stdout);
  assert.match(impossibleDate.stderr, /Invalid --date value: 2026-02-31/);

  const impossibleWeek = run(["report", "--week", "2026-W99", "--output", output]);
  assert.equal(impossibleWeek.status, 1, impossibleWeek.stderr || impossibleWeek.stdout);
  assert.match(impossibleWeek.stderr, /Invalid --week value: 2026-W99/);

  const report = run(["report", "--date", "2026-04-26", "--week", "2026-W17", "--output", output]);
  assert.equal(report.status, 0, report.stderr || report.stdout);
  const body = readFileSync(output, "utf8");
  assert.match(body, /# Quality Debt Burn-down/);
  assert.match(body, /Lint suppressions/);
  assert.match(body, /\d+ disabled linter rules/);
  if (body.includes("override-scoped")) {
    assert.match(body, /\d+ override-scoped disable/);
  }
  assert.match(body, /Fresh|Stale|Unavailable/);
  assert.match(body, /Warn-first mode/);
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

console.log("quality-debt-radar.test: ok");
