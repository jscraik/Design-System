import { handleRun } from "../utils/exec.js";
import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";
export function formatCommand(args) {
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
//# sourceMappingURL=format.js.map