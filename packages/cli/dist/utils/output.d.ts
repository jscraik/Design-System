import type { JsonValue, JsonEnvelope, JsonError, CliArgs } from "../types.js";
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
export declare function createEnvelope(summary: string, status: JsonEnvelope["status"], data: Record<string, JsonValue>, errors?: JsonError[]): JsonEnvelope;
//# sourceMappingURL=output.d.ts.map