import { handleRun } from "../utils/exec.js";
import { handleMcpRpc, resolveMcpConfigWithOverrides } from "../utils/mcp.js";
import { readParamsInput } from "../utils/json.js";
import { MCP_METHOD_TOOLS_LIST, MCP_CONFIG_OPTIONS, } from "../constants.js";
import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";
export async function mcpDevCommand(argv) {
    return handleRun(argv, ["mcp:dev"], "mcp dev", "dev");
}
export async function mcpStartCommand(argv) {
    return handleRun(argv, ["mcp:start"], "mcp start", "start");
}
export async function mcpTestCommand(argv) {
    return handleRun(argv, ["mcp:test"], "mcp test", "test");
}
export async function mcpInspectorCommand(argv) {
    return handleRun(argv, ["mcp:inspector"], "mcp inspector", "inspector");
}
export async function mcpRpcCommand(args) {
    const { method, params, argv } = args;
    const config = await resolveMcpConfigWithOverrides(argv);
    const parsedParams = await readParamsInput(params);
    return handleMcpRpc(argv, config, method, parsedParams, method);
}
export async function mcpToolsCommand(args) {
    const { action, name, args: toolArgs, argv } = args;
    const config = await resolveMcpConfigWithOverrides(argv);
    if (action === "list") {
        return handleMcpRpc(argv, config, MCP_METHOD_TOOLS_LIST, undefined, MCP_METHOD_TOOLS_LIST);
    }
    if (!name) {
        throw new CliError("--name is required for tools call", {
            code: ERROR_CODES.usage,
            exitCode: EXIT_CODES.usage,
        });
    }
    const parsedArgs = await readParamsInput(toolArgs);
    return handleMcpRpc(argv, config, "tools/call", { name, arguments: parsedArgs ?? {} }, "tools/call");
}
export async function mcpResourcesCommand(args) {
    const { action, uri, argv } = args;
    const config = await resolveMcpConfigWithOverrides(argv);
    if (action === "list") {
        return handleMcpRpc(argv, config, "resources/list", undefined, "resources/list");
    }
    if (!uri) {
        throw new CliError("--uri is required for resources read", {
            code: ERROR_CODES.usage,
            exitCode: EXIT_CODES.usage,
        });
    }
    return handleMcpRpc(argv, config, "resources/read", { uri }, "resources/read");
}
export async function mcpPromptsCommand(args) {
    const { action, name, argv } = args;
    const config = await resolveMcpConfigWithOverrides(argv);
    if (action === "list") {
        return handleMcpRpc(argv, config, "prompts/list", undefined, "prompts/list");
    }
    if (!name) {
        throw new CliError("--name is required for prompts get", {
            code: ERROR_CODES.usage,
            exitCode: EXIT_CODES.usage,
        });
    }
    return handleMcpRpc(argv, config, "prompts/get", { name }, "prompts/get");
}
export function mcpCommand(yargs) {
    return yargs
        .command("dev", "Run MCP server in development mode", (cmd) => cmd, async (argv) => {
        process.exitCode = await mcpDevCommand(argv);
    })
        .command("start", "Run MCP server in production mode", (cmd) => cmd, async (argv) => {
        process.exitCode = await mcpStartCommand(argv);
    })
        .command("test", "Run MCP tests", (cmd) => cmd, async (argv) => {
        process.exitCode = await mcpTestCommand(argv);
    })
        .command("inspector", "Launch MCP inspector", (cmd) => cmd, async (argv) => {
        process.exitCode = await mcpInspectorCommand(argv);
    })
        .command("rpc <method>", "Send a raw JSON-RPC request to the MCP server", (cmd) => cmd
        .positional("method", { type: "string", demandOption: true })
        .option("params", { type: "string", description: "JSON params or @file or -" })
        .options(Object.fromEntries(MCP_CONFIG_OPTIONS.map(([key, description]) => [
        key,
        { type: "string", description },
    ]))), async (argv) => {
        process.exitCode = await mcpRpcCommand({
            method: argv.method,
            params: argv.params,
            argv: argv,
        });
    })
        .command("tools <action>", "List or call MCP tools", (cmd) => cmd
        .positional("action", {
        type: "string",
        choices: ["list", "call"],
        demandOption: true,
    })
        .option("name", { type: "string", description: "Tool name" })
        .option("args", { type: "string", description: "JSON args or @file or -" })
        .options(Object.fromEntries(MCP_CONFIG_OPTIONS.map(([key, description]) => [
        key,
        { type: "string", description },
    ]))), async (argv) => {
        process.exitCode = await mcpToolsCommand({
            action: argv.action,
            name: argv.name,
            args: argv.args,
            argv: argv,
        });
    })
        .command("resources <action>", "List or read MCP resources", (cmd) => cmd
        .positional("action", {
        type: "string",
        choices: ["list", "read"],
        demandOption: true,
    })
        .option("uri", { type: "string", description: "Resource URI" })
        .options(Object.fromEntries(MCP_CONFIG_OPTIONS.map(([key, description]) => [
        key,
        { type: "string", description },
    ]))), async (argv) => {
        process.exitCode = await mcpResourcesCommand({
            action: argv.action,
            uri: argv.uri,
            argv: argv,
        });
    })
        .command("prompts <action>", "List or get MCP prompts", (cmd) => cmd
        .positional("action", {
        type: "string",
        choices: ["list", "get"],
        demandOption: true,
    })
        .option("name", { type: "string", description: "Prompt name" })
        .options(Object.fromEntries(MCP_CONFIG_OPTIONS.map(([key, description]) => [
        key,
        { type: "string", description },
    ]))), async (argv) => {
        process.exitCode = await mcpPromptsCommand({
            action: argv.action,
            name: argv.name,
            argv: argv,
        });
    })
        .demandCommand(1, "Specify an MCP subcommand");
}
//# sourceMappingURL=mcp.js.map