import { handleRun } from "../utils/exec.js";
import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";
import { VERSIONS_WRITE_WARNING, TOKEN_WRITE_HINT } from "../constants.js";
export async function versionsCommand(args) {
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
//# sourceMappingURL=versions.js.map