import { TOKEN_WRITE_HINT, VERSIONS_WRITE_WARNING } from "../constants.js";
import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";
import type { CliArgs } from "../types.js";
import { handleRun } from "../utils/exec.js";

export async function versionsCommand(args: {
  command: "sync" | "sync-swift";
  write?: boolean;
  argv: CliArgs;
}): Promise<number> {
  const { command, write, argv } = args;

  if (!write) {
    throw new CliError(VERSIONS_WRITE_WARNING, {
      code: ERROR_CODES.policy,
      exitCode: EXIT_CODES.policy,
      hint: TOKEN_WRITE_HINT,
    });
  }

  const script = command === "sync" ? "sync:versions" : "sync:swift-versions";
  return handleRun(argv, [script], `versions ${command}`, command);
}
