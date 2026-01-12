#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import yargs, { type Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import {
  RemoteSkillClient,
  installSkillFromZip,
  platformRootPath,
  platformStorageKey,
  type SkillPlatform,
  publishSkill,
} from "@astudio/skill-ingestion";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type ChatUIConfig = {
  mcp?: {
    serverUrl?: string;
    endpoint?: string;
    protocolVersion?: string;
  };
};

type GlobalOptions = {
  help?: boolean;
  version?: boolean;
  quiet?: boolean;
  verbose?: boolean;
  debug?: boolean;
  json?: boolean;
  plain?: boolean;
  noColor?: boolean;
  noInput?: boolean;
  exec?: boolean;
  network?: boolean;
  cwd?: string;
  config?: string;
  dryRun?: boolean;
};

type CliArgs = GlobalOptions & Record<string, unknown>;

type RunResult = {
  command: string;
  target?: string;
  cwd?: string;
  exitCode: number;
  durationMs: number;
  stdout?: string;
  stderr?: string;
  dryRun?: boolean;
};

type JsonError = {
  code: string;
  message: string;
  details?: Record<string, JsonValue>;
  hint?: string;
};

type JsonEnvelope = {
  schema: string;
  meta: {
    tool: string;
    version: string;
    timestamp: string;
    request_id?: string;
  };
  summary: string;
  status: "success" | "warn" | "error";
  data: Record<string, JsonValue>;
  errors: JsonError[];
};

const TOOL_NAME = "astudio";
const MCP_DEFAULT_SERVER = "http://127.0.0.1:8787";
const MCP_DEFAULT_ENDPOINT = "/mcp";
const MCP_DEFAULT_PROTOCOL_VERSION = "2024-11-05";
const COMMAND_SCHEMA = "astudio.command.v1";
const DEFAULT_HINT_USAGE = "Use --help to see available options.";
const MCP_ENDPOINT_OPTION = "MCP endpoint";
const MCP_PROTOCOL_VERSION_OPTION = "MCP protocol version";
const MCP_SERVER_URL_OPTION = "MCP server URL";
const MCP_ENDPOINT_KEY = "endpoint";
const MCP_PROTOCOL_VERSION_KEY = "protocol-version";
const MCP_SERVER_URL_KEY = "server-url";
const TOKEN_WRITE_HINT = "Re-run with --write to confirm file writes.";
const TOKEN_GENERATE_WARNING = "--write is required to generate tokens";
const VERSIONS_WRITE_WARNING = "--write is required to sync versions";
const COMPONENTS_WRITE_WARNING = "--write is required to generate components";
const MCP_DRY_RUN_LABEL = "dry_run";
const MCP_URL_LABEL = "url";
const MCP_CONFIG_OPTIONS = [
  [MCP_SERVER_URL_KEY, MCP_SERVER_URL_OPTION],
  [MCP_ENDPOINT_KEY, MCP_ENDPOINT_OPTION],
  [MCP_PROTOCOL_VERSION_KEY, MCP_PROTOCOL_VERSION_OPTION],
] as const;

const MCP_METHOD_TOOLS_LIST = "tools/list";
const MCP_CHECK_METHOD = MCP_METHOD_TOOLS_LIST;



const TOOL_VERSION = getToolVersion();
const EXIT_CODES = {
  success: 0,
  failure: 1,
  usage: 2,
  policy: 3,
  partial: 4,
  abort: 130,
} as const;

const ERROR_CODES = {
  usage: "E_USAGE",
  validation: "E_VALIDATION",
  policy: "E_POLICY",
  partial: "E_PARTIAL",
  auth: "E_AUTH",
  network: "E_NETWORK",
  internal: "E_INTERNAL",
  exec: "E_EXEC",
} as const;

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

class CliError extends Error {
  code: ErrorCode;
  exitCode: number;
  hint?: string;
  details?: Record<string, JsonValue>;

