import { TOKEN_WRITE_HINT } from "../constants.js";
import { CliError, ERROR_CODES, EXIT_CODES, TOKEN_GENERATE_WARNING } from "../error.js";
import type { CliArgs } from "../types.js";
import { handleRun } from "../utils/exec.js";

export async function tokensCommand(args: {
  command: "generate" | "validate";
  write?: boolean;
  argv: CliArgs;
}): Promise<number> {
  const { command, write, argv } = args;

  if (command === "generate") {
    if (!write) {
      throw new CliError(TOKEN_GENERATE_WARNING, {
        code: ERROR_CODES.policy,
        exitCode: EXIT_CODES.policy,
        hint: TOKEN_WRITE_HINT,
      });
    }
    return handleRun(argv, ["generate:tokens"], "tokens generate", "generate");
  }

  return handleRun(argv, ["validate:tokens"], "tokens validate", "validate");
}
