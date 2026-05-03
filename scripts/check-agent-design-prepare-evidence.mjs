import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const args = process.argv.slice(2);
const serviceTag = 'service:"agent-design"';
const DEFAULT_COMMAND_TIMEOUT_MS = 120000;
const configuredCommandTimeoutMs = Number(
  process.env.AGENT_DESIGN_PREPARE_TIMEOUT_MS ?? DEFAULT_COMMAND_TIMEOUT_MS,
);
const COMMAND_TIMEOUT_MS =
  Number.isFinite(configuredCommandTimeoutMs) && configuredCommandTimeoutMs > 0
    ? configuredCommandTimeoutMs
    : DEFAULT_COMMAND_TIMEOUT_MS;

function log(message) {
  console.log(`${message} ${serviceTag}`);
}

function error(message) {
  console.error(`${message} ${serviceTag}`);
}

function readArgValues(name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === name && args[index + 1]) {
      values.push(args[index + 1]);
      index += 1;
    } else if (arg.startsWith(`${name}=`)) {
      values.push(arg.slice(name.length + 1));
    }
  }
  return values;
}

function run(command, commandArgs) {
  return spawnSync(command, commandArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: COMMAND_TIMEOUT_MS,
    killSignal: "SIGTERM",
  });
}

function commandText(commandArgs) {
  return `git ${commandArgs.join(" ")}`;
}

function text(value) {
  return typeof value === "string" ? value : "";
}

function resultErrorMessage(result) {
  return result.error instanceof Error ? result.error.message : "";
}

function resultDetail(result) {
  return (text(result.stderr) || text(result.stdout) || resultErrorMessage(result)).trim();
}

/**
 * Add newline-delimited git output paths to a changed-file set.
 *
 * @param {Set<string>} files - Mutable set of repository-relative changed files.
 * @param {string} stdout - Newline-delimited output from a git file-list command.
 */
function addChangedFiles(files, stdout) {
  for (const file of stdout.split(/\r?\n/)) {
    if (file.trim()) files.add(file.trim());
  }
}

function failGitCommand(commandArgs, result) {
  const detail = resultDetail(result);
  error(`agent-design: failed to run ${commandText(commandArgs)}${detail ? `: ${detail}` : ""}`);
  process.exit(result.status ?? 1);
}

function isNoMergeBase(result) {
  return /\bno merge base\b/i.test(resultDetail(result));
}

/**
 * Discover changed files from the configured PR base plus local staged and
 * unstaged changes.
 *
 * @returns {string[]} Sorted repository-relative changed file paths.
 */
function gitChangedFiles() {
  const base = readArgValues("--base")[0] ?? process.env.AGENT_DESIGN_PREPARE_BASE;
  const files = new Set();
  if (base) {
    const commandArgs = ["diff", "--name-only", "--diff-filter=ACMRT", `${base}...HEAD`];
    const result = run("git", commandArgs);
    if (result.status === 0) {
      addChangedFiles(files, result.stdout);
    } else if (isNoMergeBase(result)) {
      const fallbackArgs = ["diff", "--name-only", "--diff-filter=ACMRT", base, "HEAD"];
      const fallback = run("git", fallbackArgs);
      if (fallback.status !== 0) {
        failGitCommand(fallbackArgs, fallback);
      }
      log(
        `agent-design: ${commandText(commandArgs)} has no merge base; used ${commandText(
          fallbackArgs,
        )}`,
      );
      addChangedFiles(files, fallback.stdout);
    } else {
      failGitCommand(commandArgs, result);
    }
  }

  const commands = [
    ["diff", "--name-only", "--diff-filter=ACMRT", "--cached", "HEAD"],
    ["diff", "--name-only", "--diff-filter=ACMRT", "HEAD"],
  ];
  for (const commandArgs of commands) {
    const result = run("git", commandArgs);
    if (result.status !== 0) {
      failGitCommand(commandArgs, result);
    }
    addChangedFiles(files, result.stdout);
  }
  return [...files].sort();
}

