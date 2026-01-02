import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

// Import the new widget registry system
import {
  createResourceMeta,
  createWidgetTools,
} from "../../packages/widgets/src/shared/widget-registry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP
const rateLimitStore = new Map();

// Rate limiting middleware
function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || "unknown";
  const record = rateLimitStore.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  // Reset if window expired
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  // Check limit
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  // Increment counter
  record.count++;
  rateLimitStore.set(key, record);

  // Cleanup old entries periodically
  if (Math.random() < 0.01) {
    // 1% chance to cleanup
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetAt + RATE_LIMIT_WINDOW_MS) {
        rateLimitStore.delete(k);
      }
    }
  }

  return true;
}
const widgetHtmlPath = process.env.WEB_WIDGET_HTML
  ? path.resolve(process.env.WEB_WIDGET_HTML)
  : path.resolve(__dirname, "../web/apps/web/dist/widget.html");
const widgetsDistPath = process.env.WIDGETS_DIST
  ? path.resolve(process.env.WIDGETS_DIST)
  : path.resolve(__dirname, "../../packages/widgets/dist/src");
const CORS_ORIGIN = process.env.MCP_CORS_ORIGIN ?? "*";
const DNS_REBINDING_PROTECTION = process.env.MCP_DNS_REBINDING_PROTECTION === "true";
const ALLOWED_HOSTS = (process.env.MCP_ALLOWED_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

// Environment configuration for resource metadata
const WORKER_DOMAIN = process.env.WORKER_DOMAIN;
const WIDGET_DOMAIN = process.env.WIDGET_DOMAIN;

function readWidgetHtml() {
  if (!existsSync(widgetHtmlPath)) {
    throw new Error(
      "Widget HTML not found. Build the web widget first (pnpm -C platforms/web/apps/web build:widget) or set WEB_WIDGET_HTML.",
    );
  }
  return readFileSync(widgetHtmlPath, "utf8");
}

const widgetIndex = new Map();

function buildWidgetIndex(rootDir) {
  widgetIndex.clear();

  const stack = [rootDir];
  while (stack.length > 0) {
    const currentDir = stack.pop();
    if (!currentDir) continue;

    let entries = [];
    try {
      entries = readdirSync(currentDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
        continue;
      }
      if (entry.isFile() && entry.name === "index.html") {
        const widgetId = path.basename(path.dirname(entryPath));
        if (!widgetIndex.has(widgetId)) {
          widgetIndex.set(widgetId, entryPath);
        }
      }
    }
  }
}

function resolveWidgetPath(widgetName) {
  if (widgetIndex.size === 0) {
    buildWidgetIndex(widgetsDistPath);
  }
  return widgetIndex.get(widgetName) ?? path.join(widgetsDistPath, widgetName, "index.html");
}

function readWidgetBundle(widgetName) {
  const widgetPath = resolveWidgetPath(widgetName);
  if (!existsSync(widgetPath)) {
    throw new Error(
      `Widget bundle not found: ${widgetName}. Build widgets first (pnpm -C packages/widgets build) or set WIDGETS_DIST.`,
    );
  }
  return readFileSync(widgetPath, "utf8");
}

// Import widget manifest (will be auto-generated)
let widgetManifest;
try {
  const manifestPath = path.resolve(
    __dirname,
    "../../packages/widgets/src/sdk/generated/widget-manifest.js",
  );
  if (existsSync(manifestPath)) {
    widgetManifest = await import(manifestPath);
  }
} catch (error) {
  console.warn("Widget manifest not found, using fallback configuration", error);
  // Fallback to manual configuration if manifest not available
  widgetManifest = {
    widgetManifest: {
      "auth-demo": { name: "auth-demo", uri: "auth-demo.fallback", hash: "fallback" },
      "chat-view": { name: "chat-view", uri: "chat-view.fallback", hash: "fallback" },
      "dashboard-widget": {
        name: "dashboard-widget",
        uri: "dashboard-widget.fallback",
        hash: "fallback",
      },
      "kitchen-sink-lite": {
        name: "kitchen-sink-lite",
        uri: "kitchen-sink-lite.fallback",
        hash: "fallback",
      },
      "pizzaz-carousel": {
        name: "pizzaz-carousel",
        uri: "pizzaz-carousel.fallback",
        hash: "fallback",
      },
      "pizzaz-gallery": {
        name: "pizzaz-gallery",
        uri: "pizzaz-gallery.fallback",
        hash: "fallback",
      },
      "pizzaz-markdown": {
        name: "pizzaz-markdown",
        uri: "pizzaz-markdown.fallback",
        hash: "fallback",
      },
      "pizzaz-shop": { name: "pizzaz-shop", uri: "pizzaz-shop.fallback", hash: "fallback" },
      "pizzaz-table": { name: "pizzaz-table", uri: "pizzaz-table.fallback", hash: "fallback" },
      "search-results": {
        name: "search-results",
        uri: "search-results.fallback",
        hash: "fallback",
      },
      "shopping-cart": { name: "shopping-cart", uri: "shopping-cart.fallback", hash: "fallback" },
      "solar-system": { name: "solar-system", uri: "solar-system.fallback", hash: "fallback" },
    },
  };
}

// Tool input schemas (keeping existing schemas)
const displayChatInputSchema = {
  seedMessage: z
    .string()
    .optional()
    .describe("Optional initial message to seed the chat conversation"),
};

const displaySearchResultsInputSchema = {
  query: z.string().describe("The search query that was performed"),
  results: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]).describe("Unique identifier for the result"),
        title: z.string().describe("Title of the search result"),
        description: z.string().optional().describe("Brief description of the result"),
        url: z.string().optional().describe("URL to the full content"),
        tags: z.array(z.string()).optional().describe("Tags or categories for the result"),
      }),
    )
    .describe("Array of search results to display"),
};

