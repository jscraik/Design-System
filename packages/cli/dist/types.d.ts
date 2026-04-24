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
export type Suggestion = {
    type: "command" | "flag" | "value";
    input: string;
    suggestion: string;
    confidence: number;
};
export type RecoveryAction = {
    fix_suggestion?: string;
    nextCommand?: {
        argv: string[];
        cwd?: string;
        env?: Record<string, string>;
    };
    recoveryUnavailableReason?: string;
};
export type JsonError = {
    code: string;
    message: string;
    details?: Record<string, JsonValue>;
    hint?: string;
    did_you_mean?: Suggestion[];
    fix_suggestion?: string;
    recovery?: RecoveryAction;
};
export type JsonEnvelope = {
    schema: string;
    meta: {
        tool: string;
        version: string;
        timestamp: string;
        outputMode?: "json" | "plain";
        request_id?: string;
        trace_id?: string;
        parent_id?: string;
    };
    summary: string;
    status: "success" | "warn" | "error";
    data: Record<string, JsonValue>;
    errors: JsonError[];
};
//# sourceMappingURL=types.d.ts.map