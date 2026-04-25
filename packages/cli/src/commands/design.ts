import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  type DesignContract,
  type DesignDiffResult,
  DesignEngineError,
  diffDesignContracts,
  type ExportFormat,
  exportDesignContract,
  lintDesignContract,
  lintDesignFile,
  parseDesignContract,
} from "@brainwav/agent-design-engine";
import {
  assertDesignCommandSchemaSupported,
  GuidanceError,
  isCiEnvironment,
  migrateGuidanceConfig,
  runCheck,
} from "@brainwav/design-system-guidance";
import type { ArgumentsCamelCase, Argv } from "yargs";
import { ERROR_CODES, EXIT_CODES } from "../constants.js";
import { CliError } from "../error.js";
import type { CliArgs, JsonValue } from "../types.js";
import { findRepoRoot } from "../utils/config.js";
import { resolveCwd } from "../utils/env.js";
import { runPnpm } from "../utils/exec.js";
import { createEnvelope, outputJson, outputPlain } from "../utils/output.js";

const DEFAULT_DESIGN_FILE = "DESIGN.md";
type DesignCommandKind =
  | "astudio.design.lint.v1"
  | "astudio.design.diff.v1"
  | "astudio.design.export.v1"
  | "astudio.design.checkBrand.v1"
  | "astudio.design.init.v1"
  | "astudio.design.migrate.v1"
  | "astudio.design.doctor.v1";

interface DesignArgs extends CliArgs {
  file?: string;
  scope?: "root" | "nearest";
  before?: string;
  after?: string;
  format?: ExportFormat;
  out?: string;
  warningsAsErrors?: boolean;
  failOnRegression?: boolean;
  profile?: string;
  strict?: boolean;
  target?: string;
  force?: boolean;
  yes?: boolean;
  to?: "legacy" | "design-md";
  rollback?: boolean;
  resume?: boolean;
  active?: boolean;
}

interface DesignDiscovery {
  filePath: string;
  rootDir: string;
  discoveryMode: "file" | "root" | "nearest";
  candidateDesignFiles: string[];
}

interface NullableDesignDiscovery {
  filePath: string | null;
  rootDir: string;
  discoveryMode: DesignDiscovery["discoveryMode"] | "none";
  candidateDesignFiles: string[];
}

interface DesignOptionBuilder {
  option(name: string, options: Record<string, unknown>): DesignOptionBuilder;
}

interface DesignCommandChain {
  command(
    command: string,
    description: string,
    builder: (cmd: DesignOptionBuilder) => DesignOptionBuilder,
    handler: (raw: ArgumentsCamelCase<DesignArgs>) => Promise<number>,
  ): DesignCommandChain;
  demandCommand(min: number, message: string): DesignCommandChain;
}

function toJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue;
}

function commandCwd(argv: DesignArgs): string {
  return resolveCwd(argv);
}

function resolveCommandPath(cwd: string, filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
}

function shouldEmitJson(argv: DesignArgs): boolean {
  return Boolean(argv.json || argv.agent || isCiEnvironment());
}

function designRetryCommand(
  argv: DesignArgs,
  flags: string[],
): {
  argv: string[];
  cwd: string;
} {
  const retryArgs = process.argv.slice(2).filter((arg) => arg !== "--plain");
  for (const flag of flags) {
    if (!retryArgs.includes(flag)) retryArgs.push(flag);
  }
  if (!retryArgs.includes("--json")) retryArgs.push("--json");
  return {
    argv: ["astudio", ...retryArgs],
    cwd: commandCwd(argv),
  };
}

function designCommandRecovery(
  argv: DesignArgs,
  args: string[],
): {
  argv: string[];
  cwd: string;
} {
  return {
    argv: ["astudio", ...args],
    cwd: commandCwd(argv),
  };
}

function unavailableRecovery(reason: string): {
  recoveryUnavailableReason: string;
} {
  return { recoveryUnavailableReason: reason };
}

