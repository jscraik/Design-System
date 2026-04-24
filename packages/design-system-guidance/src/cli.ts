#!/usr/bin/env node

import {
  formatCheckResult,
  GuidanceError,
  initGuidance,
  isCiEnvironment,
  migrateGuidanceConfig,
  runCheck,
} from "./index.js";

interface ParsedArgs {
  path: string;
  ci: boolean;
  force: boolean;
  json: boolean;
  write: boolean;
  dryRun: boolean;
  yes: boolean;
  to?: "legacy" | "design-md";
  rollback: boolean;
  resume: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  let path = ".";
  let ci = false;
  let force = false;
  let json = false;
  let write = false;
  let dryRun = false;
  let yes = false;
  let to: ParsedArgs["to"];
  let rollback = false;
  let resume = false;

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--ci") {
      ci = true;
      continue;
    }

    if (value === "--force") {
      force = true;
      continue;
    }

    if (value === "--json") {
      json = true;
      continue;
    }

    if (value === "--write") {
      write = true;
      continue;
    }

    if (value === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (value === "--yes") {
      yes = true;
      continue;
    }

    if (value === "--rollback") {
      rollback = true;
      continue;
    }

    if (value === "--resume") {
      resume = true;
      continue;
    }

    if (value === "--to") {
      const next = argv[index + 1];
      if (next !== "legacy" && next !== "design-md") {
        throw new Error("--to must be legacy or design-md");
      }
      to = next;
      index += 1;
      continue;
    }

    if (value.startsWith("-")) {
      throw new Error(`Unknown flag: ${value}`);
    }

    path = value;
  }

  return { path, ci, force, json, write, dryRun, yes, to, rollback, resume };
}

function printUsage(): void {
  console.log(
    `design-system-guidance\n\nUsage:\n  design-system-guidance check [path] [--ci] [--json]\n  design-system-guidance init [path] [--force]\n  design-system-guidance migrate [path] --to design-md [--dry-run|--write] [--yes]\n  design-system-guidance migrate [path] --rollback [--dry-run|--write] [--yes]\n  design-system-guidance migrate [path] --resume [--dry-run|--write] [--yes]\n\nBehavior:\n  - check defaults to warnings and exit code 0.\n  - check fails with exit code 1 in CI mode (--ci or CI env) when error-level violations are present.\n  - --json prints the raw check result for policy tooling.\n  - init writes .design-system-guidance.json in the target path.\n  - migrate preserves v1 fields and adds or updates designContract rollout state.`,
  );
}

function writeOutput(value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    process.stdout.write(`${value}\n`, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printUsage();
    process.exit(0);
  }

  if (command === "check") {
    const args = parseArgs(rest);
    const result = await runCheck(args.path, { ci: args.ci || isCiEnvironment() });
    await writeOutput(args.json ? JSON.stringify(result, null, 2) : formatCheckResult(result));
    process.exit(result.exitCode);
  }

  if (command === "init") {
    const args = parseArgs(rest);
    const result = await initGuidance(args.path, { force: args.force });

    if (result.created) {
      console.log(`Created ${result.configPath}`);
    } else {
      console.log(`Config already exists: ${result.configPath}`);
    }

    process.exit(0);
  }

  if (command === "migrate") {
    const args = parseArgs(rest);
    const result = await migrateGuidanceConfig({
      targetPath: args.path,
      to: args.to,
      rollback: args.rollback,
      resume: args.resume,
      dryRun: args.dryRun,
      write: args.write,
      yes: args.yes,
    });
    await writeOutput(
      args.json
        ? JSON.stringify(result, null, 2)
        : `Guidance migration ${result.changed ? "changed" : "unchanged"} ${result.configPath} (${result.beforeMode} -> ${result.afterMode}, ${result.migrationState})`,
    );
    process.exit(0);
  }

  console.error(`Unknown command: ${command}`);
  printUsage();
  process.exit(1);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`design-system-guidance failed: ${message}`);
  if (error instanceof GuidanceError) {
    process.exit(error.exitCode);
  }
  process.exit(1);
});
