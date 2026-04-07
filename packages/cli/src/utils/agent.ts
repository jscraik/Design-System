/**
 * Agent Mode Utilities
 *
 * Provides enhanced support for AI coding agents using the CLI.
 * When --agent mode is enabled:
 * - Higher tolerance for typos (intent-over-syntax)
 * - More verbose/helpful error messages
 * - Educational feedback to help agents learn correct patterns
 * - Auto-accept high-confidence suggestions with warnings
 */

import type { Suggestion } from "../types.js";

// Agent mode state
let agentModeEnabled = false;

export function setAgentMode(enabled: boolean): void {
  agentModeEnabled = enabled;
}

export function isAgentMode(): boolean {
  return agentModeEnabled;
}

// Lower threshold for agent mode (more forgiving)
const AGENT_SUGGESTION_THRESHOLD = 0.5;
const NORMAL_SUGGESTION_THRESHOLD = 0.6;

export function getSuggestionThreshold(): number {
  return agentModeEnabled ? AGENT_SUGGESTION_THRESHOLD : NORMAL_SUGGESTION_THRESHOLD;
}

/**
 * Generate detailed, educational error message for agents
 */
export function generateAgentErrorHelp(
  command?: string,
  errorType?: "unknown_command" | "missing_flag" | "invalid_args" | "policy_error",
): string {
  const sections: string[] = [];

  if (agentModeEnabled) {
    sections.push(
      "🤖 Agent Mode Note: I'm providing extra detail to help you use this CLI correctly.\n",
    );
  }

  switch (errorType) {
    case "unknown_command":
      sections.push(`The command "${command}" wasn't recognized.`);
      sections.push("\nCommon command patterns:");
      sections.push("  astudio dev [web|storybook|widgets|mcp|all]     # Start dev servers");
      sections.push("  astudio build [web|widgets|lib|macos|all]       # Build targets");
      sections.push("  astudio test [ui|e2e-web|a11y-widgets|...]      # Run tests");
      sections.push("  astudio tokens [generate|validate]              # Token operations");
      sections.push("  astudio doctor                                  # Health check");
      break;

    case "missing_flag":
      sections.push("\n💡 Safety flags required:");
      sections.push("  --exec     Required for commands that run external processes");
      sections.push("  --network  Required for commands that make network requests");
      sections.push("  --write    Required for commands that modify files");
      sections.push("  --dry-run  Preview changes without applying them (safe)");
      sections.push("\nExample corrections:");
      sections.push("  ❌ astudio dev web");
      sections.push("  ✅ astudio dev web --exec");
      sections.push("\n  ❌ astudio tokens generate");
      sections.push("  ✅ astudio tokens generate --write");
      break;

    case "invalid_args":
      sections.push("\nValid arguments for this command:");
      sections.push("  See 'astudio <command> --help' for detailed options");
      break;

    case "policy_error":
      sections.push("\n🔒 Policy: This command requires explicit permission flags.");
      sections.push("Add the appropriate flag to proceed:");
      sections.push("  --exec     For running external commands (pnpm, npm, etc.)");
      sections.push("  --network  For HTTP requests, API calls, etc.");
      sections.push("  --write    For file creation/modification");
      break;
  }

  sections.push("\n📚 For comprehensive help:");
  sections.push("  astudio --help              # General help");
  sections.push("  astudio <command> --help    # Command-specific help");
  sections.push("  cat docs/cli/AGENTS.md      # AI agent guide");

  return sections.join("\n");
}

/**
 * Generate educational note when auto-fixing agent commands
 */
export function generateLearningNote(
  original: string,
  corrected: string,
  fixType: "typo" | "missing_flag" | "format",
): string {
  if (!agentModeEnabled) return "";

  switch (fixType) {
    case "typo":
      return (
        `\n📝 Learning note: You typed "${original}" but I understood you meant "${corrected}". ` +
        `The CLI uses specific command names. Use 'astudio --help' to see all available commands.`
      );

    case "missing_flag":
      return (
        `\n📝 Learning note: This command requires explicit permission flags for safety. ` +
        `Always include ${corrected.split(" ").pop()} when ${getFlagPurpose(corrected.split(" ").pop() || "")}.`
      );

    case "format":
      return (
        `\n📝 Learning note: Command format corrected from "${original}" to "${corrected}". ` +
        `Use --agent mode to get more helpful guidance.`
      );
  }
}

function getFlagPurpose(flag?: string): string {
  switch (flag) {
    case "--exec":
      return "running external processes";
    case "--network":
      return "making network requests";
    case "--write":
      return "modifying files";
    default:
      return "this operation";
  }
}

/**
 * Check if we should auto-accept a suggestion in agent mode
 */
export function shouldAutoAccept(suggestion: Suggestion): boolean {
  if (!agentModeEnabled) return false;
  // Auto-accept very high confidence suggestions in agent mode
  return suggestion.confidence >= 0.85;
}

/**
 * Format examples for a specific command
 */
export function getCommandExamples(command: string): string[] {
  const examples: Record<string, string[]> = {
    dev: ["astudio dev web --exec", "astudio dev storybook --exec", "astudio dev all --exec"],
    build: ["astudio build web --exec", "astudio build widgets --exec", "astudio build lib --exec"],
    test: [
      "astudio test ui --exec",
      "astudio test e2e-web --exec",
      "astudio test visual-storybook --exec --update",
    ],
    tokens: ["astudio tokens validate", "astudio tokens generate --write --exec"],
    mcp: ["astudio mcp tools list --network", "astudio mcp rpc tools/list --network --dry-run"],
    doctor: ["astudio doctor", "astudio doctor --json"],
  };

  return examples[command] || [];
}
