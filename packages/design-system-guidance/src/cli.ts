#!/usr/bin/env node

import { formatCheckResult, initGuidance, isCiEnvironment, runCheck } from "./index.js";

interface ParsedArgs {
  path: string;
  ci: boolean;
  force: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  let path = ".";
  let ci = false;
  let force = false;

  for (const value of argv) {
    if (value === "--ci") {
      ci = true;
      continue;
    }

    if (value === "--force") {
      force = true;
      continue;
    }

    if (value.startsWith("-")) {
      throw new Error(`Unknown flag: ${value}`);
    }

    path = value;
  }

  return { path, ci, force };
}

function printUsage(): void {
  console.log(
    `design-system-guidance\n\nUsage:\n  design-system-guidance check [path] [--ci]\n  design-system-guidance init [path] [--force]\n\nBehavior:\n  - check defaults to warnings and exit code 0.\n  - check fails with exit code 1 in CI mode (--ci or CI env).\n  - init writes .design-system-guidance.json in the target path.`,
  );
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
    console.log(formatCheckResult(result));
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

  console.error(`Unknown command: ${command}`);
  printUsage();
  process.exit(1);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`design-system-guidance failed: ${message}`);
  process.exit(1);
});
