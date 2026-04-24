import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parseDesignContract } from "@brainwav/agent-design-engine";
import {
  DESIGN_COMPATIBILITY_MANIFEST,
  supportedDesignProfileIds,
} from "@brainwav/design-system-guidance";
import Ajv from "ajv";
import { pkgRoot, runCli } from "./test-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.resolve(__dirname, "fixtures");
const repoRoot = path.resolve(pkgRoot, "../..");
const designCommandFixtures = JSON.parse(
  fs.readFileSync(path.join(fixturesDir, "design-command-fixtures.json"), "utf8"),
);
const designCommandEnvelopeSchema = JSON.parse(
  fs.readFileSync(
    path.join(fixturesDir, "design-schemas", "astudio-design-command.v1.schema.json"),
    "utf8",
  ),
);
const ajv = new Ajv({ strict: true, allErrors: true });
const validateDesignCommandEnvelope = ajv.compile(designCommandEnvelopeSchema);

function writeValidDesignContract(targetDir) {
  fs.mkdirSync(path.join(targetDir, "docs", "design-system"), { recursive: true });
  fs.writeFileSync(
    path.join(targetDir, "DESIGN.md"),
    `---
schemaVersion: agent-design.v1
brandProfile: astudio-default@1
---
# Temp Surface

## Surface Roles

The shell surface owns dynamic viewport and safe-area layout. Sections, rows, state surfaces, and accents have explicit surface responsibilities.

## State Model

Loading, empty, and error states are visible and recoverable.

## Focus Contract

Focus affordances are scoped to the owning component.

## Motion Contract

Motion is compositor-only with reduced-motion fallback.

## Component Routing

Check docs/design-system/COMPONENT_LIFECYCLE.json and docs/design-system/COVERAGE_MATRIX.json before adding components.
`,
  );
  fs.writeFileSync(
    path.join(targetDir, "docs", "design-system", "PROFESSIONAL_UI_CONTRACT.md"),
    "# Professional UI Contract\n",
  );
  fs.writeFileSync(
    path.join(targetDir, "docs", "design-system", "AGENT_UI_ROUTING.md"),
    "# Agent UI Routing\n",
  );
  fs.writeFileSync(
    path.join(targetDir, "docs", "design-system", "COMPONENT_LIFECYCLE.json"),
    "{}\n",
  );
  fs.writeFileSync(path.join(targetDir, "docs", "design-system", "COVERAGE_MATRIX.json"), "{}\n");
}

function writeGuidanceConfig(
  targetDir,
  config = { schemaVersion: 1, docs: ["docs/design-system/CONTRACT.md"] },
) {
  fs.writeFileSync(path.join(targetDir, ".design-system-guidance.json"), jsonLine(config));
}

function writeValidDesignProject(targetDir) {
  writeValidDesignContract(targetDir);
  writeGuidanceConfig(targetDir);
}

function writeUnknownProfileProject(targetDir) {
  writeValidDesignProject(targetDir);
  const designPath = path.join(targetDir, "DESIGN.md");
  fs.writeFileSync(
    designPath,
    fs
      .readFileSync(designPath, "utf8")
      .replace("brandProfile: astudio-default@1", "brandProfile: unknown-brand@1"),
  );
}

function makeFixtureContext(fixture) {
  const context = {
    $REPO_ROOT: repoRoot,
  };
  const encodedFixture = JSON.stringify(fixture);
  if (encodedFixture.includes("$TEMP_VALID_DESIGN_PROJECT")) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-design-fixture-"));
    writeValidDesignProject(tempDir);
    context.$TEMP_VALID_DESIGN_PROJECT = tempDir;
  }
  if (encodedFixture.includes("$TEMP_UNKNOWN_PROFILE_PROJECT")) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-profile-fixture-"));
    writeUnknownProfileProject(tempDir);
    context.$TEMP_UNKNOWN_PROFILE_PROJECT = tempDir;
  }
  return context;
}

function jsonLine(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, jsonLine(value));
}

function guidanceConfigPath(targetDir) {
  return path.join(targetDir, ".design-system-guidance.json");
}

