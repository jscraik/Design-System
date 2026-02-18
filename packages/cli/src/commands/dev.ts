import type { CliArgs } from "../types.js";
import { handleRun } from "../utils/exec.js";

export function devCommand(args: { target?: string; argv: CliArgs }): Promise<number> {
  const { target, argv } = args;
  const resolvedTarget = target ?? "all";
  const map: Record<string, string[]> = {
    all: ["dev"],
    web: ["dev:web"],
    storybook: ["dev:storybook"],
    widgets: ["dev:widgets"],
    mcp: ["mcp:dev"],
  };
  const pnpmArgs = map[resolvedTarget] ?? ["dev"];
  return handleRun(argv, pnpmArgs, `dev ${resolvedTarget}`, resolvedTarget);
}
