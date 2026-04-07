import { distance } from "fastest-levenshtein";

export interface Suggestion {
  type: "command" | "flag" | "value";
  input: string;
  suggestion: string;
  confidence: number;
}

const SUGGESTION_THRESHOLD = 0.6;

function calculateConfidence(input: string, match: string): number {
  const maxLen = Math.max(input.length, match.length);
  if (maxLen === 0) return 1;
  const dist = distance(input.toLowerCase(), match.toLowerCase());
  return 1 - dist / maxLen;
}

export function suggestCommand(
  input: string,
  availableCommands: string[],
  threshold = SUGGESTION_THRESHOLD,
): Suggestion | undefined {
  let bestMatch: string | undefined;
  let bestConfidence = 0;

  for (const cmd of availableCommands) {
    const confidence = calculateConfidence(input, cmd);
    if (confidence > bestConfidence && confidence >= threshold) {
      bestConfidence = confidence;
      bestMatch = cmd;
    }
  }

  if (!bestMatch) return undefined;

  return {
    type: "command",
    input,
    suggestion: bestMatch,
    confidence: Math.round(bestConfidence * 100) / 100,
  };
}

export function suggestFlag(
  input: string,
  availableFlags: string[],
  threshold = SUGGESTION_THRESHOLD,
): Suggestion | undefined {
  // Normalize --flag to flag for comparison
  const normalized = input.replace(/^-+/, "");
  const normalizedFlags = availableFlags.map((f) => f.replace(/^-+/, ""));

  const result = suggestCommand(normalized, normalizedFlags, threshold);
  if (!result) return undefined;

  // Restore flag format in suggestion
  const originalFlag = availableFlags.find(
    (f) => f.replace(/^-+/, "").toLowerCase() === result.suggestion.toLowerCase(),
  );

  return {
    type: "flag",
    input,
    suggestion: originalFlag || result.suggestion,
    confidence: result.confidence,
  };
}

// Known available commands in the CLI
export const AVAILABLE_COMMANDS = [
  "help",
  "dev",
  "build",
  "test",
  "mcp",
  "tokens",
  "versions",
  "skills",
  "components",
  "lint",
  "format",
  "doctor",
];

// Known available global flags
export const AVAILABLE_FLAGS = [
  "--help",
  "--version",
  "--quiet",
  "--verbose",
  "--debug",
  "--json",
  "--plain",
  "--no-color",
  "--no-input",
  "--exec",
  "--network",
  "--cwd",
  "--config",
  "--dry-run",
  "--show-sensitive",
];