function rollbackMetadataPath(targetDir) {
  const config = readJsonFile(guidanceConfigPath(targetDir));
  return path.join(targetDir, config.designContract.rollbackMetadata);
}

function resolveFixtureString(value, context) {
  return Object.entries(context).reduce(
    (resolved, [placeholder, replacement]) => resolved.split(placeholder).join(replacement),
    value,
  );
}

function resolveFixtureValue(value, context) {
  if (typeof value === "string") return resolveFixtureString(value, context);
  if (Array.isArray(value)) return value.map((entry) => resolveFixtureValue(entry, context));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, resolveFixtureValue(entry, context)]),
    );
  }
  return value;
}

function assertDesignCommandEnvelope(payload, fixtureName) {
  if (validateDesignCommandEnvelope(payload)) return;
  assert.fail(
    `${fixtureName} did not match design command schema:\n${ajv.errorsText(
      validateDesignCommandEnvelope.errors,
      { separator: "\n" },
    )}`,
  );
}

function assertJsonByteContract(result, fixtureName) {
  const expected = designCommandFixtures.stdout;
  assert.equal(result.stderr, expected.stderr, `${fixtureName} wrote unexpected stderr`);
  assert.equal(
    result.stdout.endsWith("\n"),
    expected.trailingNewline,
    `${fixtureName} trailing newline contract changed`,
  );
  assert.equal(
    Buffer.from(result.stdout, expected.encoding).toString(expected.encoding),
    result.stdout,
  );
  assert.equal(
    result.stdout.trimEnd().split("\n").length,
    expected.lineCount,
    `${fixtureName} emitted more than one JSON line`,
  );
}

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

test("design command JSON fixtures match the schema and byte contract", async (t) => {
  for (const fixture of designCommandFixtures.success) {
    await t.test(fixture.name, async () => {
      const context = makeFixtureContext(fixture);
      const args = resolveFixtureValue(fixture.args, context);
      const cwd = resolveFixtureValue(fixture.cwd, context);
      const env = resolveFixtureValue(fixture.env ?? {}, context);
      const result = await runCli(args, env, { cwd });

      assert.equal(result.code, 0, `${fixture.name} failed: ${result.stdout}${result.stderr}`);
      assertJsonByteContract(result, fixture.name);
      const payload = JSON.parse(result.stdout);
      assertDesignCommandEnvelope(payload, fixture.name);
      assert.equal(payload.status, "success");
      assert.equal(payload.data.kind, fixture.kind);
      assert.equal(payload.meta.outputMode, "json");
    });
  }
});

test("design command error fixtures expose stable recovery payloads", async (t) => {
  for (const fixture of designCommandFixtures.errors) {
    await t.test(fixture.name, async () => {
      const context = makeFixtureContext(fixture);
      const args = resolveFixtureValue(fixture.args, context);
      const cwd = resolveFixtureValue(fixture.cwd, context);
      const env = resolveFixtureValue(fixture.env ?? {}, context);
      const result = await runCli(args, env, { cwd });

      assert.equal(result.code, fixture.expectedExitCode);
      assertJsonByteContract(result, fixture.name);
      const payload = JSON.parse(result.stdout);
      assertDesignCommandEnvelope(payload, fixture.name);
      assert.equal(payload.status, "error");
      assert.equal(payload.errors[0].code, fixture.expectedErrorCode);
      const recovery = payload.errors[0].recovery;

      if (fixture.recovery === "nextCommand") {
        assert.ok(recovery.nextCommand);
        assert.equal(recovery.nextCommand.argv[0], "astudio");
        assert.ok(Array.isArray(recovery.nextCommand.argv));
        assert.equal(typeof recovery.nextCommand.cwd, "string");
        assert.equal(Object.hasOwn(recovery.nextCommand, "command"), false);
      } else if (fixture.recovery === "unavailable") {
        assert.equal(typeof recovery.recoveryUnavailableReason, "string");
        assert.equal(Object.hasOwn(recovery, "nextCommand"), false);
      } else {
        assert.equal(recovery, undefined);
      }
    });
  }
});

