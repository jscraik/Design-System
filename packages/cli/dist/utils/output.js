import { COMMAND_SCHEMA, TOOL_NAME } from "../constants.js";
import { getToolVersion } from "./env.js";
import { maskObject } from "./mask.js";
function nowIso() {
    return new Date().toISOString();
}
function currentOutputMode() {
    if (process.argv.includes("--plain"))
        return "plain";
    if (process.argv.includes("--json") || process.argv.includes("--agent"))
        return "json";
    if (process.env.CI && process.env.CI.toLowerCase() !== "false")
        return "json";
    return undefined;
}
// Global trace context for the current CLI invocation
let globalTraceContext;
let globalShowSensitive = false;
export function setTraceContext(context) {
    globalTraceContext = context;
}
export function getTraceContext() {
    return globalTraceContext;
}
export function setShowSensitive(show) {
    globalShowSensitive = show;
}
export function shouldMask() {
    return !globalShowSensitive;
}
export function outputJson(envelope) {
    process.stdout.write(`${JSON.stringify(envelope)}\n`);
}
export function outputPlain(lines) {
    process.stdout.write(`${lines.join("\n")}\n`);
}
function formatPlainValue(value) {
    return JSON.stringify(value);
}
export function outputPlainRecord(record) {
    const lines = Object.entries(record)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${formatPlainValue(value)}`);
    outputPlain(lines);
}
export function emitSkillResults(argv, results) {
    if (argv.json) {
        outputJson(createEnvelope("skills.search", "success", {
            items: results.map((r) => ({
                slug: r.slug,
                name: r.displayName,
                summary: r.summary ?? null,
                version: r.latestVersion ?? null,
            })),
        }));
        return;
    }
    const lines = results.map((r) => `${r.slug.padEnd(24, " ")} ${r.displayName}${r.latestVersion ? ` (v${r.latestVersion})` : ""}${r.summary ? ` — ${r.summary}` : ""}`);
    outputPlain(lines);
}
export function emitSkillInstall(argv, paths, platform) {
    if (argv.json) {
        outputJson(createEnvelope("skills.install", "success", { platform, paths }));
        return;
    }
    outputPlain(["Installed to:", ...paths.map((p) => `- ${p}`)]);
}
export function emitPublishResult(argv, result, slug) {
    if (argv.json) {
        outputJson(createEnvelope("skills.publish", "success", {
            slug,
            version: result.version,
            skipped: result.skipped,
            command: result.command ?? null,
        }));
        return;
    }
    if (result.skipped) {
        outputPlain([`No changes detected for ${slug}; publish skipped.`]);
    }
    else if (result.command) {
        outputPlain([`[dry-run] ${result.command.join(" ")}`]);
    }
    else {
        outputPlain([`Published ${slug} v${result.version}`]);
    }
}
export function createEnvelope(summary, status, data, errors = [], traceContext) {
    // Use provided context, fall back to global context, then undefined
    const context = traceContext ?? globalTraceContext;
    const outputMode = currentOutputMode();
    // Mask sensitive data unless show-sensitive is enabled
    // Short-circuit for empty objects to avoid unnecessary recursion
    const needsMasking = shouldMask() && Object.keys(data).length > 0;
    const maskedData = needsMasking ? maskObject(data) : data;
    return {
        schema: COMMAND_SCHEMA,
        meta: {
            tool: TOOL_NAME,
            version: getToolVersion(),
            timestamp: nowIso(),
            ...(outputMode ? { outputMode } : {}),
            ...(context && {
                request_id: context.requestId,
                trace_id: context.traceId,
                parent_id: context.parentId,
            }),
        },
        summary,
        status,
        data: maskedData,
        errors,
    };
}
//# sourceMappingURL=output.js.map