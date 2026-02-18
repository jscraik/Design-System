import { handleRun } from "../utils/exec.js";
import { CliError, ERROR_CODES, EXIT_CODES, COMPONENTS_WRITE_WARNING } from "../error.js";
import { TOKEN_WRITE_HINT } from "../constants.js";
export async function componentsCommand(args) {
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
//# sourceMappingURL=components.js.map