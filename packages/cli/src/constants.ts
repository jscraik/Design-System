import fs from "node:fs";
import { fileURLToPath } from "node:url";

function getToolVersion(): string {
  try {
    const packageUrl = new URL("../package.json", import.meta.url);
    const packagePath = fileURLToPath(packageUrl);
    const raw = fs.readFileSync(packagePath, "utf8");
    const parsed = JSON.parse(raw) as { version?: string };
    return parsed.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

export const TOOL_NAME = "astudio";
export const TOOL_VERSION = getToolVersion();
export const MCP_DEFAULT_SERVER = "http://127.0.0.1:8787";
export const MCP_DEFAULT_ENDPOINT = "/mcp";
export const MCP_DEFAULT_PROTOCOL_VERSION = "2024-11-05";
export const COMMAND_SCHEMA = "astudio.command.v1";

export const DEFAULT_HINT_USAGE = "Use --help to see available options.";
export const MCP_ENDPOINT_OPTION = "MCP endpoint";
export const MCP_PROTOCOL_VERSION_OPTION = "MCP protocol version";
export const MCP_SERVER_URL_OPTION = "MCP server URL";
export const MCP_ENDPOINT_KEY = "endpoint";
export const MCP_PROTOCOL_VERSION_KEY = "protocol-version";
export const MCP_SERVER_URL_KEY = "server-url";
export const TOKEN_WRITE_HINT = "Re-run with --write to confirm file writes.";
export const TOKEN_GENERATE_WARNING = "--write is required to generate tokens";
export const VERSIONS_WRITE_WARNING = "--write is required to sync versions";
export const COMPONENTS_WRITE_WARNING = "--write is required to generate components";
export const MCP_DRY_RUN_LABEL = "dry_run";
export const MCP_URL_LABEL = "url";

export const MCP_CONFIG_OPTIONS = [
  [MCP_SERVER_URL_KEY, MCP_SERVER_URL_OPTION],
  [MCP_ENDPOINT_KEY, MCP_ENDPOINT_OPTION],
  [MCP_PROTOCOL_VERSION_KEY, MCP_PROTOCOL_VERSION_OPTION],
] as const;

export const MCP_METHOD_TOOLS_LIST = "tools/list";
export const MCP_CHECK_METHOD = MCP_METHOD_TOOLS_LIST;

export const EXIT_CODES = {
  success: 0,
  failure: 1,
  usage: 2,
  policy: 3,
  partial: 4,
  abort: 130,
} as const;

export const ERROR_CODES = {
  usage: "E_USAGE",
  validation: "E_VALIDATION",
  policy: "E_POLICY",
  partial: "E_PARTIAL",
  auth: "E_AUTH",
  network: "E_NETWORK",
  internal: "E_INTERNAL",
  exec: "E_EXEC",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