test("policy error returns E_POLICY and exit code 3", async () => {
  const { code, stdout } = await runCli(["tokens", "generate", "--json"]);
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_POLICY");
});

test("design lint --json emits design envelope", async () => {
  const { code, stdout, stderr } = await runCli([
    "design",
    "lint",
    "--file",
    "../../DESIGN.md",
    "--json",
  ]);
  assert.equal(code, 0);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.schema, "astudio.command.v1");
  assert.equal(payload.meta.outputMode, "json");
  assert.equal(payload.data.kind, "astudio.design.lint.v1");
  assert.equal(payload.data.ok, true);
  assert.equal(payload.data.resolvedProfile, "astudio-default@1");
  assert.equal(payload.data.profileSource, "design-frontmatter");
  assert.equal(payload.data.rulePackVersion, "astudio-professional-ui@1");
  assert.ok(Array.isArray(payload.data.ruleSourceDigests));
  assert.equal(payload.data.contract.provenance.rulePackVersion, "astudio-professional-ui@1");
});

test("guidance-supported profiles stay accepted by the design engine", async () => {
  const profileIds = supportedDesignProfileIds();
  assert.deepEqual(
    DESIGN_COMPATIBILITY_MANIFEST.supportedProfiles.map((profile) => profile.id).sort(),
    [...profileIds].sort(),
  );

  const markdown = fs.readFileSync(path.join(repoRoot, "DESIGN.md"), "utf8");
  for (const profileId of profileIds) {
    const contract = await parseDesignContract(
      markdown.replace(/brandProfile:\s*\S+/, `brandProfile: ${profileId}`),
      { rootDir: repoRoot, filePath: path.join(repoRoot, "DESIGN.md") },
    );
    assert.equal(contract.resolvedProfile, profileId);
  }
});

test("design lint resolves --file relative to --cwd", async () => {
  const { code, stdout, stderr } = await runCli([
    "--cwd",
    repoRoot,
    "design",
    "lint",
    "--file",
    "DESIGN.md",
    "--json",
  ]);
  assert.equal(code, 0);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.resolvedDesignFile, path.join(repoRoot, "DESIGN.md"));
});

test("design diff --json exposes two-input protocol fields", async () => {
  const { code, stdout, stderr } = await runCli([
    "design",
    "diff",
    "--before",
    "../../DESIGN.md",
    "--after",
    "../../DESIGN.md",
    "--json",
  ]);
  assert.equal(code, 0);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.kind, "astudio.design.diff.v1");
  assert.equal(payload.data.beforeDesignSchemaVersion, "agent-design.v1");
  assert.equal(payload.data.afterDesignSchemaVersion, "agent-design.v1");
  assert.equal(payload.data.beforeRulePackVersion, "astudio-professional-ui@1");
  assert.equal(payload.data.afterRulePackVersion, "astudio-professional-ui@1");
  assert.equal(payload.data.brandProfileDelta.changed, false);
  assert.ok(Array.isArray(payload.data.beforeRuleSourceDigests));
  assert.ok(Array.isArray(payload.data.afterRuleSourceDigests));
});

test("design diff fails on regression in CI mode", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-design-diff-"));
  const before = path.join(tempDir, "before.DESIGN.md");
  const after = path.join(tempDir, "after.DESIGN.md");
  const markdown = fs.readFileSync(path.join(repoRoot, "DESIGN.md"), "utf8");
  fs.writeFileSync(before, markdown);
  fs.writeFileSync(
    after,
    markdown.replace("schemaVersion: agent-design.v1", "schemaVersion: agent-design.v2"),
  );

  const { code, stdout, stderr } = await runCli(
    ["design", "diff", "--before", before, "--after", after, "--json"],
    { CI: "1" },
    { cwd: repoRoot },
  );
  assert.equal(code, 1);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.kind, "astudio.design.diff.v1");
  assert.equal(payload.data.hasRegression, true);
});

