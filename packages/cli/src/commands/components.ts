import { TOKEN_WRITE_HINT } from "../constants.js";
import { CliError, COMPONENTS_WRITE_WARNING, ERROR_CODES, EXIT_CODES } from "../error.js";
import type { CliArgs } from "../types.js";
import { handleRun } from "../utils/exec.js";

export async function componentsCommand(args: {
  name: string;
  write?: boolean;
  argv: CliArgs;
}): Promise<number> {
  const { name, write, argv } = args;

  if (!write) {
    throw new CliError(COMPONENTS_WRITE_WARNING, {
      code: ERROR_CODES.policy,
      exitCode: EXIT_CODES.policy,
      hint: TOKEN_WRITE_HINT,
    });
  }

  return handleRun(argv, ["new:component", "--", name], `components new ${name}`, name);
}
