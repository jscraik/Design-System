import {
  MCP_DRY_RUN_LABEL,
  MCP_PROTOCOL_VERSION_KEY,
  MCP_SERVER_URL_KEY,
  MCP_URL_LABEL,
} from "../constants.js";
import { CliError, ERROR_CODES, EXIT_CODES, requireNetwork, toJsonError } from "../error.js";
import type { ChatUIConfig, CliArgs, GlobalOptions, JsonValue } from "../types.js";
import { resolveConfig, resolveMcpSettings } from "./config.js";
import { parseJsonString } from "./json.js";
import { logDebug, logError, logInfo } from "./logger.js";
import { createEnvelope, outputJson, outputPlainRecord } from "./output.js";

export async function jsonRpcRequest(
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

function emitMcpResult(
  opts: CliArgs,
  summary: string,
  baseData: Record<string, JsonValue>,
  outcome: {
    status: "success" | "error";
    durationMs: number;
    result?: JsonValue;
    error?: CliError;
  },
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
    outputJson(
      createEnvelope(summary, status, payload, outcome.error ? [toJsonError(outcome.error)] : []),
    );
    return;
  }

  if (opts.plain) {
    outputPlainRecord({
      schema: "astudio.command.v1",
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

export async function handleMcpRpc(
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
      emitMcpResult(opts, summary, baseData, {
        status: "success",
        durationMs,
        result: { [MCP_DRY_RUN_LABEL]: true, [MCP_URL_LABEL]: url },
      });
    } else {
      process.stdout.write(`dry_run=1 method=${method} url=${url}\n`);
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
    const error =
      err instanceof CliError
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

// Export the function that's not in other modules
export async function resolveMcpConfigWithOverrides(
  argv: Record<string, unknown>,
): Promise<ChatUIConfig> {
  const config = await resolveConfig(argv as GlobalOptions);
  const serverUrl =
    (argv as { serverUrl?: string }).serverUrl ??
    (argv as Record<string, string | undefined>)[MCP_SERVER_URL_KEY];
  const endpoint = (argv as { endpoint?: string }).endpoint;
  const protocolVersion =
    (argv as { protocolVersion?: string }).protocolVersion ??
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