  constructor(
    message: string,
    options: { code: ErrorCode; exitCode: number; hint?: string; details?: Record<string, JsonValue> },
  ) {
    super(message);
    this.code = options.code;
    this.exitCode = options.exitCode;
    this.hint = options.hint;
    this.details = options.details;
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function parseBooleanEnv(value?: string): boolean | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return undefined;
}

function getToolVersion(): string {
  try {
    const packageUrl = new URL("../package.json", import.meta.url);
    const packagePath = fileURLToPath(packageUrl);
    const raw = fs.readFileSync(packagePath, "utf8");
    const parsed = JSON.parse(raw) as { version?: string };
    return parsed.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function shouldColor(opts: GlobalOptions): boolean {
  const colorPref = parseBooleanEnv(process.env.ASTUDIO_COLOR);
  if (opts.noColor) return false;
  if (opts.json || opts.plain) return false;
  if (process.env.NO_COLOR) return false;
  if (process.env.TERM === "dumb") return false;
  if (colorPref === false) return false;
  if (colorPref === true) return true;
  if (!process.stdout.isTTY) return false;
  return true;
}

function baseEnv(opts: GlobalOptions): NodeJS.ProcessEnv {
  const env = { ...process.env };
  if (!shouldColor(opts)) {
    env.NO_COLOR = "1";
    env.FORCE_COLOR = "0";
  } else if (parseBooleanEnv(process.env.ASTUDIO_COLOR) === true) {
    env.FORCE_COLOR = "1";
  }
  return env;
}

function logInfo(opts: GlobalOptions, message: string): void {
  if (opts.json || opts.plain || opts.quiet) return;
  process.stderr.write(`${message}\n`);
}

function logDebug(opts: GlobalOptions, message: string): void {
  if (!opts.debug || opts.json || opts.plain || opts.quiet) return;
  process.stderr.write(`[debug] ${message}\n`);
}

function logError(opts: GlobalOptions, message: string): void {
  if (opts.json || opts.plain) return;
  process.stderr.write(`${message}\n`);
}

function outputJson(envelope: JsonEnvelope): void {
  process.stdout.write(`${JSON.stringify(envelope)}\n`);
}

function outputPlain(lines: string[]): void {
  process.stdout.write(`${lines.join("\n")}\n`);
}

function formatPlainValue(value: JsonValue): string {
  return JSON.stringify(value);
}

function outputPlainRecord(record: Record<string, JsonValue | undefined>): void {
  const lines = Object.entries(record)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${formatPlainValue(value as JsonValue)}`);
  outputPlain(lines);
}

function emitSkillResults(
  argv: CliArgs,
  results: Array<{ slug: string; displayName: string; summary?: string; latestVersion?: string }>,
): void {
  if (argv.json) {
    outputJson(
      createEnvelope("skills.search", "success", {
        items: results.map((r) => ({
          slug: r.slug,
          name: r.displayName,
          summary: r.summary ?? null,
          version: r.latestVersion ?? null,
        })),
      }),
    );
    return;
  }
  const lines = results.map(
    (r) =>
      `${r.slug.padEnd(24, " ")} ${r.displayName}${
        r.latestVersion ? ` (v${r.latestVersion})` : ""
      }${r.summary ? ` — ${r.summary}` : ""}`,
  );
  outputPlain(lines);
}

function emitSkillInstall(argv: CliArgs, paths: string[], platform: SkillPlatform): void {
  if (argv.json) {
    outputJson(createEnvelope("skills.install", "success", { platform, paths }));
    return;
  }
  outputPlain(["Installed to:", ...paths.map((p) => `- ${p}`)]);
}

function emitPublishResult(
  argv: CliArgs,
  result: { version: string; skipped: boolean; command?: string[] },
  slug: string,
): void {
  if (argv.json) {
    outputJson(
      createEnvelope("skills.publish", "success", {
        slug,
        version: result.version,
        skipped: result.skipped,
        command: result.command ?? null,
      }),
    );
    return;
  }
  if (result.skipped) {
    outputPlain([`No changes detected for ${slug}; publish skipped.`]);
  } else if (result.command) {
    outputPlain([`[dry-run] ${result.command.join(" ")}`]);
  } else {
    outputPlain([`Published ${slug} v${result.version}`]);
  }
}

function createEnvelope(summary: string, status: JsonEnvelope["status"], data: Record<string, JsonValue>, errors: JsonError[] = []): JsonEnvelope {
  return {
    schema: COMMAND_SCHEMA,
    meta: { tool: TOOL_NAME, version: TOOL_VERSION, timestamp: nowIso() },
    summary,
    status,
    data,
    errors,
  };
}

function toJsonError(error: CliError): JsonError {
  const jsonError: JsonError = {
    code: error.code,
    message: error.message,
  };
  if (error.hint) jsonError.hint = error.hint;
  if (error.details) jsonError.details = error.details;
  return jsonError;
}

function normalizeFailure(msg?: string, err?: Error): CliError {
  if (err instanceof CliError) return err;
  if (msg) {
    return new CliError(msg, {
      code: ERROR_CODES.usage,
      exitCode: EXIT_CODES.usage,
      hint: DEFAULT_HINT_USAGE,
    });
  }
  if (err) {
    return new CliError(err.message, { code: ERROR_CODES.internal, exitCode: EXIT_CODES.failure });
  }
  return new CliError("Unknown error", { code: ERROR_CODES.internal, exitCode: EXIT_CODES.failure });
}

function requireExec(opts: CliArgs, action: string): void {
  if (opts.dryRun) return;
  if (!opts.exec) {
    throw new CliError(`${action} requires --exec`, {
      code: ERROR_CODES.policy,
      exitCode: EXIT_CODES.policy,
      hint: "Re-run with --exec to allow external command execution.",
    });
  }
}

function requireNetwork(opts: CliArgs, action: string): void {
  if (opts.dryRun) return;
  if (!opts.network) {
    throw new CliError(`${action} requires --network`, {
      code: ERROR_CODES.policy,
      exitCode: EXIT_CODES.policy,
      hint: "Re-run with --network to allow network access.",
    });
  }
}

function resolvePnpmCommand(): string {
  return process.env.ASTUDIO_PNPM?.trim() || "pnpm";
}

function mergeMcpConfigs(...configs: Array<ChatUIConfig["mcp"] | null | undefined>): ChatUIConfig["mcp"] | undefined {
  const merged: ChatUIConfig["mcp"] = {};
  for (const config of configs) {
    if (!config) continue;
    if (config.serverUrl !== undefined) merged.serverUrl = config.serverUrl;
    if (config.endpoint !== undefined) merged.endpoint = config.endpoint;
    if (config.protocolVersion !== undefined) merged.protocolVersion = config.protocolVersion;
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

function resolveMcpSettings(config: ChatUIConfig): {
  serverUrl: string;
  endpoint: string;
  protocolVersion: string;
  url: string;
} {
  const serverUrl = config.mcp?.serverUrl ?? MCP_DEFAULT_SERVER;
  const endpoint = config.mcp?.endpoint ?? MCP_DEFAULT_ENDPOINT;
  const protocolVersion = config.mcp?.protocolVersion ?? MCP_DEFAULT_PROTOCOL_VERSION;
  const url = new URL(endpoint, serverUrl);
  return { serverUrl, endpoint, protocolVersion, url: url.toString() };
}

async function readJsonFile(filePath: string): Promise<ChatUIConfig | null> {
  try {
    const contents = await fsp.readFile(filePath, "utf8");
    return JSON.parse(contents) as ChatUIConfig;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw new CliError(`Invalid config file at ${filePath}`, {
      code: ERROR_CODES.validation,
      exitCode: EXIT_CODES.usage,
      hint: "Fix the JSON or remove the config override.",
    });
  }
}

function findRepoRoot(start: string): string | null {
  let current = start;
  while (true) {
    const workspacePath = path.join(current, "pnpm-workspace.yaml");
    if (fs.existsSync(workspacePath)) return current;
    const next = path.dirname(current);
    if (next === current) return null;
    current = next;
  }
}

async function resolveConfig(opts: GlobalOptions): Promise<ChatUIConfig> {
  const cwd = resolveCwd(opts);
  const repoRoot = findRepoRoot(cwd);
  const projectConfigPath = repoRoot ? path.join(repoRoot, "astudio.config.json") : null;
  const userConfigPath = path.join(os.homedir(), ".config", "astudio", "config.json");
  const explicitConfigPath = opts.config ?? process.env.ASTUDIO_CONFIG ?? null;

  const systemConfig: ChatUIConfig = {};
  const userConfig = await readJsonFile(userConfigPath);
  const projectConfig = projectConfigPath ? await readJsonFile(projectConfigPath) : null;
  const explicitConfig = explicitConfigPath ? await readJsonFile(explicitConfigPath) : null;

  const envConfig: ChatUIConfig = {
    mcp: {
      serverUrl: process.env.MCP_TEST_URL,
      endpoint: process.env.MCP_ENDPOINT,
      protocolVersion: process.env.MCP_PROTOCOL_VERSION,
    },
  };

  const merged: ChatUIConfig = {
    ...systemConfig,
    ...(userConfig ?? {}),
    ...(projectConfig ?? {}),
    ...(explicitConfig ?? {}),
  };

  merged.mcp = mergeMcpConfigs(
    systemConfig.mcp,
    userConfig?.mcp,
    projectConfig?.mcp,
    envConfig.mcp,
    explicitConfig?.mcp,
  );

  return merged;
}

async function resolveMcpConfigWithOverrides(argv: Record<string, unknown>): Promise<ChatUIConfig> {
  const config = await resolveConfig(argv as GlobalOptions);
  const serverUrl = (argv as { serverUrl?: string }).serverUrl ?? (argv as Record<string, string | undefined>)[MCP_SERVER_URL_KEY];
  const endpoint = (argv as { endpoint?: string }).endpoint;
  const protocolVersion = (argv as { protocolVersion?: string }).protocolVersion ??
    (argv as Record<string, string | undefined>)[MCP_PROTOCOL_VERSION_KEY];
  const mcpOverrides = {
    serverUrl,
    endpoint,
    protocolVersion,
  };

  if (serverUrl || endpoint || protocolVersion) {
    config.mcp = {
      ...config.mcp,
      ...mcpOverrides,
    };
  }

  return config;
}

function resolveCwd(opts: GlobalOptions): string {
  if (opts.cwd) return path.resolve(opts.cwd);
  if (process.env.ASTUDIO_CWD) return path.resolve(process.env.ASTUDIO_CWD);
  return process.cwd();
}

async function readParamsInput(input?: string): Promise<JsonValue | undefined> {
  if (!input) return undefined;
  if (input === "-") {
    const stdin = await readStdin();
    return parseJsonString(stdin);
  }
  if (input.startsWith("@")) {
    const filePath = input.slice(1);
    try {
      const contents = await fsp.readFile(filePath, "utf8");
      return parseJsonString(contents);
    } catch {
      throw new CliError(`Unable to read params file: ${filePath}`, {
        code: ERROR_CODES.validation,
        exitCode: EXIT_CODES.usage,
        hint: "Provide a readable JSON file path or use '-' for stdin.",
      });
    }
  }
  return parseJsonString(input);
}

function parseJsonString(text: string): JsonValue {
  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    throw new CliError("Invalid JSON input", {
      code: ERROR_CODES.validation,
      exitCode: EXIT_CODES.usage,
      hint: "Provide valid JSON, @file, or '-' for stdin.",
    });
  }
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function runPnpm(
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

async function runCommandCapture(command: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr?.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("close", (code) => resolve({ code: code ?? 1, stdout, stderr }));
    child.on("error", (err) => {
      resolve({ code: 1, stdout: "", stderr: err instanceof Error ? err.message : "Failed to start command" });
    });
  });
}

async function jsonRpcRequest(
  opts: GlobalOptions,
  config: ChatUIConfig,
  method: string,
  params?: JsonValue,
): Promise<JsonValue> {
  const { protocolVersion, url } = resolveMcpSettings(config);

  const payload = {
    jsonrpc: "2.0",
    method,
    params: params ?? {},
    id: Date.now(),
  };

  logDebug(opts, `JSON-RPC request to ${url} (${method})`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "MCP-Protocol-Version": protocolVersion,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await response.text();
    if (!response.ok) {
      throw new CliError(`MCP request failed (${response.status})`, {
        code: ERROR_CODES.network,
        exitCode: EXIT_CODES.failure,
        details: { status: response.status, status_text: response.statusText },
      });
    }
    const data = parseJsonString(text) as { result?: JsonValue; error?: { message?: string } };

    if (data.error) {
      throw new CliError(data.error.message || "MCP error response", {
        code: ERROR_CODES.internal,
        exitCode: EXIT_CODES.failure,
      });
    }

    return data.result ?? {};
  } catch (err) {
    if (err instanceof CliError) {
      throw err;
    }
    if ((err as Error).name === "AbortError") {
      throw new CliError("Request timed out", {
        code: ERROR_CODES.network,
        exitCode: EXIT_CODES.failure,
      });
    }
    throw new CliError(err instanceof Error ? err.message : "Request failed", {
      code: ERROR_CODES.network,
      exitCode: EXIT_CODES.failure,
    });
  } finally {
    clearTimeout(timeout);
  }
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

function emitResult(opts: GlobalOptions, result: RunResult, summary: string): void {
  const status = result.exitCode === 0 ? "success" : "error";

  if (opts.json) {
    outputJson(createEnvelope(summary, status, buildRunResultData(result), buildRunResultError(result)));
    return;
  }

  if (opts.plain) {
    const includeOutput = opts.verbose || opts.debug || result.exitCode !== 0;
    const data = buildRunResultData(result);
    outputPlainRecord({
      schema: COMMAND_SCHEMA,
      summary,
      status,
      command: data.command,
      target: data.target,
      cwd: data.cwd,
      exit_code: data.exit_code,
      duration_ms: data.duration_ms,
      dry_run: data.dry_run,
      stdout: includeOutput ? data.stdout ?? null : undefined,
      stderr: includeOutput ? data.stderr ?? null : undefined,
      error_code: result.exitCode === 0 ? undefined : ERROR_CODES.exec,
      error_message: result.exitCode === 0 ? undefined : "Command failed",
    });
  }
}

async function handleRun(
  opts: CliArgs,
  args: string[],
  summary: string,
  target?: string,
): Promise<number> {
  requireExec(opts, summary);
  const result = await runPnpm(opts, args);
  result.target = target;
  if (opts.dryRun && !opts.json && !opts.plain) {
    process.stdout.write(`${result.command}\n`);
  }
  emitResult(opts, result, summary);
  if (opts.verbose && !opts.json && !opts.plain) {
    logInfo(opts, `Completed in ${result.durationMs}ms`);
  }
  return result.exitCode;
}

function emitMcpResult(
  opts: CliArgs,
  summary: string,
  baseData: Record<string, JsonValue>,
  outcome: { status: "success" | "error"; durationMs: number; result?: JsonValue; error?: CliError },
): void {
  const status = outcome.status;
  const payload: Record<string, JsonValue> = {
    ...baseData,
    duration_ms: outcome.durationMs,
  };
  if (outcome.result !== undefined) {
    payload.result = outcome.result;
  }

  if (opts.json) {
    outputJson(createEnvelope(summary, status, payload, outcome.error ? [toJsonError(outcome.error)] : []));
    return;
  }

  if (opts.plain) {
    outputPlainRecord({
      schema: COMMAND_SCHEMA,
      summary,
      status,
      ...payload,
      error_code: outcome.error?.code,
      error_message: outcome.error?.message,
    });
    return;
  }

  if (status === "success" && outcome.result !== undefined) {
    process.stdout.write(`${JSON.stringify(outcome.result, null, 2)}
`);
  } else if (status === "error" && outcome.error) {
    logError(opts, `Error: ${outcome.error.message}`);
  }
}

function summarizeMcpRequest(label: string, baseData: Record<string, JsonValue>): string {
  const params = baseData.params as JsonValue | undefined;
  const paramsSummary = params ? JSON.stringify(params).slice(0, 160) : "{}";
  return `MCP ${label} params=${paramsSummary}`;
}

function resolveSummaryLabel(method: string, summaryMethod?: string): string {
  return summaryMethod ?? method;
}

async function performMcpRequest(
  opts: CliArgs,
  config: ChatUIConfig,
  method: string,
  params: JsonValue | undefined,
): Promise<{ result: JsonValue | null; durationMs: number }> {
  const started = Date.now();
  const result = await jsonRpcRequest(opts, config, method, params);
  return { result: result ?? null, durationMs: Date.now() - started };
}

async function handleMcpRpc(
  opts: CliArgs,
  config: ChatUIConfig,
  method: string,
  params?: JsonValue,
  summaryMethod?: string,
): Promise<number> {
  const started = Date.now();
  const { serverUrl, endpoint, protocolVersion, url } = resolveMcpSettings(config);
  const baseData = {
    method,
    params: params ?? {},
    server_url: serverUrl,
    endpoint,
    protocol_version: protocolVersion,
  };
  const summaryLabel = resolveSummaryLabel(method, summaryMethod);
  const summary = summarizeMcpRequest(summaryLabel, baseData);

  if (opts.dryRun) {
    const durationMs = Date.now() - started;
    if (opts.json || opts.plain) {
      emitMcpResult(opts, summary, baseData, { status: "success", durationMs, result: { [MCP_DRY_RUN_LABEL]: true, [MCP_URL_LABEL]: url } });
    } else {
      process.stdout.write(`dry_run=1 method=${method} url=${url}` + "\n");
    }
    return EXIT_CODES.success;
  }

  requireNetwork(opts, summary);

  try {
    const { result, durationMs } = await performMcpRequest(opts, config, method, params);
    emitMcpResult(opts, summary, baseData, { status: "success", durationMs, result });
    if (opts.verbose && !opts.json && !opts.plain) {
      logInfo(opts, `Completed in ${durationMs}ms`);
    }
    return EXIT_CODES.success;
  } catch (err) {
    const error = err instanceof CliError
      ? err
      : new CliError(err instanceof Error ? err.message : "Request failed", {
          code: ERROR_CODES.internal,
          exitCode: EXIT_CODES.failure,
        });
    const durationMs = Date.now() - started;
    emitMcpResult(opts, summary, baseData, { status: "error", durationMs, error });
    if (opts.verbose && !opts.json && !opts.plain) {
      logInfo(opts, `Failed in ${durationMs}ms`);
    }
    return error.exitCode ?? EXIT_CODES.failure;
  }
}

async function checkPnpm(execAllowed: boolean): Promise<{ name: string; status: "ok" | "warn" | "error"; details: string }> {
  if (!execAllowed) {
    return { name: "pnpm", status: "warn", details: "skipped (exec disabled)" };
  }
  const pnpmResult = await runCommandCapture(resolvePnpmCommand(), ["--version"]);
  return {
    name: "pnpm",
    status: pnpmResult.code === 0 ? "ok" : "warn",
    details: pnpmResult.stdout.trim() || pnpmResult.stderr.trim() || "pnpm not available",
  };
}

async function checkXcode(execAllowed: boolean): Promise<{ name: string; status: "ok" | "warn" | "error"; details: string } | null> {
  if (process.platform !== "darwin") return null;
  if (!execAllowed) {
    return { name: "xcode", status: "warn", details: "skipped (exec disabled)" };
  }
  try {
    const xcodeResult = await runCommandCapture("xcodebuild", ["-version"]);
    if (xcodeResult.code !== 0) {
      throw new Error("xcodebuild not available");
    }
    return { name: "xcode", status: "ok", details: xcodeResult.stdout.trim().split("\n")[0] ?? "" };
  } catch {
    return { name: "xcode", status: "warn", details: "xcodebuild not available" };
  }
}

async function checkMcp(opts: CliArgs): Promise<{ name: string; status: "ok" | "warn" | "error"; details: string } | null> {
  if (!opts.network) return null;
  if (opts.dryRun) {
    return { name: "mcp", status: "warn", details: "skipped (dry-run)" };
  }
  try {
    const config = await resolveConfig(opts);
    await jsonRpcRequest(opts, config, MCP_CHECK_METHOD);
    return { name: "mcp", status: "ok", details: "reachable" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unreachable";
    return { name: "mcp", status: "warn", details: message };
  }
}

async function doctor(opts: CliArgs): Promise<number> {
  const started = Date.now();
  const checks: Array<{ name: string; status: "ok" | "warn" | "error"; details: string }> = [];

  const nodeVersion = process.versions.node;
  checks.push({ name: "node", status: "ok", details: nodeVersion });

  const execAllowed = Boolean(opts.exec);
  if (!execAllowed) {
    checks.push({
      name: "exec",
      status: "warn",
      details: "external commands disabled; re-run with --exec",
    });
  }

  const pnpmCheck = await checkPnpm(execAllowed);
  checks.push(pnpmCheck);

  const cwd = resolveCwd(opts);
  const repoRoot = findRepoRoot(cwd);
  checks.push({
    name: "repo",
    status: repoRoot ? "ok" : "warn",
    details: repoRoot ?? "pnpm-workspace.yaml not found",
  });

  const xcodeCheck = await checkXcode(execAllowed);
  if (xcodeCheck) checks.push(xcodeCheck);

  const mcpCheck = await checkMcp(opts);
  if (mcpCheck) checks.push(mcpCheck);

  const durationMs = Date.now() - started;
  const hasError = checks.some((check) => check.status === "error");
  const hasWarn = checks.some((check) => check.status === "warn");
  const overallStatus: JsonEnvelope["status"] = hasError ? "error" : hasWarn ? "warn" : "success";

  if (opts.json) {
    outputJson(
      createEnvelope("doctor", overallStatus, {
        checks,
        duration_ms: durationMs,
      }),
    );
  } else if (opts.plain) {
    const lines = checks.map((check) => `check=${check.name} status=${check.status} ${check.details}`);
    outputPlain(lines);
  } else {
    for (const check of checks) {
      process.stdout.write(`${check.status.toUpperCase()} ${check.name}: ${check.details}
`);
    }
  }

  return hasError ? EXIT_CODES.failure : EXIT_CODES.success;
}
function addGlobalOptions(argv: Argv): Argv {
  return argv
    .option("quiet", { alias: "q", type: "boolean", description: "Errors only" })
    .option("verbose", { alias: "v", type: "boolean", description: "More detail + timings" })
    .option("debug", { alias: "d", type: "boolean", description: "Internal diagnostics" })
    .option("json", { type: "boolean", description: "Machine output (single JSON object)" })
    .option("plain", { type: "boolean", description: "Stable line-based output" })
    .option("no-color", { type: "boolean", description: "Disable color" })
    .option("no-input", { type: "boolean", description: "Disable prompts" })
    .option("exec", { type: "boolean", description: "Allow external command execution" })
    .option("network", { type: "boolean", description: "Allow network access" })
    .option("cwd", { type: "string", description: "Run as if from this directory" })
    .option("config", { type: "string", description: "Config file override" })
    .option("dry-run", { type: "boolean", description: "Preview without changes" });
}

const cli = yargs(hideBin(process.argv))
  .scriptName(TOOL_NAME)
  .help("help")
  .alias("h", "help")
  .version("version", "Print version", TOOL_VERSION)
  .wrap(Math.min(100, process.stdout.columns ?? 100))
  .strict()
  .strictCommands()
  .showHelpOnFail(false)
  .middleware(async (argv) => {
    if (argv.json && argv.plain) {
      throw new CliError("--json and --plain are mutually exclusive", {
        code: ERROR_CODES.usage,
        exitCode: EXIT_CODES.usage,
        hint: "Choose one output mode.",
      });
    }
  })
  .command(
    "help [command]",
    "Show help for a command",
    (cmd) => cmd.positional("command", { type: "string" }),
    (argv) => {
      if (argv.command) {
        cli.parse([argv.command as string, "--help"]);
      } else {
        cli.showHelp();
      }
    },
  )
  .command(
    "dev [target]",
    "Start development servers",
    (cmd) =>
      cmd.positional("target", {
        type: "string",
        choices: ["web", "storybook", "widgets", "mcp", "all"],
      }),
    async (argv) => {
      const target = argv.target ?? "all";
      const map: Record<string, string[]> = {
        all: ["dev"],
        web: ["dev:web"],
        storybook: ["dev:storybook"],
        widgets: ["dev:widgets"],
        mcp: ["mcp:dev"],
      };
      const args = map[target] ?? ["dev"];
      const code = await handleRun(argv as CliArgs, args, `dev ${target}`, target);
      process.exitCode = code;
    },
  )
  .command(
    "build [target]",
    "Build targets",
    (cmd) =>
      cmd
        .positional("target", {
          type: "string",
          choices: ["web", "widgets", "lib", "macos", "all"],
        })
        .option("clean", { type: "boolean", description: "Force clean build" }),
    async (argv) => {
      const target = argv.target ?? "all";
      const cleanFlag = argv.clean ? ["--", "--no-incremental"] : [];
      const map: Record<string, string[]> = {
        all: ["build", ...cleanFlag],
        web: ["build:web", ...cleanFlag],
        widgets: ["build:widgets", ...cleanFlag],
        lib: ["build:lib", ...cleanFlag],
        macos: ["build:macos", ...cleanFlag],
      };
      const args = map[target] ?? ["build", ...cleanFlag];
      const code = await handleRun(argv as CliArgs, args, `build ${target}`, target);
      process.exitCode = code;
    },
  )
  .command(
    "test [suite]",
    "Run test suites",
    (cmd) =>
      cmd
        .positional("suite", {
          type: "string",
          choices: [
            "ui",
            "e2e-web",
            "a11y-widgets",
            "visual-web",
            "visual-storybook",
            "swift",
            "mcp-contract",
            "all",
          ],
        })
        .option("update", { type: "boolean", description: "Update snapshots" }),
    async (argv) => {
      const suite = argv.suite ?? "ui";
      if (argv.update && !["visual-web", "visual-storybook"].includes(suite)) {
        throw new CliError("--update is only valid for visual test suites", {
          code: ERROR_CODES.validation,
          exitCode: EXIT_CODES.usage,
          hint: "Use --update with visual-web or visual-storybook.",
        });
      }
      const map: Record<string, string[]> = {
        ui: ["test"],
        "e2e-web": ["test:e2e:web"],
        "a11y-widgets": ["test:a11y:widgets"],
        "visual-web": argv.update ? ["test:visual:update"] : ["test:visual:web"],
        "visual-storybook": argv.update
          ? ["test:visual:storybook:update"]
          : ["test:visual:storybook"],
        swift: ["test:swift"],
        "mcp-contract": ["test:mcp-contract"],
        all: ["test:cross-platform"],
      };
      const args = map[suite] ?? ["test"];
      const code = await handleRun(argv as CliArgs, args, `test ${suite}`, suite);
      process.exitCode = code;
    },
  )
  .command(
    "mcp",
    "MCP server utilities",
    (mcp) =>
      mcp
        .command(
          "dev",
          "Run MCP server in development mode",
          (cmd) => cmd,
          async (argv) => {
            const code = await handleRun(argv as CliArgs, ["mcp:dev"], "mcp dev", "dev");
            process.exitCode = code;
          },
        )
        .command(
          "start",
          "Run MCP server in production mode",
          (cmd) => cmd,
          async (argv) => {
            const code = await handleRun(argv as CliArgs, ["mcp:start"], "mcp start", "start");
            process.exitCode = code;
          },
        )
        .command(
          "test",
          "Run MCP tests",
          (cmd) => cmd,
          async (argv) => {
            const code = await handleRun(argv as CliArgs, ["mcp:test"], "mcp test", "test");
            process.exitCode = code;
          },
        )
        .command(
          "inspector",
          "Launch MCP inspector",
          (cmd) => cmd,
          async (argv) => {
            const code = await handleRun(argv as CliArgs, ["mcp:inspector"], "mcp inspector", "inspector");
            process.exitCode = code;
          },
        )
        .command(
          "rpc <method>",
          "Send a raw JSON-RPC request to the MCP server",
          (cmd) =>
            cmd
              .positional("method", { type: "string", demandOption: true })
              .option("params", { type: "string", description: "JSON params or @file or -" })
              .options(Object.fromEntries(MCP_CONFIG_OPTIONS.map(([key, description]) => [key, { type: "string", description }]))),
          async (argv) => {
            const config = await resolveMcpConfigWithOverrides(argv);
            const params = await readParamsInput(argv.params as string | undefined);
            const code = await handleMcpRpc(argv as CliArgs, config, argv.method as string, params, argv.method as string);
            process.exitCode = code;
          },
        )
        .command(
          "tools <action>",
          "List or call MCP tools",
          (cmd) =>
            cmd
              .positional("action", { type: "string", choices: ["list", "call"], demandOption: true })
              .option("name", { type: "string", description: "Tool name" })
              .option("args", { type: "string", description: "JSON args or @file or -" })
              .options(Object.fromEntries(MCP_CONFIG_OPTIONS.map(([key, description]) => [key, { type: "string", description }]))),
          async (argv) => {
            const config = await resolveMcpConfigWithOverrides(argv);
            if (argv.action === "list") {
              const code = await handleMcpRpc(argv as CliArgs, config, MCP_METHOD_TOOLS_LIST, undefined, MCP_METHOD_TOOLS_LIST);
              process.exitCode = code;
              return;
            }
            const name = argv.name as string;
            if (!name) {
              throw new CliError("--name is required for tools call", {
                code: ERROR_CODES.usage,
                exitCode: EXIT_CODES.usage,
              });
            }
            const args = await readParamsInput(argv.args as string | undefined);
            const code = await handleMcpRpc(argv as CliArgs, config, "tools/call", { name, arguments: args ?? {} }, "tools/call");
            process.exitCode = code;
          },
        )
        .command(
          "resources <action>",
          "List or read MCP resources",
          (cmd) =>
            cmd
              .positional("action", { type: "string", choices: ["list", "read"], demandOption: true })
              .option("uri", { type: "string", description: "Resource URI" })
              .options(Object.fromEntries(MCP_CONFIG_OPTIONS.map(([key, description]) => [key, { type: "string", description }]))),
          async (argv) => {
            const config = await resolveMcpConfigWithOverrides(argv);
            if (argv.action === "list") {
              const code = await handleMcpRpc(argv as CliArgs, config, "resources/list", undefined, "resources/list");
              process.exitCode = code;
              return;
            }
            const uri = argv.uri as string;
            if (!uri) {
              throw new CliError("--uri is required for resources read", {
                code: ERROR_CODES.usage,
                exitCode: EXIT_CODES.usage,
              });
            }
            const code = await handleMcpRpc(argv as CliArgs, config, "resources/read", { uri }, "resources/read");
            process.exitCode = code;
          },
        )
        .command(
          "prompts <action>",
          "List or get MCP prompts",
          (cmd) =>
            cmd
              .positional("action", { type: "string", choices: ["list", "get"], demandOption: true })
              .option("name", { type: "string", description: "Prompt name" })
              .options(Object.fromEntries(MCP_CONFIG_OPTIONS.map(([key, description]) => [key, { type: "string", description }]))),
          async (argv) => {
            const config = await resolveMcpConfigWithOverrides(argv);
            if (argv.action === "list") {
              const code = await handleMcpRpc(argv as CliArgs, config, "prompts/list", undefined, "prompts/list");
              process.exitCode = code;
              return;
            }
            const name = argv.name as string;
            if (!name) {
              throw new CliError("--name is required for prompts get", {
                code: ERROR_CODES.usage,
                exitCode: EXIT_CODES.usage,
              });
            }
            const code = await handleMcpRpc(argv as CliArgs, config, "prompts/get", { name }, "prompts/get");
            process.exitCode = code;
          },
        )
        .demandCommand(1, "Specify an MCP subcommand"),
    () => {
      process.exitCode = EXIT_CODES.usage;
    },
  )
  .command(
    "tokens <command>",
    "Generate or validate design tokens",
    (cmd) =>
      cmd
        .positional("command", { type: "string", choices: ["generate", "validate"] })
        .option("write", { type: "boolean", description: "Required to generate tokens" }),
    async (argv) => {
      if (argv.command === "generate") {
        if (!argv.write) {
          throw new CliError(TOKEN_GENERATE_WARNING, {
            code: ERROR_CODES.policy,
            exitCode: EXIT_CODES.policy,
            hint: TOKEN_WRITE_HINT,
          });
        }
        const code = await handleRun(argv as CliArgs, ["generate:tokens"], "tokens generate", "generate");
        process.exitCode = code;
        return;
      }
      const code = await handleRun(argv as CliArgs, ["validate:tokens"], "tokens validate", "validate");
      process.exitCode = code;
    },
  )
  .command(
    "versions <command>",
    "Sync version metadata across workspace",
    (cmd) =>
      cmd
        .positional("command", { type: "string", choices: ["sync", "sync-swift"] })
        .option("write", { type: "boolean", description: "Required to perform sync" }),
    async (argv) => {
      if (!argv.write) {
        throw new CliError(VERSIONS_WRITE_WARNING, {
          code: ERROR_CODES.policy,
          exitCode: EXIT_CODES.policy,
          hint: TOKEN_WRITE_HINT,
        });
      }
      const script = argv.command === "sync" ? "sync:versions" : "sync:swift-versions";
      const code = await handleRun(argv as CliArgs, [script], `versions ${argv.command}`, argv.command as string);
      process.exitCode = code;
    },
  )
  .command(
    "skills",
    "Discover, install, and publish skills (Clawdhub)",
    (skills) =>
      skills
        .command(
          "search <query>",
          "Search Clawdhub skills",
          (cmd) =>
            cmd
              .positional("query", { type: "string", demandOption: true })
              .option("limit", { type: "number", default: 20 })
              .option("allow-unsafe", {
                type: "boolean",
                default: false,
                describe: "Allow requests without checksum enforcement",
              }),
          async (argv) => {
            const client = new RemoteSkillClient({ strictIntegrity: !argv["allow-unsafe"] });
            const results = await client.search(argv.query as string, argv.limit as number);
            emitSkillResults(argv as CliArgs, results);
          },
        )
        .command(
          "install <slug>",
          "Download and install a skill",
          (cmd) =>
            cmd
              .positional("slug", { type: "string", demandOption: true })
              .option("platform", {
                type: "string",
                choices: ["codex", "claude", "opencode", "copilot"],
                demandOption: true,
              })
              .option("version", { type: "string", describe: "Version to install (defaults to latest)" })
              .option("checksum", { type: "string", describe: "Expected SHA-256 checksum of the zip (required in strict mode)" })
              .option("destination", { type: "string", describe: "Override install root (defaults to platform root)" })
              .option("allow-unsafe", {
                type: "boolean",
                default: false,
                describe: "Allow install without checksum (NOT recommended)",
              }),
          async (argv) => {
            const platform = argv.platform as SkillPlatform;
            const strict = !argv["allow-unsafe"];
            const checksum = argv.checksum as string | undefined;
            if (strict && !checksum) {
              throw new CliError("Checksum is required in strict mode. Pass --checksum <sha256> or --allow-unsafe.", {
                code: ERROR_CODES.policy,
                exitCode: EXIT_CODES.policy,
              });
            }
            const client = new RemoteSkillClient({ strictIntegrity: strict });
            const download = await client.download(argv.slug as string, {
              version: argv.version as string | undefined,
              expectedChecksum: checksum,
              strictIntegrity: strict,
            });
            const root = (argv.destination as string | undefined) ?? platformRootPath(platform);
            const result = await installSkillFromZip(
              download.zipPath,
              [{ rootPath: root, storageKey: platformStorageKey(platform) }],
              { slug: argv.slug as string, version: (argv.version as string | null) ?? null },
            );
            emitSkillInstall(argv as CliArgs, result.installPaths, platform);
          },
        )
        .command(
          "publish <path>",
          "Publish or update a local skill using bunx clawdhub",
          (cmd) =>
            cmd
              .positional("path", { type: "string", demandOption: true })
              .option("slug", { type: "string", describe: "Skill slug (defaults to folder name)" })
              .option("latest-version", { type: "string", describe: "Current published version (semantic)" })
              .option("bump", { type: "string", choices: ["major", "minor", "patch"], default: "patch" })
              .option("changelog", { type: "string" })
              .option("tags", { type: "string", describe: "Comma-separated tags" })
              .option("dry-run", { type: "boolean", default: false }),
          async (argv) => {
            const skillPath = path.resolve(argv.path as string);
            const slug = (argv.slug as string | undefined) ?? path.basename(skillPath);
            const tags = (argv.tags as string | undefined)?.split(",").map((t) => t.trim()).filter(Boolean);
            const result = await publishSkill({
              skillPath,
              slug,
              latestVersion: argv["latest-version"] as string | undefined,
              bump: (argv.bump as "major" | "minor" | "patch") ?? "patch",
              changelog: argv.changelog as string | undefined,
              tags,
              dryRun: argv["dry-run"] as boolean | undefined,
            });
            emitPublishResult(argv as CliArgs, result, slug);
          },
        )
        .demandCommand(1, "Specify a skills subcommand"),
    () => {
      process.exitCode = EXIT_CODES.usage;
    },
  )
  .command(
    "components new <name>",
    "Generate a new UI component",
    (cmd) =>
      cmd
        .positional("name", { type: "string", demandOption: true })
        .option("write", { type: "boolean", description: "Required to generate files" }),
    async (argv) => {
      if (!argv.write) {
        throw new CliError(COMPONENTS_WRITE_WARNING, {
          code: ERROR_CODES.policy,
          exitCode: EXIT_CODES.policy,
          hint: TOKEN_WRITE_HINT,
        });
      }
      const code = await handleRun(
        argv as CliArgs,
        ["new:component", "--", argv.name as string],
        `components new ${argv.name as string}`,
        argv.name as string,
      );
      process.exitCode = code;
    },
  )
  .command(
    "lint",
    "Run lint checks",
    (cmd) => cmd.option("compliance", { type: "boolean" }),
    async (argv) => {
      const args = argv.compliance ? ["lint:compliance"] : ["lint"];
      const code = await handleRun(argv as CliArgs, args, "lint", argv.compliance ? "compliance" : "default");
      process.exitCode = code;
    },
  )
  .command(
    "format",
    "Format code or check formatting",
    (cmd) => cmd.option("check", { type: "boolean" }).option("write", { type: "boolean" }),
    async (argv) => {
      if (!argv.check && !argv.write) {
        throw new CliError("Specify --check or --write", {
          code: ERROR_CODES.usage,
          exitCode: EXIT_CODES.usage,
          hint: "Use --check for read-only or --write to format files.",
        });
      }
      const args = argv.check ? ["format:check"] : ["format"];
      const code = await handleRun(argv as CliArgs, args, "format", argv.check ? "check" : "write");
      process.exitCode = code;
    },
  )
  .command(
    "doctor",
    "Check environment and repo health",
    (cmd) => cmd,
    async (argv) => {
      const code = await doctor(argv as CliArgs);
      process.exitCode = code;
    },
  )
  .fail((msg, err, yargsInstance) => {
    const parsedArgv = (yargsInstance as { parsed?: { argv?: GlobalOptions } }).parsed?.argv;
    const wantsJson = Boolean(parsedArgv?.json || process.argv.includes("--json"));
    const wantsPlain = Boolean(parsedArgv?.plain || process.argv.includes("--plain"));
    const failure = normalizeFailure(msg, err ?? undefined);

    if (wantsJson) {
      outputJson(createEnvelope("error", "error", {}, [toJsonError(failure)]));
    } else if (wantsPlain) {
      outputPlainRecord({
        schema: COMMAND_SCHEMA,
        summary: "error",
        status: "error",
        error_code: failure.code,
        error_message: failure.message,
        hint: failure.hint ?? null,
      });
    } else {
      process.stderr.write(`Error: ${failure.message}\n`);
      if (failure.hint) {
        process.stderr.write(`Hint: ${failure.hint}\n`);
      }
      if (failure.code === ERROR_CODES.usage || failure.code === ERROR_CODES.validation) {
        yargsInstance.showHelp();
      }
    }
    process.exitCode = failure.exitCode;
  });

void addGlobalOptions(cli)
  .parseAsync()
  .catch(() => {
    // Errors are handled by the yargs fail handler.
  });
