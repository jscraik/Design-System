import { ERROR_CODES, EXIT_CODES, DEFAULT_HINT_USAGE, TOKEN_GENERATE_WARNING, COMPONENTS_WRITE_WARNING, } from "./constants.js";
export class CliError extends Error {
    code;
    exitCode;
    hint;
    details;
    constructor(message, options) {
        super(message);
        this.code = options.code;
        this.exitCode = options.exitCode;
        this.hint = options.hint;
        this.details = options.details;
    }
}
export function normalizeFailure(msg, err) {
    if (err instanceof CliError)
        return err;
    if (msg) {
        return new CliError(msg, {
            code: ERROR_CODES.usage,
            exitCode: EXIT_CODES.usage,
            hint: DEFAULT_HINT_USAGE,
        });
    }
    if (err) {
        return new CliError(err.message, {
            code: ERROR_CODES.internal,
            exitCode: EXIT_CODES.failure,
        });
    }
    return new CliError("Unknown error", {
        code: ERROR_CODES.internal,
        exitCode: EXIT_CODES.failure,
    });
}
export function toJsonError(error) {
    const jsonError = {
        code: error.code,
        message: error.message,
    };
    if (error.hint)
        jsonError.hint = error.hint;
    if (error.details)
        jsonError.details = error.details;
    return jsonError;
}
export function requireExec(opts, action) {
    if (opts.dryRun)
        return;
    if (!opts.exec) {
        throw new CliError(`${action} requires --exec`, {
            code: ERROR_CODES.policy,
            exitCode: EXIT_CODES.policy,
            hint: "Re-run with --exec to allow external command execution.",
        });
    }
}
export function requireNetwork(opts, action) {
    if (opts.dryRun)
        return;
    if (!opts.network) {
        throw new CliError(`${action} requires --network`, {
            code: ERROR_CODES.policy,
            exitCode: EXIT_CODES.policy,
            hint: "Re-run with --network to allow network access.",
        });
    }
}
// Re-export constants for convenience
export { ERROR_CODES, EXIT_CODES, TOKEN_GENERATE_WARNING, COMPONENTS_WRITE_WARNING };
//# sourceMappingURL=error.js.map