import type { ChatUIConfig, CliArgs, GlobalOptions, JsonValue } from "../types.js";
export declare function jsonRpcRequest(opts: GlobalOptions, config: ChatUIConfig, method: string, params?: JsonValue): Promise<JsonValue>;
export declare function handleMcpRpc(opts: CliArgs, config: ChatUIConfig, method: string, params?: JsonValue, summaryMethod?: string): Promise<number>;
export declare function resolveMcpConfigWithOverrides(argv: Record<string, unknown>): Promise<ChatUIConfig>;
//# sourceMappingURL=mcp.d.ts.map