const displayTableInputSchema = {
  title: z.string().optional().describe("Optional title for the table"),
  columns: z.array(z.string()).describe("Column headers for the table"),
  rows: z.array(z.record(z.any())).describe("Array of row objects with keys matching column names"),
};

const displayDashboardInputSchema = {};

// Shopping Cart schemas
const cartItemSchema = z.object({
  id: z.string().describe("Unique identifier for the item"),
  name: z.string().describe("Display name of the item"),
  price: z.number().describe("Price per unit"),
  quantity: z.number().describe("Quantity to add"),
  image: z.string().optional().describe("URL to item image"),
  description: z.string().optional().describe("Brief item description"),
});

const addToCartInputSchema = {
  items: z.array(cartItemSchema).describe("Items to add to the cart"),
  sessionId: z.string().optional().describe("Cart session ID for cross-turn persistence"),
};

const _removeFromCartInputSchema = {
  itemIds: z.array(z.string()).describe("IDs of items to remove from cart"),
  sessionId: z.string().optional().describe("Cart session ID"),
};

const _showCartInputSchema = {
  sessionId: z.string().optional().describe("Cart session ID to display"),
};

// Pizzaz Shop schemas
const _showShopInputSchema = {
  view: z.enum(["cart", "checkout", "confirmation"]).optional().describe("Initial view to display"),
  items: z.array(cartItemSchema).optional().describe("Pre-populate cart with items"),
};

const _placeOrderInputSchema = {
  deliveryOption: z.enum(["standard", "express"]).optional().describe("Delivery speed"),
  tipPercent: z.number().optional().describe("Tip percentage (0, 10, 15, 20)"),
};

// Auth Demo schemas
const _authStatusInputSchema = {
  checkLevel: z
    .enum(["none", "basic", "oauth", "oauth_elevated"])
    .optional()
    .describe("Minimum auth level to check for"),
};

const _authLoginInputSchema = {
  provider: z.string().optional().describe("OAuth provider (e.g., 'google', 'github')"),
  scopes: z.array(z.string()).optional().describe("Requested OAuth scopes"),
};

const _authLogoutInputSchema = {};

const _authRefreshInputSchema = {
  forceRefresh: z.boolean().optional().describe("Force token refresh even if not expired"),
};

