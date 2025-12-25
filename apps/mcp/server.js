import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const widgetHtmlPath = path.resolve(__dirname, "../web/dist/widget.html");

function readWidgetHtml() {
  return readFileSync(widgetHtmlPath, "utf8");
}

const openChatUiInputSchema = {
  // Optional message seed. Keeping it minimal: the model reads structuredContent verbatim.
  seedMessage: z.string().optional(),
};

function createChatUiServer() {
  const server = new McpServer({ name: "chatui", version: "0.0.0" });

  server.registerResource(
    "chatui-widget",
    "ui://widget/chatui.html",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://widget/chatui.html",
          mimeType: "text/html+skybridge",
          text: readWidgetHtml(),
          _meta: { "openai/widgetPrefersBorder": true },
        },
      ],
    })
  );

  server.registerTool(
    "open_chatui",
    {
      title: "Open Chat UI",
      description:
        "Renders the ChatUI widget. In ChatGPT, this tool returns the widget template and optional seed data.",
      inputSchema: openChatUiInputSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/chatui.html",
        "openai/toolInvocation/invoking": "Opening Chat UI",
        "openai/toolInvocation/invoked": "Opened Chat UI",
      },
    },
    async (args) => {
      const seedMessage = args?.seedMessage?.trim?.() ?? "";

      return {
        content: seedMessage ? [{ type: "text", text: seedMessage }] : [],
        structuredContent: {
          seedMessage,
        },
      };
    }
  );

  return server;
}

const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res
      .writeHead(200, { "content-type": "text/plain" })
      .end("ChatUI MCP server");
    return;
  }

  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    const server = createChatUiServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.writeHead(500).end("Internal server error");
      }
    }

    return;
  }

  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(`ChatUI MCP server listening on http://localhost:${port}${MCP_PATH}`);
  console.log(`Widget source: ${widgetHtmlPath}`);
});
