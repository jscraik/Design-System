import type { CliArgs } from "../types.js";
import type { Argv } from "yargs";
export declare function mcpDevCommand(argv: CliArgs): Promise<number>;
export declare function mcpStartCommand(argv: CliArgs): Promise<number>;
export declare function mcpTestCommand(argv: CliArgs): Promise<number>;
export declare function mcpInspectorCommand(argv: CliArgs): Promise<number>;
export declare function mcpRpcCommand(args: {
    method: string;
    params?: string;
    argv: CliArgs;
}): Promise<number>;
export declare function mcpToolsCommand(args: {
    action: string;
    name?: string;
    args?: string;
    argv: CliArgs;
}): Promise<number>;
export declare function mcpResourcesCommand(args: {
    action: string;
    uri?: string;
    argv: CliArgs;
}): Promise<number>;
export declare function mcpPromptsCommand(args: {
    action: string;
    name?: string;
    argv: CliArgs;
}): Promise<number>;
export declare function mcpCommand(yargs: Argv): Argv;
//# sourceMappingURL=mcp.d.ts.map