function createEnhancedChatUiServer() {
  const server = new McpServer({
    name: "chatui-enhanced",
    version: "2.0.0",
  });

  // Create environment-aware resource metadata
  const resourceMeta = createResourceMeta({
    workerDomain: WORKER_DOMAIN,
    widgetDomain: WIDGET_DOMAIN,
    resourceDomains: ["web-sandbox.oaiusercontent.com"],
  });

  // Auto-register widget resources using manifest
  Object.entries(widgetManifest.widgetManifest).forEach(([widgetName, widgetInfo]) => {
    const uri = `ui://widget/${widgetInfo.uri}`;

    server.registerResource(`${widgetName}-widget`, uri, {}, async () => ({
      contents: [
        {
          uri,
          mimeType: "text/html+skybridge",
          text: readWidgetBundle(widgetName),
          _meta: {
            "openai/widgetPrefersBorder": true,
            "openai/widgetDescription": `Interactive ${widgetName} component with auto-generated cache busting`,
            "openai/widgetCSP": resourceMeta["openai/widgetCSP"],
            ...(resourceMeta["openai/widgetDomain"] && {
              "openai/widgetDomain": resourceMeta["openai/widgetDomain"],
            }),
          },
        },
      ],
    }));
  });

  // Main ChatUI widget resource
  server.registerResource("chatui-widget", "ui://widget/chatui.html", {}, async () => ({
    contents: [
      {
        uri: "ui://widget/chatui.html",
        mimeType: "text/html+skybridge",
        text: readWidgetHtml(),
        _meta: {
          "openai/widgetPrefersBorder": true,
          "openai/widgetDescription": "Interactive chat interface with Apps SDK UI components",
          "openai/widgetCSP": resourceMeta["openai/widgetCSP"],
          ...(resourceMeta["openai/widgetDomain"] && {
            "openai/widgetDomain": resourceMeta["openai/widgetDomain"],
          }),
        },
      },
    ],
  }));

  // Create widget tools using the new registry system
  const widgetTools = createWidgetTools([
    {
      widgetName: "chat-view",
      meta: {
        title: "Display Chat Interface",
        description: "Displays an interactive chat interface widget with seed message support",
        invoking: "Opening chat interface...",
        invoked: "Chat interface ready",
        accessible: false,
      },
      handler: async (args, { _meta } = {}) => {
        const seedMessage = args?.seedMessage?.trim?.() ?? "";
        const locale = _meta?.["openai/locale"] ?? "en";
        const userAgent = _meta?.["openai/userAgent"];
        const userLocation = _meta?.["openai/userLocation"];

        return {
          content: [
            {
              type: "text",
              text: seedMessage
                ? `Chat interface opened with message: "${seedMessage}"`
                : "Chat interface opened",
            },
          ],
          structuredContent: {
            seedMessage,
            locale,
          },
          _meta: {
            clientInfo: {
              userAgent,
              location: userLocation,
            },
          },
        };
      },
    },
    {
      widgetName: "search-results",
      meta: {
        title: "Display Search Results",
        description: "Displays search results in a structured, scannable card layout",
        invoking: "Preparing search results...",
        invoked: "Search results displayed",
        accessible: false,
      },
      handler: async (args, { _meta } = {}) => {
        const { query, results } = args;
        const count = results?.length ?? 0;
        const locale = _meta?.["openai/locale"] ?? "en";
        const userLocation = _meta?.["openai/userLocation"];

        return {
          content: [
            {
              type: "text",
              text: `Displaying ${count} result${count !== 1 ? "s" : ""} for "${query}"`,
            },
          ],
          structuredContent: {
            query,
            results,
            locale,
          },
          _meta: {
            searchContext: {
              location: userLocation,
              timestamp: new Date().toISOString(),
            },
          },
        };
      },
    },
    {
      widgetName: "pizzaz-table",
      meta: {
        title: "Display Data Table",
        description: "Displays data in a structured table format with columns and rows",
        invoking: "Preparing table...",
        invoked: "Table displayed",
        accessible: false,
      },
      handler: async (args, { _meta } = {}) => {
        const { title, columns, rows } = args;
        const rowCount = rows?.length ?? 0;
        const locale = _meta?.["openai/locale"] ?? "en";

        return {
          content: [
            {
              type: "text",
              text: title
                ? `Displaying "${title}" with ${rowCount} row${rowCount !== 1 ? "s" : ""}`
                : `Displaying table with ${rowCount} row${rowCount !== 1 ? "s" : ""}`,
            },
          ],
          structuredContent: {
            title,
            columns,
            data: rows,
            locale,
          },
          _meta: {
            tableContext: {
              generatedAt: new Date().toISOString(),
            },
          },
        };
      },
    },
    {
      widgetName: "dashboard-widget",
      meta: {
        title: "Display Dashboard",
        description: "Displays a dashboard widget with analytics and quick actions",
        invoking: "Opening dashboard...",
        invoked: "Dashboard ready",
        accessible: false,
      },
      handler: async () => {
        return {
          content: [{ type: "text", text: "Dashboard displayed" }],
          structuredContent: {
            dashboard: true,
            headerText: "ChatGPT Dashboard Widget",
            stats: [
              { label: "Total Conversations", value: "1,234", change: "+12%" },
              { label: "Messages Today", value: "89", change: "+5%" },
              { label: "Active Models", value: "3", change: "0%" },
              { label: "Response Time", value: "1.2s", change: "-8%" },
            ],
            recentChats: [
              { id: 1, title: "Code Review Session", model: "GPT-4", time: "2 min ago" },
              { id: 2, title: "Project Planning", model: "Claude", time: "1 hour ago" },
              { id: 3, title: "Debug Help", model: "GPT-4o", time: "3 hours ago" },
            ],
          },
        };
      },
    },
    {
      widgetName: "kitchen-sink-lite",
      meta: {
        title: "Display Demo Widget",
        description: "Displays a demonstration widget showcasing various Apps SDK capabilities",
        invoking: "Loading demo...",
        invoked: "Demo widget ready",
        accessible: false,
      },
      handler: async () => {
        return {
          content: [{ type: "text", text: "Demo widget displayed" }],
          structuredContent: { demo: true },
        };
      },
    },
    {
      widgetName: "shopping-cart",
      meta: {
        title: "Add to Cart",
        description: "Adds items to the shopping cart with session persistence",
        invoking: "Adding items to cart...",
        invoked: "Items added to cart",
        accessible: true, // Widget can call this tool directly
      },
      handler: async (args, { _meta } = {}) => {
        const { items, sessionId } = args;
        const widgetSessionId = sessionId ?? `cart-${Date.now().toString(36)}`;

        return {
          content: [
            {
              type: "text",
              text: `Added ${items.length} item(s) to cart`,
            },
          ],
          structuredContent: {
            action: "add",
            items,
          },
          _meta: {
            widgetSessionId,
          },
        };
      },
    },
    // Add more widget tools as needed...
  ]);

  // Register all widget tools
  widgetTools.forEach(({ name, config, handler }) => {
    // Convert the standardized config to MCP server format
    server.registerTool(
      name,
      {
        title: config.title,
        description: config.description,
        inputSchema: getInputSchemaForTool(name), // Helper function to get appropriate schema
        securitySchemes: [{ type: "noauth" }],
        annotations: getAnnotationsForTool(name), // Helper function to get appropriate annotations
        _meta: config._meta,
      },
      handler,
    );
  });

  return server;
}

