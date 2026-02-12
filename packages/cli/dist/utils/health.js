import { resolveConfig, findRepoRoot } from "./config.js";
import { resolveCwd, resolvePnpmCommand } from "./env.js";
import { jsonRpcRequest } from "./mcp.js";
import { MCP_CHECK_METHOD } from "../constants.js";
import { runCommandCapture } from "./exec.js";
import { outputJson, outputPlain, createEnvelope } from "./output.js";
export async function checkPnpm(execAllowed) {
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
export async function checkMcp(opts) {
    if (!opts.network)
        return null;
    if (opts.dryRun) {
        return { name: "mcp", status: "warn", details: "skipped (dry-run)" };
    }
    try {
        const config = await resolveConfig(opts);
        await jsonRpcRequest(opts, config, MCP_CHECK_METHOD);
        return { name: "mcp", status: "ok", details: "reachable" };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "unreachable";
        return { name: "mcp", status: "warn", details: message };
    }
}
export async function doctor(opts) {
    const started = Date.now();
    const checks = [];
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
    const mcpCheck = await checkMcp(opts);
    if (mcpCheck)
        checks.push(mcpCheck);
    const durationMs = Date.now() - started;
    const hasError = checks.some((check) => check.status === "error");
    const hasWarn = checks.some((check) => check.status === "warn");
    const overallStatus = hasError ? "error" : hasWarn ? "warn" : "success";
    if (opts.json) {
        outputJson(createEnvelope("doctor", overallStatus, {
            checks,
            duration_ms: durationMs,
        }));
    }
    else if (opts.plain) {
        const lines = checks.map((check) => `check=${check.name} status=${check.status} ${check.details}`);
        outputPlain(lines);
    }
    else {
        for (const check of checks) {
            process.stdout.write(`${check.status.toUpperCase()} ${check.name}: ${check.details}
`);
        }
    }
    return hasError ? 1 : 0;
}
//# sourceMappingURL=health.js.map