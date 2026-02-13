import type { ChatUIConfig, GlobalOptions } from "../types.js";
export declare function mergeMcpConfigs(...configs: Array<ChatUIConfig["mcp"] | null | undefined>): ChatUIConfig["mcp"] | undefined;
export declare function resolveMcpSettings(config: ChatUIConfig): {
    serverUrl: string;
    endpoint: string;
    protocolVersion: string;
    url: string;
};
export declare function findRepoRoot(start: string): string | null;
export declare function resolveConfig(opts: GlobalOptions): Promise<ChatUIConfig>;
//# sourceMappingURL=config.d.ts.map