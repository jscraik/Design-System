import { COMPONENTS_WRITE_WARNING, ERROR_CODES, EXIT_CODES, TOKEN_GENERATE_WARNING } from "./constants.js";
import type { JsonError, JsonValue, RecoveryAction } from "./types.js";
export declare class CliError extends Error {
    code: string;
    exitCode: number;
    hint?: string;
    details?: Record<string, JsonValue>;
    recovery?: RecoveryAction;
    constructor(message: string, options: {
        code: string;
        exitCode: number;
        hint?: string;
        details?: Record<string, JsonValue>;
        recovery?: RecoveryAction;
    });
}
export declare function normalizeFailure(msg?: string, err?: Error): CliError;
export declare function toJsonError(error: CliError): JsonError;
export declare function requireExec(opts: Record<string, unknown>, action: string): void;
export declare function requireNetwork(opts: Record<string, unknown>, action: string): void;
export { COMPONENTS_WRITE_WARNING, ERROR_CODES, EXIT_CODES, TOKEN_GENERATE_WARNING };
//# sourceMappingURL=error.d.ts.map