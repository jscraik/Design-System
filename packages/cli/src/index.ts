#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs, { type Argv } from "yargs";
import type { CliArgs } from "./types.js";
import {
  TOOL_NAME,
  TOOL_VERSION,
  COMMAND_SCHEMA,
  EXIT_CODES,
  ERROR_CODES,
  MCP_CONFIG_OPTIONS,
} from "./constants.js";
import { normalizeFailure, toJsonError, CliError } from "./error.js";
import { outputJson, outputPlainRecord, createEnvelope } from "./utils/output.js";
import { devCommand, buildCommand, testCommand, mcpCommand } from "./commands/index.js";
import { tokensCommand } from "./commands/tokens.js";
import { versionsCommand } from "./commands/versions.js";
import { skillsCommand } from "./commands/skills.js";
import { componentsCommand } from "./commands/components.js";
import { lintCommand } from "./commands/lint.js";
import { formatCommand } from "./commands/format.js";
import { doctorCommand } from "./commands/doctor.js";

// Import helper constants
const MCP_SERVER_URL_KEY = "server-url";
const MCP_ENDPOINT_KEY = "endpoint";
const MCP_PROTOCOL_VERSION_KEY = "protocol-version";
const TOKEN_GENERATE_WARNING = "--write is required to generate tokens";
const VERSIONS_WRITE_WARNING = "--write is required to sync versions";
const COMPONENTS_WRITE_WARNING = "--write is required to generate components";
const TOKEN_WRITE_HINT = "Re-run with --write to confirm file writes.";

// Re-export error class constants for use in other modules
export {
  ERROR_CODES,
  EXIT_CODES,
  TOKEN_GENERATE_WARNING,
  COMPONENTS_WRITE_WARNING,
} from "./constants.js";

function addGlobalOptions(argv: Argv): Argv {
  return argv
    .option("quiet", { alias: "q", type: "boolean", description: "Errors only" })
    .option("verbose", { alias: "v", type: "boolean", description: "More detail + timings" })
    .option("debug", { alias: "d", type: "boolean", description: "Internal diagnostics" })
    .option("json", { type: "boolean", description: "Machine output (single JSON object)" })
    .option("plain", { type: "boolean", description: "Stable line-based output" })
    .option("no-color", { type: "boolean", description: "Disable color" })
    .option("no-input", { type: "boolean", description: "Disable prompts" })
    .option("exec", { type: "boolean", description: "Allow external command execution" })
    .option("network", { type: "boolean", description: "Allow network access" })
    .option("cwd", { type: "string", description: "Run as if from this directory" })
    .option("config", { type: "string", description: "Config file override" })
    .option("dry-run", { type: "boolean", description: "Preview without changes" });
}

