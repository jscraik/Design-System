/**
 * Progressive Help System
 *
 * Provides multi-level help output for different user expertise levels:
 * - minimal: One-line usage only
 * - common: Standard help with common options (default)
 * - full: All options including advanced
 * - expert: All options plus hidden/internal flags
 *
 * Also supports topic-based help for specific subjects.
 */

export type HelpLevel = "minimal" | "common" | "full" | "expert";

export interface HelpTopic {
  name: string;
  title: string;
  description: string;
  content: string[];
}

// Available help topics
export const HELP_TOPICS: HelpTopic[] = [
  {
    name: "safety",
    title: "Safety Flags",
    description: "Permission flags for external operations",
    content: [
      "Safety flags are required for operations that could modify your system:",
      "",
      "  --exec     Allow external command execution (pnpm, npm, build tools)",
      "             Required for: dev, build, test, lint, format",
      "",
      "  --network  Allow network access",
      "             Required for: mcp commands, external API calls",
      "",
      "  --write    Allow file modifications",
      "             Required for: tokens generate, components new, versions sync",
      "",
      "  --dry-run  Preview changes without executing (safe, no flags needed)",
      "",
      "Examples:",
      "  astudio dev web --exec",
      "  astudio tokens generate --write --exec",
      "  astudio mcp tools list --network",
      "  astudio build web --dry-run  # Preview without building",
    ],
  },
  {
    name: "output",
    title: "Output Formats",
    description: "Control how command output is displayed",
    content: [
      "The CLI supports multiple output formats:",
      "",
      "  --json      Machine-readable JSON with stable schema",
      "              Schema: astudio.command.v1",
      "              Best for: scripting, automation, AI agents",
      "",
      "  --plain     Stable key=value line output",
      "              Best for: shell scripts, simple parsing",
      "",
      "  (default)   Human-readable with colors and formatting",
      "              Best for: interactive use",
      "",
      "Additional output flags:",
      "  --no-color  Disable colored output",
      "  --quiet     Show errors only (suppress warnings)",
      "  --verbose   Show detailed output with timings",
      "  --debug     Show internal diagnostics",
      "",
      "Examples:",
      "  astudio doctor --json",
      "  astudio doctor --plain",
      "  astudio build web --exec --json | jq '.status'",
    ],
  },
  {
    name: "agent",
    title: "AI Agent Mode",
    description: "Enhanced support for AI coding agents",
    content: [
      "The CLI includes special support for AI agents via the --agent flag:",
      "",
      "  astudio --agent <command>",
      "",
      "Features:",
      "  - Intent-over-syntax: More forgiving of minor typos",
      "  - Educational errors: Detailed explanations with examples",
      "  - Auto-accept: High-confidence suggestions marked for acceptance",
      "  - Learning notes: Explains correct command patterns",
      "",
      "For AI agents, also use --json for parseable output:",
      "  astudio --agent doctor --json",
      "",
      "The CLI provides these helpful fields in JSON errors:",
      "  - did_you_mean[]: Array of suggestions with confidence scores",
      "  - fix_suggestion: Corrected command string",
      "  - details.agent_guidance: Detailed help text",
      "  - details.examples[]: Relevant command examples",
      "",
      "See AGENTS.md for comprehensive agent documentation.",
    ],
  },
  {
    name: "tracing",
    title: "Observability and Tracing",
    description: "Trace context propagation for distributed systems",
    content: [
      "The CLI supports distributed tracing via trace IDs:",
      "",
      "Environment variables:",
      "  TRACEPARENT          W3C trace context (e.g., 00-abc...-def...-01)",
      "  _X_AMZN_TRACE_ID     AWS X-Ray trace header",
      "  ASTUDIO_TRACE_ID     Direct trace ID injection",
      "  ASTUDIO_TRACE_SAMPLE_RATE  Sampling rate (0.0-1.0, default: 1.0)",
      "",
      "JSON output includes:",
      "  meta.trace_id     32-character hex trace ID",
      "  meta.request_id   16-character hex request ID",
      "  meta.parent_id    Parent span ID (if propagated)",
      "",
      "Examples:",
      "  TRACEPARENT=00-4bf92f...-00f067...-01 astudio doctor --json",
      "  ASTUDIO_TRACE_ID=abc123... astudio build web --exec --json",
    ],
  },
];

/**
 * Parse help level from --help=level syntax
 */
export function parseHelpLevel(arg: string): HelpLevel | undefined {
  if (arg === "--help=minimal") return "minimal";
  if (arg === "--help=common") return "common";
  if (arg === "--help=full") return "full";
  if (arg === "--help=expert") return "expert";
  return undefined;
}

/**
 * Get help topic by name
 */
export function getHelpTopic(name: string): HelpTopic | undefined {
  return HELP_TOPICS.find((t) => t.name === name);
}

/**
 * List all available help topics
 */
export function listHelpTopics(): string {
  const lines: string[] = ["Available help topics:", ""];
  for (const topic of HELP_TOPICS) {
    lines.push(`  ${topic.name.padEnd(12)} ${topic.description}`);
  }
  lines.push("");
  lines.push("Usage: astudio --help-topic=<topic>");
  lines.push("Example: astudio --help-topic=safety");
  return lines.join("\n");
}

/**
 * Check if an argument is a topic help request
 */
export function isTopicHelpRequest(arg: string): string | undefined {
  if (arg.startsWith("--help-topic=")) {
    return arg.slice("--help-topic=".length);
  }
  return undefined;
}

/**
 * Generate topic help content
 */
export function generateTopicHelp(topicName: string): string | undefined {
  const topic = getHelpTopic(topicName);
  if (!topic) return undefined;

  const lines: string[] = [
    `${topic.title}`,
    `${"=".repeat(topic.title.length)}`,
    "",
    ...topic.content,
    "",
    `See also: astudio --help-topic=output | astudio --help-topic=safety`,
  ];

  return lines.join("\n");
}

/**
 * Get minimal help (one-line usage)
 */
export function getMinimalHelp(command?: string): string {
  if (command) {
    return `astudio ${command} --help for command usage. Try: astudio --help-topic=safety`;
  }
  return "astudio [global flags] <command> [args] | astudio --help-topic=safety";
}
