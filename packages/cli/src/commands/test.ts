import type { CliArgs } from "../types.js";
import { handleRun } from "../utils/exec.js";
import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";

export function testCommand(args: {
  suite?: string;
  update?: boolean;
  argv: CliArgs;
}): Promise<number> {
  const { suite, update, argv } = args;
  const resolvedSuite = suite ?? "ui";

  if (update && !["visual-web", "visual-storybook"].includes(resolvedSuite)) {
    throw new CliError("--update is only valid for visual test suites", {
      code: ERROR_CODES.validation,
      exitCode: EXIT_CODES.usage,
      hint: "Use --update with visual-web or visual-storybook.",
    });
  }

  const map: Record<string, string[]> = {
    ui: ["test"],
    "e2e-web": ["test:e2e:web"],
    "a11y-widgets": ["test:a11y:widgets"],
    "visual-web": update ? ["test:visual:update"] : ["test:visual:web"],
    "visual-storybook": update ? ["test:visual:storybook:update"] : ["test:visual:storybook"],
    swift: ["test:swift"],
    "mcp-contract": ["test:mcp-contract"],
    all: ["test:cross-platform"],
  };

  const pnpmArgs = map[resolvedSuite] ?? ["test"];
  return handleRun(argv, pnpmArgs, `test ${resolvedSuite}`, resolvedSuite);
}
