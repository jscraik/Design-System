import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
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

function writeUnsupportedProfileProject(targetDir) {
  writeValidDesignProject(targetDir);
  const designPath = path.join(targetDir, "DESIGN.md");
  fs.writeFileSync(
    designPath,
    fs
      .readFileSync(designPath, "utf8")
      .replace("brandProfile: astudio-default@1", "brandProfile: astudio-default@2"),
  );
}

function writeInvalidSchemaProject(targetDir) {
  writeValidDesignProject(targetDir);
  const designPath = path.join(targetDir, "DESIGN.md");
  fs.writeFileSync(
    designPath,
    fs
      .readFileSync(designPath, "utf8")
      .replace("schemaVersion: agent-design.v1", "schemaVersion: agent-design.v2"),
  );
}

function writeAmbiguousDesignProject(targetDir) {
  writeValidDesignProject(targetDir);
  fs.mkdirSync(path.join(targetDir, "packages", "web"), { recursive: true });
  fs.writeFileSync(path.join(targetDir, "pnpm-workspace.yaml"), "packages:\n  - packages/*\n");
  fs.copyFileSync(
    path.join(targetDir, "DESIGN.md"),
    path.join(targetDir, "packages", "web", "DESIGN.md"),
  );
}

function writeInvalidGuidanceProject(targetDir) {
  writeValidDesignProject(targetDir);
  writeGuidanceConfig(targetDir, { schemaVersion: 999 });
}

function writeRollbackMetadataMissingProject(targetDir) {
  writeValidDesignProject(targetDir);
  writeGuidanceConfig(targetDir, {
    schemaVersion: 2,
    docs: ["docs/design-system/CONTRACT.md"],
    designContract: {
      mode: "design-md",
      migrationState: "active",
      rollbackMetadata: "artifacts/design-migrations/missing-guidance-rollback.json",
    },
  });
}

function writeFailedMigrationProject(targetDir) {
  writeValidDesignProject(targetDir);
  writeGuidanceConfig(targetDir, {
    schemaVersion: 2,
    docs: ["docs/design-system/CONTRACT.md"],
    designContract: {
      mode: "legacy",
      migrationState: "failed",
      rollbackMetadata: "artifacts/design-migrations/missing.json",
    },
  });
}

function makeFixtureContext(fixture) {
  const context = {
    $REPO_ROOT: repoRoot,
  };
  const encodedFixture = JSON.stringify(fixture);
  if (encodedFixture.includes("$TEMP_NO_DESIGN_PROJECT")) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-no-design-fixture-"));
    context.$TEMP_NO_DESIGN_PROJECT = tempDir;
  }
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
  if (encodedFixture.includes("$TEMP_UNSUPPORTED_PROFILE_PROJECT")) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-unsupported-profile-fixture-"));
    writeUnsupportedProfileProject(tempDir);
    context.$TEMP_UNSUPPORTED_PROFILE_PROJECT = tempDir;
  }
  if (encodedFixture.includes("$TEMP_INVALID_SCHEMA_PROJECT")) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-invalid-schema-fixture-"));
    writeInvalidSchemaProject(tempDir);
    context.$TEMP_INVALID_SCHEMA_PROJECT = tempDir;
  }
  if (
    encodedFixture.includes("$TEMP_AMBIGUOUS_DESIGN_PROJECT") ||
    encodedFixture.includes("$TEMP_AMBIGUOUS_DESIGN_SUBDIR")
  ) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-ambiguous-design-fixture-"));
    writeAmbiguousDesignProject(tempDir);
    context.$TEMP_AMBIGUOUS_DESIGN_PROJECT = tempDir;
    context.$TEMP_AMBIGUOUS_DESIGN_SUBDIR = path.join(tempDir, "packages", "web");
  }
  if (encodedFixture.includes("$TEMP_INVALID_GUIDANCE_PROJECT")) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-invalid-guidance-fixture-"));
    writeInvalidGuidanceProject(tempDir);
    context.$TEMP_INVALID_GUIDANCE_PROJECT = tempDir;
  }
  if (encodedFixture.includes("$TEMP_ROLLBACK_METADATA_MISSING_PROJECT")) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-rollback-missing-fixture-"));
    writeRollbackMetadataMissingProject(tempDir);
    context.$TEMP_ROLLBACK_METADATA_MISSING_PROJECT = tempDir;
  }
  if (encodedFixture.includes("$TEMP_FAILED_MIGRATION_PROJECT")) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-failed-migration-fixture-"));
    writeFailedMigrationProject(tempDir);
    context.$TEMP_FAILED_MIGRATION_PROJECT = tempDir;
  }
  if (encodedFixture.includes("$FAKE_PNPM_EXIT_7")) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-fake-pnpm-"));
    context.$FAKE_PNPM_EXIT_7 = writeExecutableScript(tempDir, "pnpm-exit-7", "exit 7");
  }
  return context;
}

