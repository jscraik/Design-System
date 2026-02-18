import { handleRun } from "../utils/exec.js";
export function lintCommand(args) {
    const { compliance, argv } = args;
    const pnpmArgs = compliance ? ["lint:compliance"] : ["lint"];
    return handleRun(argv, pnpmArgs, "lint", compliance ? "compliance" : "default");
}
//# sourceMappingURL=lint.js.map