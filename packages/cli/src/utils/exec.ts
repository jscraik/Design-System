import { spawn } from "node:child_process";
import { CliError, ERROR_CODES, EXIT_CODES, requireExec, toJsonError } from "../error.js";
import type { GlobalOptions, JsonError, JsonValue, RunResult } from "../types.js";
import { baseEnv, resolveCwd, resolvePnpmCommand } from "./env.js";
import { logInfo } from "./logger.js";
import { createEnvelope, outputJson, outputPlainRecord } from "./output.js";

export async function runPnpm(
  opts: GlobalOptions,
  args: string[],
  overrides?: { cwd?: string; env?: NodeJS.ProcessEnv },
): Promise<RunResult> {
  const started = Date.now();
  const cwd = overrides?.cwd ?? resolveCwd(opts);
  const env = overrides?.env ?? baseEnv(opts);
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

    child.on("close", (code) => {
      const durationMs = Date.now() - started;
      resolve({
        command: commandLabel,
        exitCode: code ?? 1,
        durationMs,
        stdout: stdout || undefined,
        stderr: stderr || undefined,
        cwd,
      });
    });

    child.on("error", (err) => {
      const durationMs = Date.now() - started;
      resolve({
        command: commandLabel,
        exitCode: 1,
        durationMs,
        stderr: err instanceof Error ? err.message : "Failed to start command",
        cwd,
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
    duration_ms: result.durationMs,
    stdout: result.stdout ?? null,
    stderr: result.stderr ?? null,
    dry_run: Boolean(result.dryRun),
  };
}

function buildRunResultError(result: RunResult): JsonError[] {
  if (result.exitCode === 0) return [];
  return [
    toJsonError(
      new CliError("Command failed", {
        code: ERROR_CODES.exec,
        exitCode: EXIT_CODES.failure,
        details: { exit_code: result.exitCode },
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
      error_message: result.exitCode === 0 ? undefined : "Command failed",
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