function jsonLine(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalJson(entry)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function checksum(value) {
  return createHash("sha256").update(value).digest("hex");
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, jsonLine(value));
}

function writeExecutableScript(targetDir, name, body) {
  const scriptPath = path.join(targetDir, name);
  fs.writeFileSync(scriptPath, `#!/bin/sh\n${body}\n`);
  fs.chmodSync(scriptPath, 0o755);
  return scriptPath;
}

function guidanceConfigPath(targetDir) {
  return path.join(targetDir, ".design-system-guidance.json");
}

function rollbackMetadataPath(targetDir) {
  const config = readJsonFile(guidanceConfigPath(targetDir));
  return path.join(targetDir, config.designContract.rollbackMetadata);
}

function rollbackMetadata(targetDir) {
  return readJsonFile(rollbackMetadataPath(targetDir));
}

function migrationArtifactDir(targetDir) {
  return path.join(targetDir, "artifacts", "design-migrations");
}

function listFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    return entry.isDirectory() ? listFilesRecursive(filePath) : [filePath];
  });
}

function quarantineFiles(targetDir) {
  return listFilesRecursive(migrationArtifactDir(targetDir)).filter((filePath) =>
    /-DESIGN(?:-\d+)?\.md$/.test(path.basename(filePath)),
  );
}

function rollbackMetadataFiles(targetDir) {
  return listFilesRecursive(migrationArtifactDir(targetDir)).filter((filePath) =>
    filePath.endsWith("-guidance-rollback.json"),
  );
}

function migrationScratchFiles(targetDir) {
  return listFilesRecursive(targetDir).filter((filePath) => {
    const entry = path.basename(filePath);
    return entry.includes(".tmp") || entry.endsWith(".lock");
  });
}

function assertNoMigrationScratchFiles(targetDir) {
  assert.deepEqual(migrationScratchFiles(targetDir), []);
}

function stripRollbackSignature(metadata) {
  const {
    metadataDigest: _metadataDigest,
    metadataSignature: _metadataSignature,
    ...unsigned
  } = metadata;
  return unsigned;
}

function publicManifestRollbackSignature(metadataDigest) {
  return `hmac-sha256:${checksum(
    [
      metadataDigest,
      DESIGN_COMPATIBILITY_MANIFEST.schema,
      DESIGN_COMPATIBILITY_MANIFEST.wrapperVersion,
      DESIGN_COMPATIBILITY_MANIFEST.parityBaseline.commit,
    ].join(":"),
  )}`;
}

function localRollbackSignature(metadataDigest, signingKey) {
  return `hmac-sha256:${createHmac("sha256", signingKey)
    .update(
      [
        metadataDigest,
        DESIGN_COMPATIBILITY_MANIFEST.schema,
        DESIGN_COMPATIBILITY_MANIFEST.wrapperVersion,
        DESIGN_COMPATIBILITY_MANIFEST.parityBaseline.commit,
      ].join(":"),
    )
    .digest("hex")}`;
}