test("design export accepts scope and preserves design tokens", async () => {
  const { code, stdout, stderr } = await runCli([
    "design",
    "export",
    "--scope",
    "root",
    "--format",
    "json@agent-design.v1",
    "--json",
  ]);
  assert.equal(code, 0);
  assert.equal(stderr, "");
  const lines = stdout.trim().split("\n");
  assert.equal(lines.length, 1);
  const payload = JSON.parse(lines[0]);
  assert.equal(payload.data.kind, "astudio.design.export.v1");
  assert.equal(payload.data.contract.tokens["--color-accent"], "#123456");
  assert.equal(payload.data.artifact.tokens["--color-accent"], "#123456");
});

test("design export rejects semantically invalid contracts", async () => {
  const { code, stdout } = await runCli([
    "design",
    "export",
    "--file",
    "../agent-design-engine/tests/fixtures/invalid-design.md",
    "--format",
    "json@agent-design.v1",
    "--json",
  ]);
  assert.equal(code, 1);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_SEMANTIC_FINDING");
});

test("design check-brand accepts scope without emitting usage noise", async () => {
  const { code, stdout, stderr } = await runCli([
    "design",
    "check-brand",
    "--scope",
    "root",
    "--json",
  ]);
  assert.equal(code, 0);
  assert.equal(stderr, "");
  assert.equal(stdout.trim().split("\n").length, 1);
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.kind, "astudio.design.checkBrand.v1");
  assert.equal(payload.data.resolvedDesignFile.endsWith("/DESIGN.md"), true);
});

test("CI=false does not force design commands into JSON mode", async () => {
  const { code, stdout, stderr } = await runCli(
    ["design", "lint", "--file", "../../DESIGN.md", "--plain"],
    { CI: "false" },
  );
  assert.equal(code, 0);
  assert.equal(stderr, "");
  assert.equal(stdout, "SUCCESS design lint\n");
});

test("CI design commands default to JSON when output mode is omitted", async () => {
  const { code, stdout, stderr } = await runCli(["design", "lint", "--file", "../../DESIGN.md"], {
    CI: "true",
  });
  assert.equal(code, 0);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.schema, "astudio.command.v1");
  assert.equal(payload.meta.outputMode, "json");
  assert.equal(payload.data.kind, "astudio.design.lint.v1");
});

test("agent design commands reject explicit plain output", async () => {
  const { code, stdout } = await runCli([
    "design",
    "lint",
    "--file",
    "../../DESIGN.md",
    "--agent",
    "--plain",
  ]);
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_POLICY");
  assert.equal(
    payload.errors[0].recovery.recoveryUnavailableReason,
    "The caller explicitly requested plain output in a machine-output context.",
  );
});

test("design doctor reports legacy mode when DESIGN.md is absent", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-no-design-"));
  const { code, stdout, stderr } = await runCli(
    ["design", "doctor", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 0);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.kind, "astudio.design.doctor.v1");
  assert.equal(payload.data.mode, "legacy");
  assert.equal(payload.data.resolvedDesignFile, null);
  assert.equal(payload.data.checks[0].status, "warn");
});

test("design doctor reads guidance state from the project root", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);
  fs.writeFileSync(path.join(tempDir, "pnpm-workspace.yaml"), "packages: []\n");
  const subdir = path.join(tempDir, "packages", "demo");
  fs.mkdirSync(subdir, { recursive: true });

  const { code, stdout, stderr } = await runCli(
    ["design", "doctor", "--json"],
    {},
    { cwd: subdir },
  );
  assert.equal(code, 0);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.resolvedDesignFile, path.join(fs.realpathSync(tempDir), "DESIGN.md"));
  assert.ok(payload.data.checks.some((check) => check.name === "guidance-config"));
});

test("design init requires explicit write when not dry-run", async () => {
  const { code, stdout } = await runCli(["design", "init", "--json"]);
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_POLICY");
  assert.deepEqual(payload.errors[0].recovery.nextCommand.argv.slice(0, 3), [
    "astudio",
    "design",
    "init",
  ]);
  assert.ok(payload.errors[0].recovery.nextCommand.argv.includes("--write"));
});