function isUiSurface(file) {
  if (!/\.[jt]sx$/.test(file)) return false;
  if (/(^|\/)(__tests__|test-fixtures|fixtures)\//.test(file)) return false;
  if (/\.(test|spec)\.[jt]sx$/.test(file)) return false;
  return (
    file.startsWith("packages/ui/src/") ||
    file.startsWith("packages/widgets/src/") ||
    file.startsWith("platforms/web/apps/web/src/")
  );
}

function toRepoRelative(file) {
  const relative = path.relative(repoRoot, path.resolve(repoRoot, file));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    error(`agent-design: surface is outside the repository: ${file}`);
    process.exit(2);
  }
  return relative;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Validate the design prepare envelope shape before the evidence gate trusts it.
 *
 * @param {unknown} payload - Parsed JSON payload emitted by the CLI prepare command.
 * @returns {string} Empty string when valid; otherwise a human-readable failure reason.
 */
function validatePreparePayload(payload) {
  if (!isObject(payload)) {
    return "prepare envelope must be an object";
  }
  if (payload.status !== "success" && payload.status !== "warn" && payload.status !== "error") {
    return "prepare envelope is missing a valid status";
  }
  if (!isObject(payload.data)) {
    return "prepare envelope is missing object data";
  }
  const data = payload.data;
  if (data.kind !== "astudio.design.prepare.v1") {
    return "prepare data.kind must be astudio.design.prepare.v1";
  }
  if (typeof data.safeForAutomaticImplementation !== "boolean") {
    return "prepare data.safeForAutomaticImplementation must be boolean";
  }
  if (!Array.isArray(data.validationCommands)) {
    return "prepare data.validationCommands must be an array";
  }
  if (!Array.isArray(data.openDecisions)) {
    return "prepare data.openDecisions must be an array";
  }
  return "";
}

/**
 * Run read-only prepare for one surface and normalize the result for gate output.
 *
 * @param {string} surface - Repository-relative UI surface path.
 * @returns {object} Normalized prepare result used by the changed-surface gate.
 */
function prepare(surface) {
  const result = run("node", [
    "packages/cli/dist/index.js",
    "design",
    "prepare",
    "--surface",
    surface,
    "--json",
  ]);
  let payload;
  const failure = (reason) => ({
    ok: false,
    surface,
    reason,
    surfaceKind: undefined,
    surfaceScope: undefined,
    safeForAutomaticImplementation: false,
    openDecisions: [],
    validationCommands: [],
    stderr: text(result.stderr).trim() || resultErrorMessage(result),
    stdout: text(result.stdout).trim().slice(0, 500),
  });

  try {
    payload = JSON.parse(result.stdout);
  } catch {
    return failure("prepare did not emit parseable JSON");
  }
  const validationError = validatePreparePayload(payload);
  if (validationError) {
    return failure(validationError);
  }
  const data = payload.data ?? {};
  return {
    ok:
      result.status === 0 &&
      data.safeForAutomaticImplementation === true &&
      Array.isArray(data.validationCommands),
    surface,
    status: payload.status,
    surfaceKind: data.surfaceKind,
    surfaceScope: data.surfaceScope,
    safeForAutomaticImplementation: data.safeForAutomaticImplementation,
    openDecisions: data.openDecisions ?? [],
    validationCommands: data.validationCommands ?? [],
    reason:
      result.status === 0
        ? "prepare returned unsafe or incomplete payload"
        : `prepare exited ${result.status}`,
  };
}

const explicitSurfaces = readArgValues("--surface");

/**
 * Decide whether a failed prepare result should warn instead of fail.
 *
 * Warn-scope changed surfaces may be tracked before they have full route
 * promotion. Explicit single-surface checks and protected surfaces still fail
 * closed so humans cannot accidentally bypass missing-route decisions.
 *
 * @param {ReturnType<typeof prepare>} result - Normalized prepare result.
 * @returns {boolean} True when the failure is non-blocking for this changed-file gate.
 */
function isNonBlockingWarnSurface(result) {
  if (explicitSurfaces.length > 0) return false;
  if (result.surfaceScope !== "warn" && result.surfaceScope !== "exempt") return false;
  if (result.status !== "warn") return false;
  const decisionCodes = result.openDecisions
    .map((decision) => (decision && typeof decision === "object" ? decision.code : undefined))
    .filter((code) => typeof code === "string");
  return (
    decisionCodes.length > 0 && decisionCodes.every((code) => code === "E_DESIGN_ROUTE_MISSING")
  );
}

const surfaces = (
  explicitSurfaces.length > 0 ? explicitSurfaces : gitChangedFiles().filter(isUiSurface)
)
  .map(toRepoRelative)
  .filter((file, index, files) => files.indexOf(file) === index)
  .sort();

if (explicitSurfaces.length > 0) {
  const missing = surfaces.filter((file) => !fs.existsSync(path.join(repoRoot, file)));
  if (missing.length > 0) {
    for (const file of missing) {
      error(`agent-design: explicit surface does not exist: ${file}`);
    }
    process.exit(2);
  }
}

const existingSurfaces =
  explicitSurfaces.length > 0
    ? surfaces
    : surfaces.filter((file) => fs.existsSync(path.join(repoRoot, file)));

log("agent-design: prepare evidence gate");

if (existingSurfaces.length === 0) {
  log("  no changed UI surfaces require prepare evidence");
  process.exit(0);
}

let failed = false;
for (const surface of existingSurfaces) {
  const result = prepare(surface);
  const nonBlockingWarnSurface = !result.ok && isNonBlockingWarnSurface(result);
  const label = result.ok ? "OK" : nonBlockingWarnSurface ? "WARN" : "ERROR";
  log(
    `  [${label}] ${surface}: kind=${result.surfaceKind ?? "unknown"} scope=${
      result.surfaceScope ?? "unknown"
    } safe=${String(result.safeForAutomaticImplementation)}`,
  );
  if (!result.ok) {
    log(`    reason: ${result.reason}`);
    if (result.openDecisions.length > 0) {
      for (const decision of result.openDecisions) {
        log(`    openDecision: ${decision.code} ${decision.message}`);
      }
    }
    if (result.stderr) log(`    stderr: ${result.stderr}`);
    if (result.stdout) log(`    stdout: ${result.stdout}`);
  }
  if (!result.ok && !nonBlockingWarnSurface) {
    failed = true;
  }
}

if (failed) {
  log(
    "agent-design: prepare evidence gate failed; run prepare manually and document the returned open decision before editing protected UI.",
  );
  process.exit(1);
}

log("agent-design: prepare evidence gate ok");
