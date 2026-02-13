import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";
import type { CliArgs } from "../types.js";
import { handleRun } from "../utils/exec.js";

export function formatCommand(args: {
  check?: boolean;
  write?: boolean;
  argv: CliArgs;
}): Promise<number> {
  const { check, write, argv } = args;

  if (!check && !write) {
    throw new CliError("Specify --check or --write", {
      code: ERROR_CODES.usage,
      exitCode: EXIT_CODES.usage,
      hint: "Use --check for read-only or --write to format files.",
    });
  }

  const pnpmArgs = check ? ["format:check"] : ["format"];
  return handleRun(argv, pnpmArgs, "format", check ? "check" : "write");
}
