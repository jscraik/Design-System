import { handleRun } from "../utils/exec.js";
export function devCommand(args) {
    const { target, argv } = args;
    const resolvedTarget = target ?? "all";
    const map = {
        all: ["dev"],
        web: ["dev:web"],
        storybook: ["dev:storybook"],
        widgets: ["dev:widgets"],
        mcp: ["mcp:dev"],
    };
    const pnpmArgs = map[resolvedTarget] ?? ["dev"];
    return handleRun(argv, pnpmArgs, `dev ${resolvedTarget}`, resolvedTarget);
}
//# sourceMappingURL=dev.js.map