test("design init reports deterministic collision when DESIGN.md already exists", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-design-init-"));
  fs.writeFileSync(path.join(tempDir, "DESIGN.md"), "# Existing\n");
  const { code, stdout } = await runCli(
    ["design", "init", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_CONTRACT_EXISTS");
});

test("design init validates before writing", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-design-init-"));
  const { code, stdout } = await runCli(
    ["design", "init", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_SCHEMA_INVALID");
  assert.equal(fs.existsSync(path.join(tempDir, "DESIGN.md")), false);
});

test("design migrate requires explicit write when not dry-run", async () => {
  const { code, stdout } = await runCli(
    ["design", "migrate", "--to", "design-md", "--json"],
    {},
    { cwd: repoRoot },
  );
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_WRITE_REQUIRED");
});

test("design migrate resolves subdirectory invocations to the project root", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);
  fs.writeFileSync(path.join(tempDir, "pnpm-workspace.yaml"), "packages: []\n");
  const subdir = path.join(tempDir, "packages", "demo");
  fs.mkdirSync(subdir, { recursive: true });

  const { code, stdout } = await runCli(
    ["design", "migrate", "--to", "design-md", "--dry-run", "--json"],
    {},
    { cwd: subdir },
  );
  assert.equal(code, 0);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "success");
  assert.equal(
    payload.data.configPath,
    path.join(fs.realpathSync(tempDir), ".design-system-guidance.json"),
  );
});

test("design migrate validates DESIGN.md before migration", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  fs.writeFileSync(
    path.join(tempDir, ".design-system-guidance.json"),
    `${JSON.stringify({ schemaVersion: 1, docs: ["docs/design-system/CONTRACT.md"] }, null, 2)}\n`,
  );

  const { code, stdout } = await runCli(
    ["design", "migrate", "--to", "design-md", "--dry-run", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_CONTRACT_MISSING");
});

test("design migrate resume rejects non-resumable state", async () => {
  const { code, stdout } = await runCli(
    ["design", "migrate", "--resume", "--dry-run", "--json"],
    {},
    { cwd: repoRoot },
  );
  assert.equal(code, 1);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_MIGRATION_STATE_INVALID");
});

test("design migrate rollback requires readable metadata", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  fs.writeFileSync(
    path.join(tempDir, ".design-system-guidance.json"),
    `${JSON.stringify({ schemaVersion: 1, docs: ["docs/design-system/CONTRACT.md"] }, null, 2)}\n`,
  );

  const { code, stdout } = await runCli(
    ["design", "migrate", "--rollback", "--dry-run", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_ROLLBACK_METADATA_UNREADABLE");
});

test("design migrate rollback refuses corrupt metadata without mutating config", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  const metadataPath = path.join(tempDir, "artifacts", "design-migrations", "rollback.json");
  fs.mkdirSync(path.dirname(metadataPath), { recursive: true });
  fs.writeFileSync(metadataPath, "{}\n");
  const config = {
    schemaVersion: 2,
    docs: ["docs/design-system/CONTRACT.md"],
    designContract: {
      mode: "design-md",
      migrationState: "active",
      rollbackMetadata: "artifacts/design-migrations/rollback.json",
    },
  };
  fs.writeFileSync(
    path.join(tempDir, ".design-system-guidance.json"),
    `${JSON.stringify(config, null, 2)}\n`,
  );

  const { code, stdout } = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 3);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_ROLLBACK_METADATA_UNREADABLE");
  assert.deepEqual(
    JSON.parse(fs.readFileSync(path.join(tempDir, ".design-system-guidance.json"), "utf8")),
    config,
  );
});

test("design migrate refuses fresh migration from failed state", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  fs.writeFileSync(
    path.join(tempDir, ".design-system-guidance.json"),
    `${JSON.stringify(
      {
        schemaVersion: 2,
        docs: ["docs/design-system/CONTRACT.md"],
        designContract: {
          mode: "legacy",
          migrationState: "failed",
          rollbackMetadata: "artifacts/design-migrations/missing.json",
        },
      },
      null,
      2,
    )}\n`,
  );

  const { code, stdout } = await runCli(
    ["design", "migrate", "--to", "design-md", "--dry-run", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 1);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_MIGRATION_STATE_INVALID");
});