const cli = yargs(hideBin(process.argv))
  .scriptName(TOOL_NAME)
  .help("help")
  .alias("h", "help")
  .version("version", "Print version", TOOL_VERSION)
  .wrap(Math.min(100, process.stdout.columns ?? 100))
  .strict()
  .strictCommands()
  .showHelpOnFail(false)
  .middleware(async (argv) => {
    if (argv.json && argv.plain) {
      throw new CliError("--json and --plain are mutually exclusive", {
        code: ERROR_CODES.usage,
        exitCode: EXIT_CODES.usage,
        hint: "Choose one output mode.",
      });
    }
  })
  .command(
    "help [command]",
    "Show help for a command",
    (cmd) => cmd.positional("command", { type: "string" }),
    (argv) => {
      if (argv.command) {
        cli.parse([argv.command as string, "--help"]);
      } else {
        cli.showHelp();
      }
    },
  )
  .command(
    "dev [target]",
    "Start development servers",
    (cmd) =>
      cmd.positional("target", {
        type: "string",
        choices: ["web", "storybook", "widgets", "mcp", "all"],
      }),
    async (argv) => {
      process.exitCode = await devCommand({
        target: argv.target as string | undefined,
        argv: argv as CliArgs,
      });
    },
  )
  .command(
    "build [target]",
    "Build targets",
    (cmd) =>
      cmd
        .positional("target", {
          type: "string",
          choices: ["web", "widgets", "lib", "macos", "all"],
        })
        .option("clean", { type: "boolean", description: "Force clean build" }),
    async (argv) => {
      process.exitCode = await buildCommand({
        target: argv.target as string | undefined,
        clean: argv.clean as boolean | undefined,
        argv: argv as CliArgs,
      });
    },
  )
  .command(
    "test [suite]",
    "Run test suites",
    (cmd) =>
      cmd
        .positional("suite", {
          type: "string",
          choices: [
            "ui",
            "e2e-web",
            "a11y-widgets",
            "visual-web",
            "visual-storybook",
            "swift",
            "mcp-contract",
            "all",
          ],
        })
        .option("update", { type: "boolean", description: "Update snapshots" }),
    async (argv) => {
      process.exitCode = await testCommand({
        suite: argv.suite as string | undefined,
        update: argv.update as boolean | undefined,
        argv: argv as CliArgs,
      });
    },
  )
  .command(
    "mcp",
    "MCP server utilities",
    (yargs) => mcpCommand(yargs),
    () => {
      process.exitCode = EXIT_CODES.usage;
    },
  )
  .command(
    "tokens <command>",
    "Generate or validate design tokens",
    (cmd) =>
      cmd
        .positional("command", { type: "string", choices: ["generate", "validate"] })
        .option("write", { type: "boolean", description: "Required to generate tokens" }),
    async (argv) => {
      process.exitCode = await tokensCommand({
        command: argv.command as "generate" | "validate",
        write: argv.write as boolean | undefined,
        argv: argv as CliArgs,
      });
    },
  )
  .command(
    "versions <command>",
    "Sync version metadata across workspace",
    (cmd) =>
      cmd
        .positional("command", { type: "string", choices: ["sync", "sync-swift"] })
        .option("write", { type: "boolean", description: "Required to perform sync" }),
    async (argv) => {
      process.exitCode = await versionsCommand({
        command: argv.command as "sync" | "sync-swift",
        write: argv.write as boolean | undefined,
        argv: argv as CliArgs,
      });
    },
  )
  .command(
    "skills",
    "Discover, install, and publish skills (Clawdhub)",
    (yargs) => skillsCommand(yargs),
    () => {
      process.exitCode = EXIT_CODES.usage;
    },
  )
  .command(
    "components new <name>",
    "Generate a new UI component",
    (cmd) =>
      cmd
        .positional("name", { type: "string", demandOption: true })
        .option("write", { type: "boolean", description: "Required to generate files" }),
    async (argv) => {
      process.exitCode = await componentsCommand({
        name: argv.name as string,
        write: argv.write as boolean | undefined,
        argv: argv as CliArgs,
      });
    },
  )
  .command(
    "lint",
    "Run lint checks",
    (cmd) => cmd.option("compliance", { type: "boolean" }),
    async (argv) => {
      process.exitCode = await lintCommand({
        compliance: argv.compliance as boolean | undefined,
        argv: argv as CliArgs,
      });
    },
  )
  .command(
    "format",
    "Format code or check formatting",
    (cmd) => cmd.option("check", { type: "boolean" }).option("write", { type: "boolean" }),
    async (argv) => {
      process.exitCode = await formatCommand({
        check: argv.check as boolean | undefined,
        write: argv.write as boolean | undefined,
        argv: argv as CliArgs,
      });
    },
  )
  .command(
    "doctor",
    "Check environment and repo health",
    (cmd) => cmd,
    async (argv) => {
      process.exitCode = await doctorCommand(argv as CliArgs);
    },
  )
  .fail((msg, err, yargsInstance) => {
    const parsedArgv = (yargsInstance as { parsed?: { argv?: CliArgs } }).parsed?.argv;
    const wantsJson = Boolean(parsedArgv?.json || process.argv.includes("--json"));
    const wantsPlain = Boolean(parsedArgv?.plain || process.argv.includes("--plain"));
    const failure = normalizeFailure(msg, err ?? undefined);

    if (wantsJson) {
      outputJson(createEnvelope("error", "error", {}, [toJsonError(failure)]));
    } else if (wantsPlain) {
      outputPlainRecord({
        schema: COMMAND_SCHEMA,
        summary: "error",
        status: "error",
        error_code: failure.code,
        error_message: failure.message,
        hint: failure.hint ?? null,
      });
    } else {
      process.stderr.write(`Error: ${failure.message}\n`);
      if (failure.hint) {
        process.stderr.write(`Hint: ${failure.hint}\n`);
      }
      if (failure.code === ERROR_CODES.usage || failure.code === ERROR_CODES.validation) {
        yargsInstance.showHelp();
      }
    }
    process.exitCode = failure.exitCode;
  });

void addGlobalOptions(cli)
  .parseAsync()
  .catch(() => {
    // Errors are handled by the yargs fail handler.
  });
