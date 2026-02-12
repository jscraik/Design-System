export type { ErrorCode } from "./constants.js";
export type JsonValue = string | number | boolean | null | JsonValue[] | {
    [key: string]: JsonValue;
};
export type ChatUIConfig = {
    mcp?: {
        serverUrl?: string;
        endpoint?: string;
        protocolVersion?: string;
    };
};
export type GlobalOptions = {
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
export type CliArgs = GlobalOptions & Record<string, unknown>;
export type RunResult = {
    command: string;
    target?: string;
    cwd?: string;
    exitCode: number;
    durationMs: number;
    stdout?: string;
    stderr?: string;
    dryRun?: boolean;
};
export type JsonError = {
    code: string;
    message: string;
    details?: Record<string, JsonValue>;
    hint?: string;
};
export type JsonEnvelope = {
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
//# sourceMappingURL=types.d.ts.map