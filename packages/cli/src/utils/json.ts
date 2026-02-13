import fsp from "node:fs/promises";
import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";
import type { JsonValue } from "../types.js";

export async function readParamsInput(input?: string): Promise<JsonValue | undefined> {
  if (!input) return undefined;
  if (input === "-") {
    const stdin = await readStdin();
    return parseJsonString(stdin);
  }
  if (input.startsWith("@")) {
    const filePath = input.slice(1);
    try {
      const contents = await fsp.readFile(filePath, "utf8");
      return parseJsonString(contents);
    } catch {
      throw new CliError(`Unable to read params file: ${filePath}`, {
        code: ERROR_CODES.validation,
        exitCode: EXIT_CODES.usage,
        hint: "Provide a readable JSON file path or use '-' for stdin.",
      });
    }
  }
  return parseJsonString(input);
}

export function parseJsonString(text: string): JsonValue {
  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    throw new CliError("Invalid JSON input", {
      code: ERROR_CODES.validation,
      exitCode: EXIT_CODES.usage,
      hint: "Provide valid JSON, @file, or '-' for stdin.",
    });
  }
}

export async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}