function recoveryForDesignErrorCode(
  code: string,
): { recoveryUnavailableReason: string } | undefined {
  switch (code) {
    case "E_DESIGN_CONFIG_INVALID":
      return unavailableRecovery("The guidance config must be repaired before migration can run.");
    case "E_DESIGN_MIGRATION_STATE_INVALID":
      return unavailableRecovery(
        "The migration state must be repaired or rolled back before this command can retry safely.",
      );
    case "E_DESIGN_PROFILE_OVERRIDE_FORBIDDEN":
      return unavailableRecovery(
        "CI profile overrides are intentionally blocked; update the command or DESIGN.md frontmatter.",
      );
    case "E_DESIGN_PROFILE_UNKNOWN":
    case "E_DESIGN_PROFILE_UNSUPPORTED":
      return unavailableRecovery(
        "The DESIGN.md brand profile must be changed to a supported profile before retrying.",
      );
    case "E_DESIGN_ROLLBACK_METADATA_UNREADABLE":
      return unavailableRecovery(
        "Rollback metadata must be restored or repaired before rollback can continue safely.",
      );
    case "E_DESIGN_SCHEMA_INVALID":
      return unavailableRecovery(
        "The DESIGN.md schema or frontmatter must be repaired before retrying.",
      );
    default:
      return undefined;
  }
}

function assertDesignOutputMode(argv: DesignArgs): void {
  if (argv.plain && (argv.agent || isCiEnvironment())) {
    throw new CliError("Design commands require JSON output in agent or CI mode.", {
      code: ERROR_CODES.policy,
      exitCode: EXIT_CODES.policy,
      hint: "Remove --plain or run without --agent/CI.",
      recovery: {
        recoveryUnavailableReason:
          "The caller explicitly requested plain output in a machine-output context.",
      },
    });
  }
}

function normalizeDesignError(error: unknown): CliError {
  if (error instanceof CliError) return error;
  if (error instanceof GuidanceError) {
    const recovery = recoveryForDesignErrorCode(error.code);
    return new CliError(error.message, {
      code: error.code,
      exitCode: error.exitCode,
      hint: error.hint,
      ...(recovery ? { recovery } : {}),
    });
  }
  if (error instanceof DesignEngineError) {
    const recovery = recoveryForDesignErrorCode(error.code);
    return new CliError(error.message, {
      code: error.code,
      exitCode: error.exitCode,
      ...(recovery ? { recovery } : {}),
    });
  }
  return new CliError(error instanceof Error ? error.message : "Design command failed", {
    code: ERROR_CODES.internal,
    exitCode: EXIT_CODES.failure,
  });
}

