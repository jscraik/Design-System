import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const args = process.argv.slice(2);
const serviceTag = 'service:"agent-design"';

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
  });
}

function gitChangedFiles() {
  const base = readArgValues("--base")[0] ?? process.env.AGENT_DESIGN_PREPARE_BASE;
  const commands = [];
  if (base) {
    commands.push(["diff", "--name-only", "--diff-filter=ACMRT", `${base}...HEAD`]);
  }
  commands.push(["diff", "--name-only", "--diff-filter=ACMRT", "--cached", "HEAD"]);
  commands.push(["diff", "--name-only", "--diff-filter=ACMRT", "HEAD"]);

  const files = new Set();
  for (const commandArgs of commands) {
    const result = run("git", commandArgs);
    if (result.status !== 0) {
      const detail = (result.stderr || result.stdout).trim();
      error(
        `agent-design: failed to run git ${commandArgs.join(" ")}${detail ? `: ${detail}` : ""}`,
      );
      process.exit(result.status ?? 1);
    }
    for (const file of result.stdout.split(/\r?\n/)) {
      if (file.trim()) files.add(file.trim());
    }
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
  try {
    payload = JSON.parse(result.stdout);
  } catch {
    return {
      ok: false,
      surface,
      reason: "prepare did not emit parseable JSON",
      stderr: result.stderr.trim(),
      stdout: result.stdout.trim().slice(0, 500),
    };
  }
  const validationError = validatePreparePayload(payload);
  if (validationError) {
    return {
      ok: false,
      surface,
      reason: validationError,
      stderr: result.stderr.trim(),
      stdout: result.stdout.trim().slice(0, 500),
    };
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
  const label = result.ok ? "OK" : "ERROR";
  log(
    `  [${label}] ${surface}: kind=${result.surfaceKind ?? "unknown"} scope=${
      result.surfaceScope ?? "unknown"
    } safe=${String(result.safeForAutomaticImplementation)}`,
  );
  if (!result.ok) {
    failed = true;
    log(`    reason: ${result.reason}`);
    if (result.openDecisions.length > 0) {
      for (const decision of result.openDecisions) {
        log(`    openDecision: ${decision.code} ${decision.message}`);
      }
    }
    if (result.stderr) log(`    stderr: ${result.stderr}`);
    if (result.stdout) log(`    stdout: ${result.stdout}`);
  }
}

if (failed) {
  log(
    "agent-design: prepare evidence gate failed; run prepare manually and document the returned open decision before editing protected UI.",
  );
  process.exit(1);
}

log("agent-design: prepare evidence gate ok");
