import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { MCP_DEFAULT_SERVER, MCP_DEFAULT_ENDPOINT, MCP_DEFAULT_PROTOCOL_VERSION } from "../constants.js";
import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";
import { resolveCwd } from "./env.js";
export function mergeMcpConfigs(...configs) {
    const merged = {};
    for (const config of configs) {
        if (!config)
            continue;
        if (config.serverUrl !== undefined)
            merged.serverUrl = config.serverUrl;
        if (config.endpoint !== undefined)
            merged.endpoint = config.endpoint;
        if (config.protocolVersion !== undefined)
            merged.protocolVersion = config.protocolVersion;
    }
    return Object.keys(merged).length > 0 ? merged : undefined;
}
export function resolveMcpSettings(config) {
    const serverUrl = config.mcp?.serverUrl ?? MCP_DEFAULT_SERVER;
    const endpoint = config.mcp?.endpoint ?? MCP_DEFAULT_ENDPOINT;
    const protocolVersion = config.mcp?.protocolVersion ?? MCP_DEFAULT_PROTOCOL_VERSION;
    const url = new URL(endpoint, serverUrl);
    return { serverUrl, endpoint, protocolVersion, url: url.toString() };
}
async function readJsonFile(filePath) {
    try {
        const contents = await fsp.readFile(filePath, "utf8");
        return JSON.parse(contents);
    }
    catch (err) {
        if (err.code === "ENOENT")
            return null;
        throw new CliError(`Invalid config file at ${filePath}`, {
            code: ERROR_CODES.validation,
            exitCode: EXIT_CODES.usage,
            hint: "Fix the JSON or remove the config override.",
        });
    }
}
export function findRepoRoot(start) {
    let current = start;
    while (true) {
        const workspacePath = path.join(current, "pnpm-workspace.yaml");
        if (fs.existsSync(workspacePath))
            return current;
        const next = path.dirname(current);
        if (next === current)
            return null;
        current = next;
    }
}
export async function resolveConfig(opts) {
    const cwd = resolveCwd(opts);
    const repoRoot = findRepoRoot(cwd);
    const projectConfigPath = repoRoot ? path.join(repoRoot, "astudio.config.json") : null;
    const userConfigPath = path.join(os.homedir(), ".config", "astudio", "config.json");
    const explicitConfigPath = opts.config ?? process.env.ASTUDIO_CONFIG ?? null;
    const systemConfig = {};
    const userConfig = await readJsonFile(userConfigPath);
    const projectConfig = projectConfigPath ? await readJsonFile(projectConfigPath) : null;
    const explicitConfig = explicitConfigPath ? await readJsonFile(explicitConfigPath) : null;
    const envConfig = {
        mcp: {
            serverUrl: process.env.MCP_TEST_URL,
            endpoint: process.env.MCP_ENDPOINT,
            protocolVersion: process.env.MCP_PROTOCOL_VERSION,
        },
    };
    const merged = {
        ...systemConfig,
        ...(userConfig ?? {}),
        ...(projectConfig ?? {}),
        ...(explicitConfig ?? {}),
    };
    merged.mcp = mergeMcpConfigs(systemConfig.mcp, userConfig?.mcp, projectConfig?.mcp, envConfig.mcp, explicitConfig?.mcp);
    return merged;
}
//# sourceMappingURL=config.js.map