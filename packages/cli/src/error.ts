import {
  COMPONENTS_WRITE_WARNING,
  DEFAULT_HINT_USAGE,
  ERROR_CODES,
  EXIT_CODES,
  TOKEN_GENERATE_WARNING,
} from "./constants.js";
import type { ErrorCode, JsonError, JsonValue } from "./types.js";

export class CliError extends Error {
  code: ErrorCode;
  exitCode: number;
  hint?: string;
  details?: Record<string, JsonValue>;

  constructor(
    message: string,
    options: {
      code: ErrorCode;
      exitCode: number;
      hint?: string;
      details?: Record<string, JsonValue>;
    },
  ) {
    super(message);
    this.code = options.code;
    this.exitCode = options.exitCode;
    this.hint = options.hint;
    this.details = options.details;
  }
}

export function normalizeFailure(msg?: string, err?: Error): CliError {
  if (err instanceof CliError) return err;
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

export function toJsonError(error: CliError): JsonError {
  const jsonError: JsonError = {
    code: error.code,
    message: error.message,
  };
  if (error.hint) jsonError.hint = error.hint;
  if (error.details) jsonError.details = error.details;
  return jsonError;
}

export function requireExec(opts: Record<string, unknown>, action: string): void {
  if (opts.dryRun) return;
  if (!opts.exec) {
    throw new CliError(`${action} requires --exec`, {
      code: ERROR_CODES.policy,
      exitCode: EXIT_CODES.policy,
      hint: "Re-run with --exec to allow external command execution.",
    });
  }
}

export function requireNetwork(opts: Record<string, unknown>, action: string): void {
  if (opts.dryRun) return;
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
