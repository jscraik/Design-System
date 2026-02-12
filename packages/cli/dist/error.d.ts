import type { JsonError, JsonValue } from "./types.js";
import type { ErrorCode } from "./types.js";
import { ERROR_CODES, EXIT_CODES, TOKEN_GENERATE_WARNING, COMPONENTS_WRITE_WARNING } from "./constants.js";
export declare class CliError extends Error {
    code: ErrorCode;
    exitCode: number;
    hint?: string;
    details?: Record<string, JsonValue>;
    constructor(message: string, options: {
        code: ErrorCode;
        exitCode: number;
        hint?: string;
        details?: Record<string, JsonValue>;
    });
}
export declare function normalizeFailure(msg?: string, err?: Error): CliError;
export declare function toJsonError(error: CliError): JsonError;
export declare function requireExec(opts: Record<string, unknown>, action: string): void;
export declare function requireNetwork(opts: Record<string, unknown>, action: string): void;
export { ERROR_CODES, EXIT_CODES, TOKEN_GENERATE_WARNING, COMPONENTS_WRITE_WARNING };
//# sourceMappingURL=error.d.ts.map