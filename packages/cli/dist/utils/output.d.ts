import type { CliArgs, JsonEnvelope, JsonError, JsonValue } from "../types.js";
import type { TraceContext } from "./trace.js";
export declare function setTraceContext(context: TraceContext): void;
export declare function getTraceContext(): TraceContext | undefined;
export declare function setShowSensitive(show: boolean): void;
export declare function shouldMask(): boolean;
export declare function outputJson(envelope: JsonEnvelope): void;
export declare function outputPlain(lines: string[]): void;
export declare function outputPlainRecord(record: Record<string, JsonValue | undefined>): void;
export declare function emitSkillResults(argv: CliArgs, results: Array<{
    slug: string;
    displayName: string;
    summary?: string;
    latestVersion?: string;
}>): void;
export declare function emitSkillInstall(argv: CliArgs, paths: string[], platform: string): void;
export declare function emitPublishResult(argv: CliArgs, result: {
    version: string;
    skipped: boolean;
    command?: string[];
}, slug: string): void;
export declare function createEnvelope(summary: string, status: JsonEnvelope["status"], data: Record<string, JsonValue>, errors?: JsonError[], traceContext?: TraceContext): JsonEnvelope;
//# sourceMappingURL=output.d.ts.map