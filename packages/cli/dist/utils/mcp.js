import { MCP_DRY_RUN_LABEL, MCP_URL_LABEL, MCP_SERVER_URL_KEY, MCP_PROTOCOL_VERSION_KEY, } from "../constants.js";
import { resolveMcpSettings, resolveConfig, } from "./config.js";
import { logDebug, logError, logInfo } from "./logger.js";
import { outputJson, outputPlainRecord, createEnvelope } from "./output.js";
import { toJsonError, CliError, ERROR_CODES, EXIT_CODES, requireNetwork } from "../error.js";
import { parseJsonString } from "./json.js";
export async function jsonRpcRequest(opts, config, method, params) {
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
        const data = parseJsonString(text);
        if (data.error) {
            throw new CliError(data.error.message || "MCP error response", {
                code: ERROR_CODES.internal,
                exitCode: EXIT_CODES.failure,
            });
        }
        return data.result ?? {};
    }
    catch (err) {
        if (err instanceof CliError) {
            throw err;
        }
        if (err.name === "AbortError") {
            throw new CliError("Request timed out", {
                code: ERROR_CODES.network,
                exitCode: EXIT_CODES.failure,
            });
        }
        throw new CliError(err instanceof Error ? err.message : "Request failed", {
            code: ERROR_CODES.network,
            exitCode: EXIT_CODES.failure,
        });
    }
    finally {
        clearTimeout(timeout);
    }
}
function emitMcpResult(opts, summary, baseData, outcome) {
    const status = outcome.status;
    const payload = {
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
    }
    else if (status === "error" && outcome.error) {
        logError(opts, `Error: ${outcome.error.message}`);
    }
}
function summarizeMcpRequest(label, baseData) {
    const params = baseData.params;
    const paramsSummary = params ? JSON.stringify(params).slice(0, 160) : "{}";
    return `MCP ${label} params=${paramsSummary}`;
}
function resolveSummaryLabel(method, summaryMethod) {
    return summaryMethod ?? method;
}
async function performMcpRequest(opts, config, method, params) {
    const started = Date.now();
    const result = await jsonRpcRequest(opts, config, method, params);
    return { result: result ?? null, durationMs: Date.now() - started };
}
export async function handleMcpRpc(opts, config, method, params, summaryMethod) {
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
        }
        else {
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
    }
    catch (err) {
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
// Export the function that's not in other modules
export async function resolveMcpConfigWithOverrides(argv) {
    const config = await resolveConfig(argv);
    const serverUrl = argv.serverUrl ??
        argv[MCP_SERVER_URL_KEY];
    const endpoint = argv.endpoint;
    const protocolVersion = argv.protocolVersion ??
        argv[MCP_PROTOCOL_VERSION_KEY];
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
//# sourceMappingURL=mcp.js.map