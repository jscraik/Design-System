import { createServer } from "node:http";

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP
const rateLimitStore = new Map();
let lastRateLimitCleanupAt = 0;

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || "unknown";
  const record = rateLimitStore.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  rateLimitStore.set(key, record);

  if (now - lastRateLimitCleanupAt > RATE_LIMIT_WINDOW_MS) {
    lastRateLimitCleanupAt = now;
    for (const [storedKey, storedValue] of rateLimitStore.entries()) {
      if (now > storedValue.resetAt + RATE_LIMIT_WINDOW_MS) {
        rateLimitStore.delete(storedKey);
      }
    }
  }

  return true;
}

export function startMcpHttpServer({ createServerInstance, rootMessage, onListen } = {}) {
  if (typeof createServerInstance !== "function") {
    throw new Error("startMcpHttpServer requires a createServerInstance function");
  }

  const port = Number(process.env.PORT ?? 8787);
  const host = process.env.MCP_BIND_HOST ?? "127.0.0.1";
  const MCP_PATH = "/mcp";
  const CORS_ORIGIN = process.env.MCP_CORS_ORIGIN ?? "*";
  const DNS_REBINDING_PROTECTION = process.env.MCP_DNS_REBINDING_PROTECTION === "true";
  const ALLOWED_HOSTS = (process.env.MCP_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  const httpServer = createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(400).end("Missing URL");
      return;
    }

    const clientIp =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.headers["x-real-ip"]?.toString() ||
      req.socket.remoteAddress ||
      "unknown";

    if (!checkRateLimit(clientIp)) {
      res.writeHead(429, {
        "Content-Type": "application/json",
        "Retry-After": "60",
        "Access-Control-Allow-Origin": CORS_ORIGIN,
      });
      res.end(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }));
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": CORS_ORIGIN,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, mcp-session-id, mcp-protocol-version",
        "Access-Control-Expose-Headers": "Mcp-Session-Id",
      });
      res.end();
      return;
    }

    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "content-type": "text/plain" }).end(rootMessage ?? "MCP server");
      return;
    }

    const MCP_METHODS = new Set(["POST", "GET"]);
    if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
      res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
      res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

      const server = createServerInstance();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
        ...(DNS_REBINDING_PROTECTION
          ? {
              enableDnsRebindingProtection: true,
              allowedHosts: ALLOWED_HOSTS.length > 0 ? ALLOWED_HOSTS : ["127.0.0.1", "localhost"],
            }
          : {}),
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

  httpServer.listen(port, host, () => {
    console.log(`${rootMessage ?? "MCP server"} listening on http://${host}:${port}${MCP_PATH}`);
    onListen?.({ host, port, mcpPath: MCP_PATH });
  });
}