function resignRollbackMetadata(metadata) {
  const signingKey = fs
    .readFileSync(path.join(metadata.rollbackArtifactDir, ".rollback-metadata-signing-key"), "utf8")
    .trim();
  metadata.metadataDigest = checksum(canonicalJson(stripRollbackSignature(metadata)));
  metadata.metadataSignature = localRollbackSignature(metadata.metadataDigest, signingKey);
  return metadata;
}

async function assertRollbackFailsWithoutMutation(mutateProject) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const migrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(migrate.code, 0, `${migrate.stdout}${migrate.stderr}`);

  await mutateProject({
    tempDir,
    metadataPath: rollbackMetadataPath(tempDir),
    configPath: guidanceConfigPath(tempDir),
    designPath: path.join(tempDir, "DESIGN.md"),
  });
  const configBefore = fs.readFileSync(guidanceConfigPath(tempDir), "utf8");
  const designBefore = fs.readFileSync(path.join(tempDir, "DESIGN.md"), "utf8");

  const rollback = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(rollback.code, 3, `${rollback.stdout}${rollback.stderr}`);
  const payload = JSON.parse(rollback.stdout);
  assert.equal(payload.errors[0].code, "E_DESIGN_ROLLBACK_METADATA_UNREADABLE");
  assert.equal(fs.readFileSync(guidanceConfigPath(tempDir), "utf8"), configBefore);
  assert.equal(fs.readFileSync(path.join(tempDir, "DESIGN.md"), "utf8"), designBefore);
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
      if (fixture.expectedWarningCheck) {
        assert.deepEqual(payload.errors, []);
        assert.ok(
          payload.data.checks.some(
            (check) => check.name === fixture.expectedWarningCheck && check.status === "warn",
          ),
        );
      }
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

test("external execution normalizes nonzero child exits in JSON mode", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-exec-"));
  const fakePnpm = writeExecutableScript(tempDir, "fake-pnpm", 'echo "child failed" >&2\nexit 7');
  const { code, stdout, stderr } = await runCli(["test", "ui", "--exec", "--json"], {
    ASTUDIO_PNPM: fakePnpm,
  });

  assert.equal(code, 1);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.data.exit_code, 1);
  assert.equal(payload.data.failure_kind, "exit");
  assert.equal(payload.data.stderr.trim(), "child failed");
  assert.equal(payload.errors[0].code, "E_EXEC");
  assert.equal(payload.errors[0].message, "External command failed");
  assert.deepEqual(payload.errors[0].details, { exit_code: 1, failure_kind: "exit" });
});

test("external execution normalizes signal termination", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-exec-"));
  const fakePnpm = writeExecutableScript(tempDir, "fake-pnpm", "kill -TERM $$");
  const { code, stdout, stderr } = await runCli(["test", "ui", "--exec", "--json"], {
    ASTUDIO_PNPM: fakePnpm,
  });

  assert.equal(code, 1);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.exit_code, 1);
  assert.equal(payload.data.failure_kind, "signal");
  assert.equal(payload.errors[0].code, "E_EXEC");
  assert.equal(payload.errors[0].message, "External command was terminated");
  assert.deepEqual(payload.errors[0].details, { exit_code: 1, failure_kind: "signal" });
});

test("external execution preserves operator abort exit class", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-exec-"));
  const fakePnpm = writeExecutableScript(tempDir, "fake-pnpm", "kill -INT $$");
  const { code, stdout, stderr } = await runCli(["test", "ui", "--exec", "--json"], {
    ASTUDIO_PNPM: fakePnpm,
  });

  assert.equal(code, 130);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.exit_code, 130);
  assert.equal(payload.data.failure_kind, "signal");
  assert.equal(payload.errors[0].code, "E_EXEC");
  assert.equal(payload.errors[0].message, "External command was aborted");
  assert.deepEqual(payload.errors[0].details, { exit_code: 130, failure_kind: "signal" });
});

