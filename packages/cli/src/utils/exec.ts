import { spawn } from "node:child_process";
import { CliError, ERROR_CODES, EXIT_CODES, requireExec, toJsonError } from "../error.js";
import type { GlobalOptions, JsonError, JsonValue, RunResult } from "../types.js";
import { baseEnv, resolveCwd, resolvePnpmCommand } from "./env.js";
import { logInfo } from "./logger.js";
import { createEnvelope, getTraceContext, outputJson, outputPlainRecord } from "./output.js";

type ExternalExitStatus = {
  code: number | null;
  signal: NodeJS.Signals | null;
  timedOut?: boolean;
};

type NormalizedExternalExit = {
  exitCode: number;
  failureKind?: RunResult["failureKind"];
};

const EXEC_TIMEOUT_ENV = "ASTUDIO_EXEC_TIMEOUT_MS";

function parseExecutionTimeoutMs(env: NodeJS.ProcessEnv): number | undefined {
  const value = env[EXEC_TIMEOUT_ENV];
  if (!value) return undefined;
  const timeoutMs = Number.parseInt(value, 10);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return undefined;
  return timeoutMs;
}

export function normalizeExternalExit(status: ExternalExitStatus): NormalizedExternalExit {
  if (status.timedOut) {
    return { exitCode: EXIT_CODES.failure, failureKind: "timeout" };
  }
  if (status.signal === "SIGINT") {
    return { exitCode: EXIT_CODES.abort, failureKind: "signal" };
  }
  if (status.signal) {
    return { exitCode: EXIT_CODES.failure, failureKind: "signal" };
  }
  if (status.code === 0) {
    return { exitCode: EXIT_CODES.success };
  }
  return { exitCode: EXIT_CODES.failure, failureKind: "exit" };
}

export async function runPnpm(
  opts: GlobalOptions,
  args: string[],
  overrides?: { cwd?: string; env?: NodeJS.ProcessEnv },
): Promise<RunResult> {
  const started = Date.now();
  const cwd = overrides?.cwd ?? resolveCwd(opts);
  const traceContext = getTraceContext();
  const env = overrides?.env ?? baseEnv(opts, traceContext);
  const pnpmCommand = resolvePnpmCommand();

  const commandLabel = `${pnpmCommand} ${args.join(" ")}`;
  if (opts.dryRun) {
    return { command: commandLabel, exitCode: 0, durationMs: 0, dryRun: true, cwd };
  }

  if (!opts.json && !opts.plain && !opts.quiet) {
    logInfo(opts, `Running: ${commandLabel}`);
  }

  return new Promise<RunResult>((resolve) => {
    const captureOutput = opts.json || opts.plain;
    const stdio: "inherit" | ("pipe" | "inherit" | "ignore")[] = captureOutput
      ? ["inherit", "pipe", "pipe"]
      : opts.quiet
        ? ["inherit", "ignore", "inherit"]
        : "inherit";

    const child = spawn(pnpmCommand, args, { cwd, env, stdio });
    const timeoutMs = parseExecutionTimeoutMs(env);
    let timedOut = false;
    const timeout =
      timeoutMs === undefined
        ? undefined
        : setTimeout(() => {
            timedOut = true;
            child.kill("SIGTERM");
          }, timeoutMs);

    let stdout = "";
    let stderr = "";

    if (captureOutput && child.stdout) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
    }

    if (captureOutput && child.stderr) {
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("close", (code, signal) => {
      if (timeout) clearTimeout(timeout);
      const durationMs = Date.now() - started;
      const normalized = normalizeExternalExit({ code, signal, timedOut });
      const result: RunResult = {
        command: commandLabel,
        exitCode: normalized.exitCode,
        durationMs,
        stdout: stdout || undefined,
        stderr: stderr || undefined,
        cwd,
      };
      if (normalized.failureKind) result.failureKind = normalized.failureKind;
      resolve(result);
    });

    child.on("error", (err) => {
      if (timeout) clearTimeout(timeout);
      const durationMs = Date.now() - started;
      resolve({
        command: commandLabel,
        exitCode: EXIT_CODES.failure,
        durationMs,
        stderr: err instanceof Error ? err.message : "Failed to start command",
        cwd,
        failureKind: "start",
      });
    });
  });
}

export async function runCommandCapture(
  command: string,
  args: string[],
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr?.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("close", (code) => resolve({ code: code ?? 1, stdout, stderr }));
    child.on("error", (err) => {
      resolve({
        code: 1,
        stdout: "",
        stderr: err instanceof Error ? err.message : "Failed to start command",
      });
    });
  });
}

function buildRunResultData(result: RunResult): Record<string, JsonValue> {
  return {
    command: result.command,
    target: result.target ?? null,
    cwd: result.cwd ?? null,
    exit_code: result.exitCode,
    failure_kind: result.failureKind ?? null,
    duration_ms: result.durationMs,
    stdout: result.stdout ?? null,
    stderr: result.stderr ?? null,
    dry_run: Boolean(result.dryRun),
  };
}

function runResultErrorMessage(result: RunResult): string {
  switch (result.failureKind) {
    case "start":
      return "External command could not be started";
    case "signal":
      return result.exitCode === EXIT_CODES.abort
        ? "External command was aborted"
        : "External command was terminated";
    case "timeout":
      return "External command timed out";
    default:
      return "External command failed";
  }
}

function buildRunResultError(result: RunResult): JsonError[] {
  if (result.exitCode === 0) return [];
  return [
    toJsonError(
      new CliError(runResultErrorMessage(result), {
        code: ERROR_CODES.exec,
        exitCode: result.exitCode,
        details: {
          exit_code: result.exitCode,
          failure_kind: result.failureKind ?? "exit",
        },
      }),
    ),
  ];
}

export function emitResult(opts: GlobalOptions, result: RunResult, summary: string): void {
  const status = result.exitCode === 0 ? "success" : "error";

  if (opts.json) {
    outputJson(
      createEnvelope(summary, status, buildRunResultData(result), buildRunResultError(result)),
    );
    return;
  }

  if (opts.plain) {
    const includeOutput = opts.verbose || opts.debug || result.exitCode !== 0;
    const data = buildRunResultData(result);
    outputPlainRecord({
      schema: "astudio.command.v1",
      summary,
      status,
      command: data.command as string,
      target: data.target as string,
      cwd: data.cwd as string,
      exit_code: data.exit_code as number,
      duration_ms: data.duration_ms as number,
      dry_run: data.dry_run as boolean,
      stdout: includeOutput ? (data.stdout as string) : undefined,
      stderr: includeOutput ? (data.stderr as string) : undefined,
      error_code: result.exitCode === 0 ? undefined : ERROR_CODES.exec,
      error_message: result.exitCode === 0 ? undefined : runResultErrorMessage(result),
    });
  }
}

export async function handleRun(
  opts: Record<string, unknown>,
  args: string[],
  summary: string,
  target?: string,
): Promise<number> {
  requireExec(opts, summary);
  const result = await runPnpm(opts as GlobalOptions, args);
  result.target = target;
  if (opts.dryRun && !opts.json && !opts.plain) {
    process.stdout.write(`${result.command}\n`);
  }
  emitResult(opts as GlobalOptions, result, summary);
  if (opts.verbose && !opts.json && !opts.plain) {
    logInfo(opts as GlobalOptions, `Completed in ${result.durationMs}ms`);
  }
  return result.exitCode;
}
