import path from "node:path";
import { fileURLToPath } from "node:url";

import { createEnhancedChatUiServer } from "./enhanced-server.js";
import { startMcpHttpServer } from "./lib/http-server.js";

function createChatUiServer() {
  return createEnhancedChatUiServer();
}

export { createChatUiServer };

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  startMcpHttpServer({
    createServerInstance: createChatUiServer,
    rootMessage: "ChatUI MCP server - Apps SDK compliant",
  });
}