test("design migrate rejects unsupported guidance schema versions", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  fs.writeFileSync(
    path.join(tempDir, ".design-system-guidance.json"),
    `${JSON.stringify({ schemaVersion: 999, docs: ["docs/design-system/CONTRACT.md"] }, null, 2)}\n`,
  );

  const { code, stdout } = await runCli(
    ["design", "migrate", "--to", "design-md", "--dry-run", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_CONFIG_INVALID");
});

test("design migrate rejects unsupported guidance design modes", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  fs.writeFileSync(
    path.join(tempDir, ".design-system-guidance.json"),
    `${JSON.stringify(
      {
        schemaVersion: 2,
        docs: ["docs/design-system/CONTRACT.md"],
        designContract: {
          mode: "future-design-md",
          migrationState: "active",
        },
      },
      null,
      2,
    )}\n`,
  );

  const { code, stdout } = await runCli(
    ["design", "migrate", "--to", "design-md", "--dry-run", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_CONFIG_INVALID");
});

test("design migrate write requires a valid DESIGN.md first", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  fs.writeFileSync(
    path.join(tempDir, ".design-system-guidance.json"),
    `${JSON.stringify({ schemaVersion: 1, docs: ["docs/design-system/CONTRACT.md"] }, null, 2)}\n`,
  );

  const { code, stdout } = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_CONTRACT_MISSING");
});

test("CI design commands require explicit discovery", async () => {
  const { code, stdout } = await runCli(
    ["design", "lint", "--json"],
    { CI: "true" },
    { cwd: repoRoot },
  );
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_DISCOVERY_REQUIRED");
});

test("design discovery fails deterministically when contracts are ambiguous", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);
  fs.writeFileSync(path.join(tempDir, "pnpm-workspace.yaml"), "packages: []\n");
  const subdir = path.join(tempDir, "packages", "demo");
  fs.mkdirSync(subdir, { recursive: true });
  fs.copyFileSync(path.join(tempDir, "DESIGN.md"), path.join(subdir, "DESIGN.md"));

  const { code, stdout } = await runCli(["design", "lint", "--json"], {}, { cwd: subdir });
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_CONTRACT_AMBIGUOUS");
});

test("design diff fail-on-regression returns failure for schema regressions", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-design-diff-"));
  const beforePath = path.join(tempDir, "before.md");
  const afterPath = path.join(tempDir, "after.md");
  const before = fs.readFileSync(path.join(repoRoot, "DESIGN.md"), "utf8");
  fs.writeFileSync(beforePath, before);
  fs.writeFileSync(
    afterPath,
    before.replace("schemaVersion: agent-design.v1", "schemaVersion: agent-design.v2"),
  );

  const { code, stdout } = await runCli(
    [
      "design",
      "diff",
      "--before",
      beforePath,
      "--after",
      afterPath,
      "--fail-on-regression",
      "--json",
    ],
    {},
    { cwd: repoRoot },
  );
  assert.equal(code, 1);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "warn");
  assert.equal(payload.data.hasRegression, true);
});

test("design migrate stores rollback metadata as project-relative config", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const { code, stdout } = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(code, 0);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "success");
  assert.equal(path.isAbsolute(payload.data.rollbackMetadataPath), true);

  const config = JSON.parse(
    fs.readFileSync(path.join(tempDir, ".design-system-guidance.json"), "utf8"),
  );
  assert.equal(config.designContract.mode, "design-md");
  assert.equal(config.designContract.migrationState, "active");
  assert.equal(path.isAbsolute(config.designContract.rollbackMetadata), false);
});

test("design migrate rollback quarantines migrated DESIGN.md", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const migrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(migrate.code, 0);

  const rollback = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(rollback.code, 0);
  const payload = JSON.parse(rollback.stdout);
  assert.equal(payload.data.migrationState, "rolled-back");
  assert.equal(fs.existsSync(path.join(tempDir, "DESIGN.md")), false);
  assert.equal(typeof payload.data.quarantinePath, "string");
  assert.equal(fs.existsSync(payload.data.quarantinePath), true);
});

