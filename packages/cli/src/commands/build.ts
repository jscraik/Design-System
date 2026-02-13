import type { CliArgs } from "../types.js";
import { handleRun } from "../utils/exec.js";

export function buildCommand(args: {
  target?: string;
  clean?: boolean;
  argv: CliArgs;
}): Promise<number> {
  const { target, clean, argv } = args;
  const resolvedTarget = target ?? "all";
  const cleanFlag = clean ? ["--", "--no-incremental"] : [];
  const map: Record<string, string[]> = {
    all: ["build", ...cleanFlag],
    web: ["build:web", ...cleanFlag],
    widgets: ["build:widgets", ...cleanFlag],
    lib: ["build:lib", ...cleanFlag],
    macos: ["build:macos", ...cleanFlag],
  };
  const pnpmArgs = map[resolvedTarget] ?? ["build", ...cleanFlag];
  return handleRun(argv, pnpmArgs, `build ${resolvedTarget}`, resolvedTarget);
}
