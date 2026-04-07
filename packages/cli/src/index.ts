#!/usr/bin/env node
import yargs, { type Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import { componentsCommand } from "./commands/components.js";
import { doctorCommand } from "./commands/doctor.js";
import { formatCommand } from "./commands/format.js";
import { buildCommand, devCommand, mcpCommand, testCommand } from "./commands/index.js";
import { lintCommand } from "./commands/lint.js";
import { skillsCommand } from "./commands/skills.js";
import { tokensCommand } from "./commands/tokens.js";
import { versionsCommand } from "./commands/versions.js";
import { COMMAND_SCHEMA, ERROR_CODES, EXIT_CODES, TOOL_NAME, TOOL_VERSION } from "./constants.js";
import { CliError, normalizeFailure, toJsonError } from "./error.js";
import type { CliArgs } from "./types.js";
import {
  generateAgentErrorHelp,
  generateLearningNote,
  getCommandExamples,
  getSuggestionThreshold,
  isAgentMode,
  setAgentMode,
  shouldAutoAccept,
} from "./utils/agent.js";
import {
  generateTopicHelp,
  getMinimalHelp,
  isTopicHelpRequest,
  listHelpTopics,
  parseHelpLevel,
} from "./utils/help.js";
import {
  createEnvelope,
  outputJson,
  outputPlainRecord,
  setShowSensitive,
  setTraceContext,
} from "./utils/output.js";
import {
  AVAILABLE_COMMANDS,
  AVAILABLE_FLAGS,
  suggestCommand,
  suggestFlag,
} from "./utils/suggest.js";
import { createTraceContext } from "./utils/trace.js";

// Global agent mode state
let agentModeActive = false;

// Check for --help-topic= and --help=level before yargs processing
const rawArgs = process.argv.slice(2);
const topicArg = rawArgs.find((arg) => arg.startsWith("--help-topic="));
const helpLevelArg = rawArgs.find(
  (arg) => arg.startsWith("--help=") && !arg.startsWith("--help-topic="),
);

// Handle --help-topic=<topic>
if (topicArg) {
  const topicName = topicArg.slice("--help-topic=".length);
  const help = generateTopicHelp(topicName);
  if (help) {
    process.stdout.write(`${help}\n`);
    process.exit(0);
  }
  process.stderr.write(`Error: Unknown help topic "${topicName}"\n\n${listHelpTopics()}\n`);
  process.exit(2);
}

// Handle --help=minimal
if (helpLevelArg === "--help=minimal") {
  process.stdout.write(`${getMinimalHelp()}\n`);
  process.exit(0);
}

// Initialize global trace context for this CLI invocation
setTraceContext(createTraceContext());

// Import helper constants
const _MCP_SERVER_URL_KEY = "server-url";
const _MCP_ENDPOINT_KEY = "endpoint";
const _MCP_PROTOCOL_VERSION_KEY = "protocol-version";
const _TOKEN_GENERATE_WARNING = "--write is required to generate tokens";
const _VERSIONS_WRITE_WARNING = "--write is required to sync versions";
const _COMPONENTS_WRITE_WARNING = "--write is required to generate components";
const _TOKEN_WRITE_HINT = "Re-run with --write to confirm file writes.";

// Re-export error class constants for use in other modules
export {
  COMPONENTS_WRITE_WARNING,
  ERROR_CODES,
  EXIT_CODES,
  TOKEN_GENERATE_WARNING,
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
    .option("dry-run", { type: "boolean", description: "Preview without changes" })
    .option("agent", {
      type: "boolean",
      description: "AI agent mode: enhanced help, intent-over-syntax, educational errors",
    })
    .option("show-sensitive", {
      type: "boolean",
      description: "Show sensitive data (expert only)",
      hidden: true,
    });
}

function generateSuggestions(msg?: string): import("./types.js").Suggestion[] {
  if (!msg) return [];

  const suggestions: import("./types.js").Suggestion[] = [];
  const threshold = getSuggestionThreshold();

  // Try to extract unknown command
  const cmdMatch = msg.match(/Unknown command: (\S+)/);
  if (cmdMatch) {
    const unknown = cmdMatch[1];
    const suggestion = suggestCommand(unknown, AVAILABLE_COMMANDS, threshold);
    if (suggestion) suggestions.push(suggestion);
  }

  // Try to extract unknown argument/flag
  const argMatch = msg.match(/Unknown argument: (\S+)/) || msg.match(/Unknown option: (\S+)/);
  if (argMatch) {
    const unknown = argMatch[1];
    const suggestion = suggestFlag(unknown, AVAILABLE_FLAGS, threshold);
    if (suggestion) suggestions.push(suggestion);
  }

  return suggestions;
}

function generateFixSuggestion(
  failure: import("./error.js").CliError,
  argv: string[],
): string | undefined {
  if (failure.code !== ERROR_CODES.policy) return undefined;

  const missingFlags: string[] = [];

  if (failure.message.includes("--exec")) missingFlags.push("--exec");
  if (failure.message.includes("--network")) missingFlags.push("--network");
  if (failure.message.includes("--write")) missingFlags.push("--write");

  if (missingFlags.length === 0) return undefined;

  // Find the command in argv (skip node and script path)
  const commandIdx = argv.findIndex((arg) =>
    AVAILABLE_COMMANDS.some((cmd) => arg === cmd || arg.startsWith(`${cmd} `)),
  );

  if (commandIdx === -1) {
    // Fallback: reconstruct from what we have
    return `astudio ${missingFlags.join(" ")}`;
  }

  // Build fixed command
  const baseCommand = argv.slice(commandIdx).join(" ");
  return `astudio ${baseCommand} ${missingFlags.join(" ")}`;
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
    if (argv.showSensitive) {
      setShowSensitive(true);
    }
    if (argv.agent) {
      setAgentMode(true);
      agentModeActive = true;
    }
  })
  .command(
    "help-topics",
    "List available help topics",
    () => {},
    () => {
      process.stdout.write(`${listHelpTopics()}\n`);
    },
  )
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
    const isAgent = isAgentMode();
    const failure = normalizeFailure(msg, err ?? undefined);

    // Generate suggestions for unknown commands/flags
    const suggestions = generateSuggestions(msg);
    const fixSuggestion = generateFixSuggestion(failure, process.argv);

    // In agent mode, check if we should auto-accept a high-confidence suggestion
    const autoAcceptSuggestion = suggestions.length > 0 && shouldAutoAccept(suggestions[0]);

    // Enhance error with suggestions and agent-mode learning notes
    const enhancedError: import("./types.js").JsonError = {
      ...toJsonError(failure),
      ...(suggestions.length > 0 && { did_you_mean: suggestions }),
      ...(fixSuggestion && { fix_suggestion: fixSuggestion }),
    };

    // Add agent guidance to error details
    if (isAgent) {
      const cmdMatch = msg?.match(/Unknown command: (\S+)/);
      const cmd = cmdMatch ? cmdMatch[1] : undefined;

      enhancedError.details = {
        ...enhancedError.details,
        agent_guidance: generateAgentErrorHelp(
          cmd,
          failure.code === ERROR_CODES.policy ? "policy_error" : "unknown_command",
        ),
        examples: cmd ? getCommandExamples(cmd) : [],
      };
    }

    if (wantsJson) {
      outputJson(createEnvelope("error", "error", {}, [enhancedError]));
    } else if (wantsPlain) {
      outputPlainRecord({
        schema: COMMAND_SCHEMA,
        summary: "error",
        status: "error",
        error_code: failure.code,
        error_message: failure.message,
        hint: failure.hint ?? null,
        ...(suggestions.length > 0 && {
          suggestions: suggestions.map((s) => `${s.input} -> ${s.suggestion}`).join(", "),
        }),
        ...(fixSuggestion && { fix_suggestion: fixSuggestion }),
      });
    } else {
      process.stderr.write(`Error: ${failure.message}\n`);

      // Show suggestions in human-readable format
      if (suggestions.length > 0) {
        process.stderr.write("\nDid you mean:\n");
        for (const s of suggestions) {
          const autoMark = isAgent && shouldAutoAccept(s) ? " [auto-accept in agent mode]" : "";
          process.stderr.write(
            `  ${s.suggestion.padEnd(20)} (confidence: ${s.confidence})${autoMark}\n`,
          );
        }
      }

      if (fixSuggestion) {
        process.stderr.write(`\nFix suggestion:\n  ${fixSuggestion}\n`);
      }

      // Agent mode: show educational content
      if (isAgent) {
        const cmdMatch = msg?.match(/Unknown command: (\S+)/);
        const cmd = cmdMatch ? cmdMatch[1] : undefined;

        process.stderr.write(
          generateAgentErrorHelp(
            cmd,
            failure.code === ERROR_CODES.policy ? "policy_error" : "unknown_command",
          ),
        );

        // Show examples for suggested command
        if (suggestions.length > 0) {
          const suggestedCmd = suggestions[0].suggestion;
          const examples = getCommandExamples(suggestedCmd);
          if (examples.length > 0) {
            process.stderr.write("\n📖 Example usage:\n");
            for (const ex of examples.slice(0, 3)) {
              process.stderr.write(`  ${ex}\n`);
            }
          }
        }
      }

      if (failure.hint && (suggestions.length === 0 || !isAgent)) {
        process.stderr.write(`Hint: ${failure.hint}\n`);
      }

      if (failure.code === ERROR_CODES.usage || failure.code === ERROR_CODES.validation) {
        yargsInstance.showHelp();
      }
    }

    // In agent mode with auto-accept, we might want to exit with a special code
    // or potentially auto-execute (disabled for safety)
    if (isAgent && autoAcceptSuggestion && !wantsJson && !wantsPlain) {
      process.stderr.write(
        `\n🤖 Agent Mode: High confidence match. In future, use: astudio ${suggestions[0].suggestion}\n`,
      );
    }

    process.exitCode = failure.exitCode;
  });

void addGlobalOptions(cli)
  .parseAsync()
  .catch(() => {
    // Errors are handled by the yargs fail handler.
  });
