import type { CliArgs } from "../types.js";
import { handleRun } from "../utils/exec.js";

export function lintCommand(args: { compliance?: boolean; argv: CliArgs }): Promise<number> {
  const { compliance, argv } = args;
  const pnpmArgs = compliance ? ["lint:compliance"] : ["lint"];
  return handleRun(argv, pnpmArgs, "lint", compliance ? "compliance" : "default");
}