function emitDesign(
  argv: DesignArgs,
  summary: string,
  status: "success" | "warn" | "error",
  data: unknown,
): void {
  if (shouldEmitJson(argv)) {
    const dataValue = toJsonValue(data);
    if (typeof dataValue !== "object" || dataValue === null || Array.isArray(dataValue)) {
      outputJson(createEnvelope(summary, status, { value: dataValue }));
      return;
    }
    const kind = (dataValue as { kind?: JsonValue }).kind;
    if (typeof kind === "string") {
      assertDesignCommandSchemaSupported(kind);
    }
    outputJson(createEnvelope(summary, status, dataValue as Record<string, JsonValue>));
    return;
  }

  outputPlain([`${status.toUpperCase()} ${summary}`]);
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findGitRoot(startDir: string): Promise<string> {
  let current = path.resolve(startDir);
  while (true) {
    if (await pathExists(path.join(current, ".git"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return startDir;
    current = parent;
  }
}

async function findProjectRoot(startDir: string): Promise<string> {
  return findRepoRoot(startDir) ?? (await findGitRoot(startDir));
}

async function findDesignCandidates(startDir: string, gitRoot: string): Promise<string[]> {
  const candidates: string[] = [];
  let current = path.resolve(startDir);
  while (true) {
    const candidate = path.join(current, DEFAULT_DESIGN_FILE);
    if (await pathExists(candidate)) candidates.push(candidate);
    if (current === gitRoot) return candidates;
    const parent = path.dirname(current);
    if (parent === current) return candidates;
    current = parent;
  }
}

async function resolveDesignContract(argv: DesignArgs): Promise<DesignDiscovery> {
  const cwd = commandCwd(argv);
  const gitRoot = await findProjectRoot(cwd);
  if (argv.file) {
    const filePath = resolveCommandPath(cwd, argv.file);
    return {
      filePath,
      rootDir: gitRoot,
      discoveryMode: "file",
      candidateDesignFiles: [filePath],
    };
  }

  if (isCiEnvironment() && !argv.scope) {
    throw new CliError("CI design commands require --file or --scope.", {
      code: "E_DESIGN_DISCOVERY_REQUIRED",
      exitCode: EXIT_CODES.usage,
      hint: "Pass --file DESIGN.md, --scope root, or --scope nearest.",
      recovery: {
        fix_suggestion: "Retry with an explicit design discovery scope.",
        nextCommand: designRetryCommand(argv, ["--scope", "root"]),
      },
    });
  }

  if (argv.scope === "root") {
    const filePath = path.join(gitRoot, DEFAULT_DESIGN_FILE);
    return {
      filePath,
      rootDir: gitRoot,
      discoveryMode: "root",
      candidateDesignFiles: [filePath],
    };
  }

  const candidates = await findDesignCandidates(cwd, gitRoot);
  if (candidates.length === 0) {
    throw new CliError("No design contract found.", {
      code: "E_DESIGN_CONTRACT_MISSING",
      exitCode: EXIT_CODES.usage,
      hint: "Pass --file, --scope root, or create DESIGN.md with astudio design init --write.",
      recovery: {
        fix_suggestion: "Preview a starter DESIGN.md before writing a new design contract.",
        nextCommand: designCommandRecovery(argv, ["design", "init", "--dry-run", "--json"]),
      },
    });
  }

  if (candidates.length > 1 && argv.scope !== "nearest") {
    throw new CliError("Multiple design contracts found; choose one explicitly.", {
      code: "E_DESIGN_CONTRACT_AMBIGUOUS",
      exitCode: EXIT_CODES.usage,
      details: { candidates },
      hint: "Pass --file or choose --scope root|nearest.",
      recovery: unavailableRecovery(
        "Multiple DESIGN.md files were discovered; an operator must choose the intended contract.",
      ),
    });
  }

  return {
    filePath: candidates[0],
    rootDir: gitRoot,
    discoveryMode: "nearest",
    candidateDesignFiles: candidates,
  };
}

async function tryResolveDesignContract(
  argv: DesignArgs,
): Promise<{ discovery: DesignDiscovery | null; error: CliError | null }> {
  try {
    return { discovery: await resolveDesignContract(argv), error: null };
  } catch (error) {
    return { discovery: null, error: normalizeDesignError(error) };
  }
}

async function readDesignFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    throw new CliError(`Design contract not found: ${filePath}`, {
      code: "E_DESIGN_CONTRACT_MISSING",
      exitCode: EXIT_CODES.usage,
      hint: "Pass --file or create DESIGN.md with astudio design init --write.",
      recovery: unavailableRecovery(
        "The explicit --file path does not exist, so the caller must provide the intended contract path.",
      ),
    });
  }
}

async function readGuidanceDesignState(cwd: string): Promise<{
  exists: boolean;
  mode: "legacy" | "design-md";
  migrationState: string;
  rollbackMetadata: string | null;
}> {
  const configPath = path.join(cwd, ".design-system-guidance.json");
  if (!(await pathExists(configPath))) {
    return { exists: false, mode: "legacy", migrationState: "not-started", rollbackMetadata: null };
  }

  try {
    const raw = await readFile(configPath, "utf8");
    const parsed = JSON.parse(raw) as {
      designContract?: {
        mode?: "legacy" | "design-md";
        migrationState?: string;
        rollbackMetadata?: string;
      };
    };
    return {
      exists: true,
      mode: parsed.designContract?.mode ?? "legacy",
      migrationState: parsed.designContract?.migrationState ?? "not-started",
      rollbackMetadata: parsed.designContract?.rollbackMetadata ?? null,
    };
  } catch {
    return { exists: true, mode: "legacy", migrationState: "invalid", rollbackMetadata: null };
  }
}

function designContractFields(
  discovery: NullableDesignDiscovery | DesignDiscovery | null,
  contract: DesignContract | null | undefined,
): {
  resolvedDesignFile: string | null;
  discoveryMode: NullableDesignDiscovery["discoveryMode"] | null;
  candidateDesignFiles: string[];
  designSchemaVersion: string | null;
  brandProfile: string | null;
  resolvedProfile: string | null;
  profileSource: string | null;
  profileVersion: string | null;
  ruleManifestVersion: string | null;
  rulePackVersion: string | null;
  ruleSourceDigests: unknown;
} {
  return {
    resolvedDesignFile: discovery?.filePath ?? null,
    discoveryMode: discovery?.discoveryMode ?? null,
    candidateDesignFiles: discovery?.candidateDesignFiles ?? [],
    designSchemaVersion: contract?.schemaVersion ?? null,
    brandProfile: contract?.brandProfile ?? null,
    resolvedProfile: contract?.resolvedProfile ?? null,
    profileSource: contract?.profileSource ?? null,
    profileVersion: contract?.profileVersion ?? null,
    ruleManifestVersion: contract?.provenance.ruleManifestVersion ?? null,
    rulePackVersion: contract?.provenance.rulePackVersion ?? null,
    ruleSourceDigests: contract?.provenance.ruleSourceDigests ?? null,
  };
}

function withDiscovery<T extends { kind: string; contract?: DesignContract }>(
  result: T,
  discovery: DesignDiscovery,
): T & {
  resolvedDesignFile: string | null;
  discoveryMode: NullableDesignDiscovery["discoveryMode"] | null;
  candidateDesignFiles: string[];
  designSchemaVersion: string | null;
  brandProfile: string | null;
  resolvedProfile: string | null;
  profileSource: string | null;
  profileVersion: string | null;
  ruleManifestVersion: string | null;
  rulePackVersion: string | null;
  ruleSourceDigests: unknown;
} {
  const contract = result.contract;
  return {
    ...result,
    ...designContractFields(discovery, contract),
  };
}

function withDiffPayload(
  result: DesignDiffResult,
  beforeFile: string,
  afterFile: string,
): DesignDiffResult & {
  beforeFile: string;
  afterFile: string;
  beforeDesignSchemaVersion: string;
  afterDesignSchemaVersion: string;
  beforeRuleManifestVersion: string;
  afterRuleManifestVersion: string;
  beforeRulePackVersion: string;
  afterRulePackVersion: string;
  beforeRuleSourceDigests: DesignDiffResult["before"]["provenance"]["ruleSourceDigests"];
  afterRuleSourceDigests: DesignDiffResult["after"]["provenance"]["ruleSourceDigests"];
  brandProfileDelta: { before: string; after: string; changed: boolean };
} {
  return {
    ...result,
    beforeFile,
    afterFile,
    beforeDesignSchemaVersion: result.before.schemaVersion,
    afterDesignSchemaVersion: result.after.schemaVersion,
    beforeRuleManifestVersion: result.before.provenance.ruleManifestVersion,
    afterRuleManifestVersion: result.after.provenance.ruleManifestVersion,
    beforeRulePackVersion: result.before.provenance.rulePackVersion,
    afterRulePackVersion: result.after.provenance.rulePackVersion,
    beforeRuleSourceDigests: result.before.provenance.ruleSourceDigests,
    afterRuleSourceDigests: result.after.provenance.ruleSourceDigests,
    brandProfileDelta: {
      before: result.before.brandProfile,
      after: result.after.brandProfile,
      changed: result.before.brandProfile !== result.after.brandProfile,
    },
  };
}

function requireWrite(argv: DesignArgs, action: string): void {
  if (argv.dryRun) return;
  if (!argv.write) {
    throw new CliError(`${action} requires --write`, {
      code: ERROR_CODES.policy,
      exitCode: EXIT_CODES.policy,
      hint: "Re-run with --write to allow file mutation, or use --dry-run.",
      recovery: {
        fix_suggestion: "Re-run with --write to allow the requested file mutation.",
        nextCommand: designRetryCommand(argv, ["--write"]),
      },
    });
  }
}

function candidateDesignMarkdown(): string {
  return `---\nschemaVersion: agent-design.v1\nbrandProfile: astudio-default@1\n---\n# Product Surface\n\n## Surface Roles\n\nThis contract defines the shell surface role, section role, row role, state role, and accent role. The shell owns dynamic viewport and safe-area layout.\n\n## State Model\n\nLoading, empty, and error states must be visible and recoverable.\n\n## Focus Contract\n\nFocus affordances are scoped to components and never implemented as global focus rings.\n\n## Motion Contract\n\nMotion is compositor only and includes reduced-motion fallbacks.\n\n## Component Routing\n\nCheck docs/design-system/COMPONENT_LIFECYCLE.json and docs/design-system/COVERAGE_MATRIX.json before creating abstractions.\n`;
}

async function validateDesignContractForMigration(argv: DesignArgs): Promise<{
  discovery: DesignDiscovery | null;
  contract: DesignContract | null;
}> {
  if (argv.rollback || argv.resume || argv.to === "legacy") {
    return { discovery: null, contract: null };
  }

  const discovery = await resolveDesignContract({ ...argv, scope: argv.scope ?? "root" });
  const result = await lintDesignContract(await readDesignFile(discovery.filePath), {
    filePath: discovery.filePath,
    rootDir: discovery.rootDir,
    ci: isCiEnvironment(),
  });
  if (!result.ok) {
    throw new CliError("DESIGN.md has semantic findings; migration was not started.", {
      code: "E_DESIGN_SEMANTIC_FINDING",
      exitCode: EXIT_CODES.failure,
      hint: "Run astudio design lint --file DESIGN.md --json and fix error findings.",
    });
  }

  return { discovery, contract: result.contract };
}

async function run(handler: () => Promise<number>): Promise<number> {
  try {
    const exitCode = await handler();
    process.exitCode = exitCode;
    return exitCode;
  } catch (error) {
    throw normalizeDesignError(error);
  }
}

async function runDesign(kind: DesignCommandKind, handler: () => Promise<number>): Promise<number> {
  assertDesignCommandSchemaSupported(kind);
  return run(handler);
}

function lintOptions(cmd: DesignOptionBuilder): DesignOptionBuilder {
  return cmd
    .option("file", { type: "string" })
    .option("scope", { choices: ["root", "nearest"] as const })
    .option("warnings-as-errors", { type: "boolean" });
}

function diffOptions(cmd: DesignOptionBuilder): DesignOptionBuilder {
  return cmd
    .option("before", { type: "string", demandOption: true })
    .option("after", { type: "string", demandOption: true })
    .option("fail-on-regression", { type: "boolean" });
}

function exportOptions(cmd: DesignOptionBuilder): DesignOptionBuilder {
  return cmd
    .option("file", { type: "string" })
    .option("format", {
      choices: ["tailwind@4", "dtcg@2025", "json@agent-design.v1"] as const,
      demandOption: true,
    })
    .option("scope", { choices: ["root", "nearest"] as const })
    .option("out", { type: "string" })
    .option("write", { type: "boolean" });
}

function checkBrandOptions(cmd: DesignOptionBuilder): DesignOptionBuilder {
  return cmd
    .option("file", { type: "string" })
    .option("scope", { choices: ["root", "nearest"] as const })
    .option("profile", { type: "string" })
    .option("strict", { type: "boolean" });
}

function initOptions(cmd: DesignOptionBuilder): DesignOptionBuilder {
  return cmd
    .option("target", { type: "string" })
    .option("write", { type: "boolean" })
    .option("dry-run", { type: "boolean" })
    .option("force", { type: "boolean" })
    .option("yes", { type: "boolean" });
}

function migrateOptions(cmd: DesignOptionBuilder): DesignOptionBuilder {
  return cmd
    .option("file", { type: "string" })
    .option("scope", { choices: ["root", "nearest"] as const })
    .option("to", { choices: ["legacy", "design-md"] as const })
    .option("rollback", { type: "boolean" })
    .option("resume", { type: "boolean" })
    .option("write", { type: "boolean" })
    .option("dry-run", { type: "boolean" })
    .option("yes", { type: "boolean" });
}

function doctorOptions(cmd: DesignOptionBuilder): DesignOptionBuilder {
  return cmd
    .option("file", { type: "string" })
    .option("scope", { choices: ["root", "nearest"] as const })
    .option("active", { type: "boolean" });
}

export function designCommand(yargs: Argv): Argv {
  const chain = yargs as unknown as DesignCommandChain;
  return chain
    .command("lint", "Lint DESIGN.md", lintOptions, async (raw: ArgumentsCamelCase<DesignArgs>) =>
      runDesign("astudio.design.lint.v1", async () => {
        const argv = raw as DesignArgs;
        assertDesignOutputMode(argv);
        const discovery = await resolveDesignContract(argv);
        const result = await lintDesignFile(discovery.filePath, {
          rootDir: discovery.rootDir,
          warningsAsErrors: argv.warningsAsErrors,
          ci: isCiEnvironment(),
        });
        emitDesign(
          argv,
          "design lint",
          result.ok ? "success" : "error",
          withDiscovery(result, discovery),
        );
        return result.ok ? EXIT_CODES.success : EXIT_CODES.failure;
      }),
    )
    .command(
      "diff",
      "Diff two DESIGN.md files",
      diffOptions,
      async (raw: ArgumentsCamelCase<DesignArgs>) =>
        runDesign("astudio.design.diff.v1", async () => {
          const argv = raw as DesignArgs;
          assertDesignOutputMode(argv);
          const cwd = commandCwd(argv);
          const before = resolveCommandPath(cwd, String(argv.before));
          const after = resolveCommandPath(cwd, String(argv.after));
          const rootDir = await findProjectRoot(cwd);
          const result = await diffDesignContracts(
            await readDesignFile(before),
            await readDesignFile(after),
            {
              rootDir,
              beforeFilePath: before,
              afterFilePath: after,
            },
          );
          emitDesign(
            argv,
            "design diff",
            result.hasRegression ? "warn" : "success",
            withDiffPayload(result, before, after),
          );
          return (argv.failOnRegression || isCiEnvironment()) && result.hasRegression
            ? EXIT_CODES.failure
            : EXIT_CODES.success;
        }),
    )
    .command(
      "export",
      "Export DESIGN.md tokens and semantic metadata",
      exportOptions,
      async (raw: ArgumentsCamelCase<DesignArgs>) =>
        runDesign("astudio.design.export.v1", async () => {
          const argv = raw as DesignArgs;
          assertDesignOutputMode(argv);
          const discovery = await resolveDesignContract(argv);
          const lintResult = await lintDesignContract(await readDesignFile(discovery.filePath), {
            filePath: discovery.filePath,
            rootDir: discovery.rootDir,
          });
          if (!lintResult.ok) {
            throw new CliError("DESIGN.md has semantic findings; export was not started.", {
              code: "E_DESIGN_SEMANTIC_FINDING",
              exitCode: EXIT_CODES.failure,
              hint: "Run astudio design lint --file DESIGN.md --json and fix error findings.",
            });
          }
          const result = exportDesignContract(
            lintResult.contract,
            argv.format ?? "json@agent-design.v1",
          );
          if (argv.out) {
            requireWrite(argv, "design export --out");
            await writeFile(
              resolveCommandPath(commandCwd(argv), argv.out),
              `${JSON.stringify(result.artifact, null, 2)}\n`,
              "utf8",
            );
          }
          emitDesign(argv, "design export", "success", withDiscovery(result, discovery));
          return EXIT_CODES.success;
        }),
    )
    .command(
      "check-brand",
      "Check brand profile resolution",
      checkBrandOptions,
      async (raw: ArgumentsCamelCase<DesignArgs>) =>
        runDesign("astudio.design.checkBrand.v1", async () => {
          const argv = raw as DesignArgs;
          assertDesignOutputMode(argv);
          const discovery = await resolveDesignContract(argv);
          const contract = await parseDesignContract(await readDesignFile(discovery.filePath), {
            filePath: discovery.filePath,
            rootDir: discovery.rootDir,
            profileOverride: argv.profile,
            ci: isCiEnvironment(),
          });
          const ok = argv.profile
            ? contract.brandProfile === argv.profile
            : contract.resolvedProfile === contract.brandProfile;
          const findings = ok
            ? []
            : [
                {
                  code: "E_DESIGN_BRAND_PROFILE_MISMATCH",
                  message: "Resolved brand profile differs from DESIGN.md frontmatter.",
                  expected: contract.brandProfile,
                  actual: contract.resolvedProfile,
                },
              ];
          const result = {
            kind: "astudio.design.checkBrand.v1",
            contract,
            profile: contract.resolvedProfile,
            ok,
            findings,
          };
          emitDesign(
            argv,
            "design check-brand",
            ok ? "success" : "warn",
            withDiscovery(result, discovery),
          );
          return ok || !argv.strict ? EXIT_CODES.success : EXIT_CODES.failure;
        }),
    )
    .command(
      "init",
      "Create a starter DESIGN.md",
      initOptions,
      async (raw: ArgumentsCamelCase<DesignArgs>) =>
        runDesign("astudio.design.init.v1", async () => {
          const argv = raw as DesignArgs;
          assertDesignOutputMode(argv);
          const target = resolveCommandPath(commandCwd(argv), argv.target ?? ".");
          const filePath = path.join(target, DEFAULT_DESIGN_FILE);
          const markdown = candidateDesignMarkdown();
          if (!argv.dryRun) requireWrite(argv, "design init");
          if (!argv.dryRun && !(argv.force && argv.yes) && (await pathExists(filePath))) {
            throw new CliError(`Design contract already exists: ${filePath}`, {
              code: "E_DESIGN_CONTRACT_EXISTS",
              exitCode: EXIT_CODES.policy,
              hint: "Pass --force --yes with --write only when replacing this DESIGN.md is intentional.",
              recovery: unavailableRecovery(
                "Replacing an existing DESIGN.md requires an explicit operator decision.",
              ),
            });
          }
          const contract = await parseDesignContract(markdown, { filePath, rootDir: target });
          if (!argv.dryRun) {
            try {
              await writeFile(filePath, markdown, {
                encoding: "utf8",
                flag: argv.force && argv.yes ? "w" : "wx",
              });
            } catch (error) {
              if ((error as NodeJS.ErrnoException).code === "EEXIST") {
                throw new CliError(`Design contract already exists: ${filePath}`, {
                  code: "E_DESIGN_CONTRACT_EXISTS",
                  exitCode: EXIT_CODES.policy,
                  hint: "Pass --force --yes with --write only when replacing this DESIGN.md is intentional.",
                  recovery: unavailableRecovery(
                    "Replacing an existing DESIGN.md requires an explicit operator decision.",
                  ),
                });
              }
              throw error;
            }
          }
          emitDesign(argv, "design init", "success", {
            kind: "astudio.design.init.v1",
            filePath,
            dryRun: Boolean(argv.dryRun),
            contract,
          });
          return EXIT_CODES.success;
        }),
    )
    .command(
      "migrate",
      "Migrate guidance rollout state for DESIGN.md",
      migrateOptions,
      async (raw: ArgumentsCamelCase<DesignArgs>) =>
        runDesign("astudio.design.migrate.v1", async () => {
          const argv = raw as DesignArgs;
          assertDesignOutputMode(argv);
          const cwd = commandCwd(argv);
          const targetPath = await findProjectRoot(cwd);
          await migrateGuidanceConfig({
            targetPath,
            to: argv.to,
            rollback: Boolean(argv.rollback),
            resume: Boolean(argv.resume),
            dryRun: true,
            write: false,
            yes: Boolean(argv.yes),
          });
          const validation = await validateDesignContractForMigration(argv);
          const result = await migrateGuidanceConfig({
            targetPath,
            to: argv.to,
            rollback: Boolean(argv.rollback),
            resume: Boolean(argv.resume),
            dryRun: Boolean(argv.dryRun),
            write: Boolean(argv.write),
            yes: Boolean(argv.yes),
          });
          emitDesign(argv, "design migrate", "success", {
            kind: "astudio.design.migrate.v1",
            ...result,
            ...designContractFields(validation.discovery, validation.contract),
          });
          return EXIT_CODES.success;
        }),
    )
    .command(
      "doctor",
      "Inspect design command readiness",
      doctorOptions,
      async (raw: ArgumentsCamelCase<DesignArgs>) =>
        runDesign("astudio.design.doctor.v1", async () => {
          const argv = raw as DesignArgs;
          assertDesignOutputMode(argv);
          const cwd = commandCwd(argv);
          const checks = [];
          const { discovery, error } = await tryResolveDesignContract(argv);
          let contract: DesignContract | null = null;
          if (!discovery) {
            checks.push({
              name: "design-file",
              status: "warn",
              message: error?.message ?? "No design contract found.",
              filePath: null,
            });
          } else {
            try {
              contract = await parseDesignContract(await readDesignFile(discovery.filePath), {
                filePath: discovery.filePath,
                rootDir: discovery.rootDir,
              });
              checks.push({ name: "design-file", status: "pass", filePath: discovery.filePath });
            } catch (readError) {
              checks.push({
                name: "design-file",
                status: "warn",
                message: (readError as Error).message,
                filePath: discovery.filePath,
              });
            }
          }
          const rootDir = await findProjectRoot(cwd);
          const guidanceState = await readGuidanceDesignState(rootDir);
          if (guidanceState.exists) {
            const guidance = await runCheck(rootDir, { ci: true });
            checks.push({
              name: "guidance-config",
              status: guidance.exitCode === 0 ? "pass" : "error",
              mode: guidanceState.mode,
              migrationState: guidanceState.migrationState,
              rollbackMetadata: guidanceState.rollbackMetadata,
              violations: guidance.violations,
            });
          }
          if (argv.active) {
            if (!argv.exec) {
              throw new CliError("design doctor --active requires --exec.", {
                code: ERROR_CODES.policy,
                exitCode: EXIT_CODES.policy,
                hint: "Re-run with --exec to allow active external checks.",
                recovery: {
                  fix_suggestion: "Re-run with --exec to allow active external checks.",
                  nextCommand: designRetryCommand(argv, ["--exec"]),
                },
              });
            }
            const pnpm = await runPnpm(argv, ["--version"]);
            if (pnpm.exitCode !== EXIT_CODES.success) {
              throw new CliError("Design doctor active check failed.", {
                code: ERROR_CODES.exec,
                exitCode: pnpm.exitCode,
                hint: "Fix the external tool failure or rerun design doctor without --active.",
                details: {
                  command: pnpm.command,
                  exit_code: pnpm.exitCode,
                  failure_kind: pnpm.failureKind ?? "exit",
                },
                recovery: unavailableRecovery(
                  "Active checks depend on external tool availability and cannot be retried safely by changing design arguments.",
                ),
              });
            }
            checks.push({
              name: "pnpm",
              status: "pass",
              version: pnpm.stdout?.trim() ?? null,
            });
          }
          const result = {
            kind: "astudio.design.doctor.v1",
            mode: guidanceState.mode,
            checks,
            nextActions: checks.some((check) => check.status !== "pass")
              ? ["Run astudio design init --dry-run --json"]
              : [],
            contract,
            ...designContractFields(discovery, contract),
          };
          emitDesign(argv, "design doctor", "success", result);
          return EXIT_CODES.success;
        }),
    )
    .demandCommand(1, "Choose a design command.") as unknown as Argv;
}