// Helper functions to get appropriate schemas and annotations
function getInputSchemaForTool(toolName) {
  const schemaMap = {
    "chat-view": displayChatInputSchema,
    "search-results": displaySearchResultsInputSchema,
    "pizzaz-table": displayTableInputSchema,
    "dashboard-widget": displayDashboardInputSchema,
    "kitchen-sink-lite": {},
    "shopping-cart": addToCartInputSchema,
    // Add more mappings as needed
  };
  return schemaMap[toolName] || {};
}

function getAnnotationsForTool(toolName) {
  const readOnlyTools = [
    "chat-view",
    "search-results",
    "pizzaz-table",
    "dashboard-widget",
    "kitchen-sink-lite",
  ];
  const isReadOnly = readOnlyTools.includes(toolName);

  return {
    readOnlyHint: isReadOnly,
    destructiveHint: false,
    openWorldHint: false,
    idempotentHint: isReadOnly,
  };
}

export { createEnhancedChatUiServer };

// Direct run support (same as original)
const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const port = Number(process.env.PORT ?? 8787);
  const MCP_PATH = "/mcp";

  const httpServer = createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(400).end("Missing URL");
      return;
    }

    // Rate limiting check
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
        "Access-Control-Allow-Headers": "content-type, mcp-session-id",
        "Access-Control-Expose-Headers": "Mcp-Session-Id",
      });
      res.end();
      return;
    }

    if (req.method === "GET" && url.pathname === "/") {
      res
        .writeHead(200, { "content-type": "text/plain" })
        .end("ChatUI Enhanced MCP server - Auto-discovery enabled");
      return;
    }

    const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
    if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
      res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
      res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

      const server = createEnhancedChatUiServer();
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

  httpServer.listen(port, () => {
    console.log(`ChatUI Enhanced MCP server listening on http://localhost:${port}${MCP_PATH}`);
    console.log(`Widget source: ${widgetHtmlPath}`);
    console.log(`Widget bundles: ${widgetsDistPath}`);
    console.log(
      `Auto-discovery: ${Object.keys(widgetManifest.widgetManifest).length} widgets found`,
    );
  });
}