test("design migrate resume preserves original rollback metadata", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const migrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(migrate.code, 0);

  const metadataPath = rollbackMetadataPath(tempDir);
  const metadataBefore = fs.readFileSync(metadataPath, "utf8");
  const configPath = guidanceConfigPath(tempDir);
  const partialConfig = readJsonFile(configPath);
  partialConfig.designContract.migrationState = "partial";
  writeJsonFile(configPath, partialConfig);

  const resume = await runCli(
    ["design", "migrate", "--resume", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(resume.code, 0, `${resume.stdout}${resume.stderr}`);
  const payload = JSON.parse(resume.stdout);
  assert.equal(payload.data.migrationState, "active");
  assert.equal(fs.readFileSync(metadataPath, "utf8"), metadataBefore);
});

test("design migrate rollback preserves original rollback metadata", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const migrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(migrate.code, 0);

  const metadataPath = rollbackMetadataPath(tempDir);
  const metadataBefore = fs.readFileSync(metadataPath, "utf8");
  const rollback = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(rollback.code, 0, `${rollback.stdout}${rollback.stderr}`);
  assert.equal(fs.readFileSync(metadataPath, "utf8"), metadataBefore);
});

test("design migrate remigration allocates fresh rollback metadata after rollback", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const firstMigrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(firstMigrate.code, 0);
  const firstMetadataPath = rollbackMetadataPath(tempDir);

  const rollback = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(rollback.code, 0, `${rollback.stdout}${rollback.stderr}`);

  writeValidDesignContract(tempDir);
  const secondMigrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(secondMigrate.code, 0, `${secondMigrate.stdout}${secondMigrate.stderr}`);
  const secondMetadataPath = rollbackMetadataPath(tempDir);

  assert.notEqual(secondMetadataPath, firstMetadataPath);
  assert.equal(fs.existsSync(firstMetadataPath), true);
  assert.equal(fs.existsSync(secondMetadataPath), true);
});

test("design migrate refuses active migration lock without mutating config", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);
  const configPath = guidanceConfigPath(tempDir);
  const before = fs.readFileSync(configPath, "utf8");
  fs.writeFileSync(`${configPath}.migration.lock`, "stale-test-lock\n");

  const result = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(result.code, 3);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.errors[0].code, "E_DESIGN_MIGRATION_LOCKED");
  assert.equal(fs.readFileSync(configPath, "utf8"), before);
});

test("design migrate active repeat requires existing rollback metadata", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignContract(tempDir);
  writeGuidanceConfig(tempDir, {
    schemaVersion: 2,
    docs: ["docs/design-system/CONTRACT.md"],
    designContract: {
      mode: "design-md",
      migrationState: "active",
    },
  });
  const configPath = guidanceConfigPath(tempDir);
  const before = fs.readFileSync(configPath, "utf8");

  const result = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(result.code, 3);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.errors[0].code, "E_DESIGN_ROLLBACK_METADATA_UNREADABLE");
  assert.equal(fs.readFileSync(configPath, "utf8"), before);
});

test("design migrate concurrent writers leave parseable active state", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const results = await Promise.all([
    runCli(["design", "migrate", "--to", "design-md", "--write", "--json"], {}, { cwd: tempDir }),
    runCli(["design", "migrate", "--to", "design-md", "--write", "--json"], {}, { cwd: tempDir }),
  ]);

  assert.ok(results.some((result) => result.code === 0));
  for (const result of results) {
    if (result.code === 0) continue;
    const payload = JSON.parse(result.stdout);
    assert.equal(payload.errors[0].code, "E_DESIGN_MIGRATION_LOCKED");
  }

  const config = readJsonFile(guidanceConfigPath(tempDir));
  assert.equal(config.designContract.mode, "design-md");
  assert.equal(config.designContract.migrationState, "active");
  assert.equal(
    fs.readdirSync(tempDir).some((entry) => entry.includes(".tmp") || entry.endsWith(".lock")),
    false,
  );
});