test("external execution normalizes timeouts", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-exec-"));
  const fakePnpm = writeExecutableScript(tempDir, "fake-pnpm", "exec sleep 10");
  const { code, stdout, stderr } = await runCli(["test", "ui", "--exec", "--json"], {
    ASTUDIO_EXEC_TIMEOUT_MS: "50",
    ASTUDIO_PNPM: fakePnpm,
  });

  assert.equal(code, 1);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.exit_code, 1);
  assert.equal(payload.data.failure_kind, "timeout");
  assert.equal(payload.errors[0].code, "E_EXEC");
  assert.equal(payload.errors[0].message, "External command timed out");
  assert.deepEqual(payload.errors[0].details, { exit_code: 1, failure_kind: "timeout" });
});

test("external execution normalizes spawn failures", async () => {
  const missingPnpm = path.join(os.tmpdir(), "astudio-missing-pnpm");
  const { code, stdout, stderr } = await runCli(["test", "ui", "--exec", "--json"], {
    ASTUDIO_PNPM: missingPnpm,
  });

  assert.equal(code, 1);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.data.exit_code, 1);
  assert.equal(payload.data.failure_kind, "start");
  assert.equal(payload.errors[0].code, "E_EXEC");
  assert.equal(payload.errors[0].message, "External command could not be started");
  assert.deepEqual(payload.errors[0].details, { exit_code: 1, failure_kind: "start" });
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

test("design diff rejects unsupported after schema in CI mode", async () => {
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
  assert.equal(code, 2);
  assert.equal(stderr, "");
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_SCHEMA_INVALID");
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
    `${JSON.stringify(
      {
        schemaVersion: 2,
        docs: ["docs/design-system/CONTRACT.md"],
        designContract: {
          mode: "design-md",
          migrationState: "active",
          rollbackMetadata: "artifacts/design-migrations/missing.json",
        },
      },
      null,
      2,
    )}\n`,
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

test("design diff fail-on-regression rejects unsupported after schema", async () => {
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
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.equal(payload.status, "error");
  assert.equal(payload.errors[0].code, "E_DESIGN_SCHEMA_INVALID");
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

test("design migrate writes authenticated rollback metadata contract", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const result = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(result.code, 0, `${result.stdout}${result.stderr}`);

  const metadata = rollbackMetadata(tempDir);
  for (const field of [
    "schema",
    "writtenByWrapperVersion",
    "writtenAt",
    "sourceMode",
    "targetMode",
    "guidanceConfigPath",
    "guidanceConfigChecksum",
    "designFilePath",
    "designFileChecksum",
    "rollbackArtifactDir",
    "legacySupportEndsAtAtWrite",
    "operationId",
    "signatureKeyId",
    "metadataDigest",
    "metadataSignature",
  ]) {
    assert.equal(typeof metadata[field], "string", field);
  }
  assert.equal(metadata.schema, "astudio.design.rollback.v1");
  assert.equal(metadata.sourceSchemaVersion, 1);
  assert.equal(metadata.targetSchemaVersion, 2);
  assert.match(metadata.guidanceConfigChecksum, /^[a-f0-9]{64}$/);
  assert.match(metadata.designFileChecksum, /^[a-f0-9]{64}$/);
  assert.match(metadata.signatureKeyId, /^[a-f0-9]{64}$/);
  assert.match(metadata.metadataDigest, /^[a-f0-9]{64}$/);
  assert.match(metadata.metadataSignature, /^hmac-sha256:[a-f0-9]{64}$/);
  assert.equal(metadata.checksums.config, metadata.guidanceConfigChecksum);
  assert.equal(metadata.checksums.design, metadata.designFileChecksum);
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
  const metadata = rollbackMetadata(tempDir);

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
  assert.equal(
    path.dirname(payload.data.quarantinePath),
    path.join(fs.realpathSync(migrationArtifactDir(tempDir)), metadata.operationId),
  );
  assertNoMigrationScratchFiles(tempDir);
});

test("design migrate rollback allocates collision-safe quarantine paths", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const migrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(migrate.code, 0);

  const metadata = rollbackMetadata(tempDir);
  const designContent = fs.readFileSync(path.join(tempDir, "DESIGN.md"), "utf8");
  const baseName = `${checksum(designContent).slice(0, 12)}-DESIGN.md`;
  const quarantineDir = path.join(migrationArtifactDir(tempDir), metadata.operationId);
  fs.mkdirSync(quarantineDir, { recursive: true });
  const firstCollisionPath = path.join(quarantineDir, baseName);
  const secondCollisionPath = path.join(quarantineDir, baseName.replace(/\.md$/, "-1.md"));
  fs.writeFileSync(firstCollisionPath, "existing quarantine collision\n", { flag: "wx" });
  fs.writeFileSync(secondCollisionPath, "second quarantine collision\n", { flag: "wx" });

  const rollback = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(rollback.code, 0, `${rollback.stdout}${rollback.stderr}`);
  const payload = JSON.parse(rollback.stdout);
  assert.equal(path.basename(payload.data.quarantinePath), baseName.replace(/\.md$/, "-2.md"));
  assert.equal(fs.readFileSync(firstCollisionPath, "utf8"), "existing quarantine collision\n");
  assert.equal(fs.readFileSync(secondCollisionPath, "utf8"), "second quarantine collision\n");
  assert.equal(fs.existsSync(payload.data.quarantinePath), true);
  assertNoMigrationScratchFiles(tempDir);
});

test("design migrate rollback rejects tampered metadata without mutating config", async () => {
  await assertRollbackFailsWithoutMutation(({ metadataPath }) => {
    const metadata = readJsonFile(metadataPath);
    metadata.targetMode = "legacy";
    writeJsonFile(metadataPath, metadata);
  });
});

test("design migrate rollback rejects public forged metadata signature without mutating config", async () => {
  await assertRollbackFailsWithoutMutation(({ metadataPath }) => {
    const metadata = readJsonFile(metadataPath);
    metadata.targetMode = "legacy";
    metadata.metadataDigest = checksum(canonicalJson(stripRollbackSignature(metadata)));
    metadata.metadataSignature = publicManifestRollbackSignature(metadata.metadataDigest);
    writeJsonFile(metadataPath, metadata);
  });
});

test("design migrate rollback rejects malformed wrapper metadata without mutating config", async () => {
  await assertRollbackFailsWithoutMutation(({ metadataPath }) => {
    const metadata = readJsonFile(metadataPath);
    metadata.writtenByWrapperVersion = "bogus";
    writeJsonFile(metadataPath, metadata);
  });
});

test("design migrate rollback accepts metadata inside published legacy support window", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const migrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(migrate.code, 0, `${migrate.stdout}${migrate.stderr}`);

  const metadataPath = rollbackMetadataPath(tempDir);
  const metadata = rollbackMetadata(tempDir);
  metadata.writtenByWrapperVersion =
    DESIGN_COMPATIBILITY_MANIFEST.legacySupport.rollbackMetadataMinWrapper;
  writeJsonFile(metadataPath, resignRollbackMetadata(metadata));

  const rollback = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(rollback.code, 0, `${rollback.stdout}${rollback.stderr}`);
  const payload = JSON.parse(rollback.stdout);
  assert.equal(payload.data.migrationState, "rolled-back");
  assert.equal(fs.existsSync(path.join(tempDir, "DESIGN.md")), false);
});

test("design migrate rollback rejects metadata older than legacy support window", async () => {
  await assertRollbackFailsWithoutMutation(({ metadataPath }) => {
    const metadata = readJsonFile(metadataPath);
    metadata.writtenByWrapperVersion = "0.0.0";
    writeJsonFile(metadataPath, resignRollbackMetadata(metadata));
  });
});

test("design migrate rollback rejects symlinked metadata escape without mutating config", async () => {
  await assertRollbackFailsWithoutMutation(({ metadataPath }) => {
    const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-metadata-escape-"));
    const outsideMetadata = path.join(outsideDir, "rollback.json");
    fs.copyFileSync(metadataPath, outsideMetadata);
    fs.unlinkSync(metadataPath);
    fs.symlinkSync(outsideMetadata, metadataPath);
  });
});

test("design migrate rollback rejects config checksum drift without mutating config", async () => {
  await assertRollbackFailsWithoutMutation(({ configPath }) => {
    const config = readJsonFile(configPath);
    config.docs = [...config.docs, "docs/design-system/EXTRA.md"];
    writeJsonFile(configPath, config);
  });
});

test("design migrate rollback rejects design checksum drift without mutating config", async () => {
  await assertRollbackFailsWithoutMutation(({ designPath }) => {
    fs.appendFileSync(designPath, "\n<!-- drift -->\n");
  });
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

test("design migrate resume accepts failed migration state with readable metadata", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const migrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(migrate.code, 0);

  const configPath = guidanceConfigPath(tempDir);
  const failedConfig = readJsonFile(configPath);
  failedConfig.designContract.migrationState = "failed";
  writeJsonFile(configPath, failedConfig);

  const resume = await runCli(
    ["design", "migrate", "--resume", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(resume.code, 0, `${resume.stdout}${resume.stderr}`);
  const payload = JSON.parse(resume.stdout);
  assert.equal(payload.data.migrationState, "active");
});

test("design migrate writes partial marker before final mutation failure", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const result = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    { ASTUDIO_GUIDANCE_FAIL_AFTER_PARTIAL: "1" },
    { cwd: tempDir },
  );
  assert.equal(result.code, 4, `${result.stdout}${result.stderr}`);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.errors[0].code, "E_PARTIAL");

  const config = readJsonFile(guidanceConfigPath(tempDir));
  assert.equal(config.schemaVersion, 2);
  assert.equal(config.designContract.mode, "design-md");
  assert.equal(config.designContract.migrationState, "partial");
  assert.equal(fs.existsSync(path.join(tempDir, config.designContract.rollbackMetadata)), true);
  assertNoMigrationScratchFiles(tempDir);

  const resume = await runCli(
    ["design", "migrate", "--resume", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(resume.code, 0, `${resume.stdout}${resume.stderr}`);
  const resumedPayload = JSON.parse(resume.stdout);
  assert.equal(resumedPayload.data.migrationState, "active");
  assertNoMigrationScratchFiles(tempDir);
});

test("design migrate rollback partial failure remains recoverable", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const migrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(migrate.code, 0, `${migrate.stdout}${migrate.stderr}`);

  const failedRollback = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    { ASTUDIO_GUIDANCE_FAIL_AFTER_PARTIAL: "1" },
    { cwd: tempDir },
  );
  assert.equal(failedRollback.code, 4, `${failedRollback.stdout}${failedRollback.stderr}`);
  const failedPayload = JSON.parse(failedRollback.stdout);
  assert.equal(failedPayload.errors[0].code, "E_PARTIAL");

  const partialConfig = readJsonFile(guidanceConfigPath(tempDir));
  assert.equal(partialConfig.designContract.mode, "design-md");
  assert.equal(partialConfig.designContract.migrationState, "partial");
  assert.equal(fs.existsSync(path.join(tempDir, "DESIGN.md")), true);
  assert.deepEqual(quarantineFiles(tempDir), []);
  assertNoMigrationScratchFiles(tempDir);

  const rollback = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(rollback.code, 0, `${rollback.stdout}${rollback.stderr}`);
  const payload = JSON.parse(rollback.stdout);
  assert.equal(payload.data.migrationState, "rolled-back");
  assert.equal(fs.existsSync(path.join(tempDir, "DESIGN.md")), false);
  assert.equal(quarantineFiles(tempDir).length, 1);
  assertNoMigrationScratchFiles(tempDir);
});

test("design migrate transition table rejects invalid mutations without touching config", async () => {
  const cases = [
    {
      name: "fresh migration from partial state",
      designContract: { mode: "legacy", migrationState: "partial" },
      args: ["design", "migrate", "--to", "design-md", "--write", "--json"],
    },
    {
      name: "rollback from not-started state",
      designContract: { mode: "legacy", migrationState: "not-started" },
      args: ["design", "migrate", "--rollback", "--write", "--json"],
    },
    {
      name: "rollback alias from not-started state",
      designContract: { mode: "legacy", migrationState: "not-started" },
      args: ["design", "migrate", "--to", "legacy", "--write", "--json"],
    },
    {
      name: "resume from active state",
      designContract: { mode: "design-md", migrationState: "active" },
      args: ["design", "migrate", "--resume", "--write", "--json"],
    },
    {
      name: "fresh migration from invalid design-md not-started state",
      designContract: { mode: "design-md", migrationState: "not-started" },
      args: ["design", "migrate", "--to", "design-md", "--write", "--json"],
    },
  ];

  for (const entry of cases) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
    writeValidDesignContract(tempDir);
    const config = {
      schemaVersion: 2,
      docs: ["docs/design-system/CONTRACT.md"],
      designContract: entry.designContract,
    };
    writeGuidanceConfig(tempDir, config);
    const before = fs.readFileSync(guidanceConfigPath(tempDir), "utf8");

    const result = await runCli(entry.args, {}, { cwd: tempDir });
    assert.equal(result.code, 1, `${entry.name}: ${result.stdout}${result.stderr}`);
    const payload = JSON.parse(result.stdout);
    assert.equal(payload.errors[0].code, "E_DESIGN_MIGRATION_STATE_INVALID", entry.name);
    assert.equal(fs.readFileSync(guidanceConfigPath(tempDir), "utf8"), before, entry.name);
  }
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
  const firstRollbackPayload = JSON.parse(rollback.stdout);
  const firstQuarantinePath = firstRollbackPayload.data.quarantinePath;

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

  const secondRollback = await runCli(
    ["design", "migrate", "--rollback", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(secondRollback.code, 0, `${secondRollback.stdout}${secondRollback.stderr}`);
  const secondRollbackPayload = JSON.parse(secondRollback.stdout);
  const secondQuarantinePath = secondRollbackPayload.data.quarantinePath;
  assert.notEqual(secondQuarantinePath, firstQuarantinePath);
  assert.equal(fs.existsSync(firstQuarantinePath), true);
  assert.equal(fs.existsSync(secondQuarantinePath), true);
  assert.equal(quarantineFiles(tempDir).length, 2);
  assertNoMigrationScratchFiles(tempDir);
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
  assert.equal(rollbackMetadataFiles(tempDir).length, 1);
  assertNoMigrationScratchFiles(tempDir);
});

test("design migrate concurrent rollbacks allocate one quarantine path", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "astudio-guidance-"));
  writeValidDesignProject(tempDir);

  const migrate = await runCli(
    ["design", "migrate", "--to", "design-md", "--write", "--json"],
    {},
    { cwd: tempDir },
  );
  assert.equal(migrate.code, 0, `${migrate.stdout}${migrate.stderr}`);

  const results = await Promise.all(
    Array.from({ length: 4 }, () =>
      runCli(["design", "migrate", "--rollback", "--write", "--json"], {}, { cwd: tempDir }),
    ),
  );

  const successes = results.filter((result) => result.code === 0);
  assert.equal(
    successes.length,
    1,
    results.map((result) => `${result.code}: ${result.stdout}${result.stderr}`).join("\n"),
  );
  for (const result of results) {
    if (result.code === 0) continue;
    const payload = JSON.parse(result.stdout);
    assert.ok(
      ["E_DESIGN_MIGRATION_LOCKED", "E_DESIGN_MIGRATION_STATE_INVALID"].includes(
        payload.errors[0].code,
      ),
      payload.errors[0].code,
    );
  }

  const config = readJsonFile(guidanceConfigPath(tempDir));
  assert.equal(config.designContract.mode, "legacy");
  assert.equal(config.designContract.migrationState, "rolled-back");
  assert.equal(fs.existsSync(path.join(tempDir, "DESIGN.md")), false);
  assert.equal(quarantineFiles(tempDir).length, 1);
  assertNoMigrationScratchFiles(tempDir);
});
