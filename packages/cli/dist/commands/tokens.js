import { handleRun } from "../utils/exec.js";
import { CliError, ERROR_CODES, EXIT_CODES, TOKEN_GENERATE_WARNING } from "../error.js";
import { TOKEN_WRITE_HINT } from "../constants.js";
export async function tokensCommand(args) {
    const { command, write, argv } = args;
    if (command === "generate") {
        if (!write) {
            throw new CliError(TOKEN_GENERATE_WARNING, {
                code: ERROR_CODES.policy,
                exitCode: EXIT_CODES.policy,
                hint: TOKEN_WRITE_HINT,
            });
        }
        return handleRun(argv, ["generate:tokens"], "tokens generate", "generate");
    }
    return handleRun(argv, ["validate:tokens"], "tokens validate", "validate");
}
//# sourceMappingURL=tokens.js.map