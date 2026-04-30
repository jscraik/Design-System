import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const args = process.argv.slice(2);

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
    if (result.status !== 0) continue;
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
    console.error(`agent-design: surface is outside the repository: ${file}`);
    process.exit(2);
  }
  return relative;
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
  .filter((file) => fs.existsSync(path.join(repoRoot, file)))
  .sort();

console.log("agent-design: prepare evidence gate");

if (surfaces.length === 0) {
  console.log("  no changed UI surfaces require prepare evidence");
  process.exit(0);
}

let failed = false;
for (const surface of surfaces) {
  const result = prepare(surface);
  const label = result.ok ? "OK" : "ERROR";
  console.log(
    `  [${label}] ${surface}: kind=${result.surfaceKind ?? "unknown"} scope=${
      result.surfaceScope ?? "unknown"
    } safe=${String(result.safeForAutomaticImplementation)}`,
  );
  if (!result.ok) {
    failed = true;
    console.log(`    reason: ${result.reason}`);
    if (result.openDecisions.length > 0) {
      for (const decision of result.openDecisions) {
        console.log(`    openDecision: ${decision.code} ${decision.message}`);
      }
    }
    if (result.stderr) console.log(`    stderr: ${result.stderr}`);
    if (result.stdout) console.log(`    stdout: ${result.stdout}`);
  }
}

if (failed) {
  console.log(
    "agent-design: prepare evidence gate failed; run prepare manually and document the returned open decision before editing protected UI.",
  );
  process.exit(1);
}

console.log("agent-design: prepare evidence gate ok");
