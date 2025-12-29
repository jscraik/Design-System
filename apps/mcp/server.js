import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const widgetHtmlPath = process.env.WEB_WIDGET_HTML
  ? path.resolve(process.env.WEB_WIDGET_HTML)
  : path.resolve(__dirname, "../web/dist/widget.html");
const widgetsDistPath = process.env.WIDGETS_DIST
  ? path.resolve(process.env.WIDGETS_DIST)
  : path.resolve(__dirname, "../../packages/widgets/dist/src");
const CORS_ORIGIN = process.env.MCP_CORS_ORIGIN ?? "*";
const DNS_REBINDING_PROTECTION =
  process.env.MCP_DNS_REBINDING_PROTECTION === "true";
const ALLOWED_HOSTS = (process.env.MCP_ALLOWED_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

// Widget version for cache busting - increment on breaking changes
const WIDGET_VERSION = "1.0.0";

// Generate versioned URI for cache busting
function versionedUri(widgetId) {
  return `ui://widget/${widgetId}.html?v=${WIDGET_VERSION}`;
}

// Helper to get versioned output template for tools
function outputTemplate(widgetId) {
  return versionedUri(widgetId);
}

function readWidgetHtml() {
  if (!existsSync(widgetHtmlPath)) {
    throw new Error(
      "Widget HTML not found. Build the web widget first (pnpm -C apps/web build:widget) or set WEB_WIDGET_HTML.",
    );
  }
  return readFileSync(widgetHtmlPath, "utf8");
}

function readWidgetBundle(widgetId) {
  const widgetPath = path.join(widgetsDistPath, widgetId, "index.html");
  if (!existsSync(widgetPath)) {
    throw new Error(
      `Widget bundle not found: ${widgetId}. Build widgets first (pnpm -C packages/widgets build) or set WIDGETS_DIST.`,
    );
  }
  return readFileSync(widgetPath, "utf8");
}

// Tool input schemas with detailed descriptions per Apps SDK guidelines
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

const removeFromCartInputSchema = {
  itemIds: z.array(z.string()).describe("IDs of items to remove from cart"),
  sessionId: z.string().optional().describe("Cart session ID"),
};

const showCartInputSchema = {
  sessionId: z.string().optional().describe("Cart session ID to display"),
};

// Pizzaz Shop schemas
const showShopInputSchema = {
  view: z.enum(["cart", "checkout", "confirmation"]).optional().describe("Initial view to display"),
  items: z.array(cartItemSchema).optional().describe("Pre-populate cart with items"),
};

const placeOrderInputSchema = {
  deliveryOption: z.enum(["standard", "express"]).optional().describe("Delivery speed"),
  tipPercent: z.number().optional().describe("Tip percentage (0, 10, 15, 20)"),
};

// Auth Demo schemas
const authStatusInputSchema = {
  checkLevel: z
    .enum(["none", "basic", "oauth", "oauth_elevated"])
    .optional()
    .describe("Minimum auth level to check for"),
};

const authLoginInputSchema = {
  provider: z.string().optional().describe("OAuth provider (e.g., 'google', 'github')"),
  scopes: z.array(z.string()).optional().describe("Requested OAuth scopes"),
};

const authLogoutInputSchema = {};

const authRefreshInputSchema = {
  forceRefresh: z.boolean().optional().describe("Force token refresh even if not expired"),
};

function createChatUiServer() {
  const server = new McpServer({
    name: "chatui",
    version: "1.0.0",
  });

  // Widget resources
  const widgetConfigs = [
    { id: "auth-demo", name: "Auth Demo" },
    { id: "chat-view", name: "Chat View" },
    { id: "dashboard-widget", name: "Dashboard" },
    { id: "kitchen-sink-lite", name: "Kitchen Sink Demo" },
    { id: "pizzaz-carousel", name: "Pizzaz Carousel" },
    { id: "pizzaz-gallery", name: "Pizzaz Gallery" },
    { id: "pizzaz-markdown", name: "Pizzaz Markdown" },
    { id: "pizzaz-shop", name: "Pizzaz Shop" },
    { id: "pizzaz-table", name: "Data Table" },
    { id: "search-results", name: "Search Results" },
    { id: "shopping-cart", name: "Shopping Cart" },
    { id: "solar-system", name: "Solar System" },
  ];

  const widgetIds = new Set();
  widgetConfigs.forEach(({ id }) => {
    if (widgetIds.has(id)) {
      throw new Error(`Duplicate widget id detected: ${id}`);
    }
    widgetIds.add(id);
  });

  // Widget resources with enhanced metadata
  widgetConfigs.forEach(({ id, name }) => {
    const uri = versionedUri(id);
    server.registerResource(`${id}-widget`, uri, {}, async () => ({
      contents: [
        {
          uri,
          mimeType: "text/html+skybridge",
          text: readWidgetBundle(id),
          _meta: {
            "openai/widgetPrefersBorder": true,
            "openai/widgetDescription": `Interactive ${name} component for displaying structured data`,
            "openai/widgetCSP": {
              connect_domains: [],
              resource_domains: ["web-sandbox.oaiusercontent.com"],
            },
          },
        },
      ],
    }));
  });

  // Main ChatUI widget resource with enhanced metadata
  server.registerResource("chatui-widget", "ui://widget/chatui.html", {}, async () => ({
    contents: [
      {
        uri: "ui://widget/chatui.html",
        mimeType: "text/html+skybridge",
        text: readWidgetHtml(),
        _meta: {
          "openai/widgetPrefersBorder": true,
          "openai/widgetDescription": "Interactive chat interface with Apps SDK UI components",
          "openai/widgetCSP": {
            connect_domains: [],
            resource_domains: ["web-sandbox.oaiusercontent.com"],
          },
        },
      },
    ],
  }));

  /**
   * Tool: display_chat
   * Purpose: Display an interactive chat interface
   * Type: Read-only (displays UI, no external side effects)
   */
  server.registerTool(
    "display_chat",
    {
      title: "Display Chat Interface",
      description:
        "Displays an interactive chat interface widget. Use this when the user wants " +
        "to have a conversation-style interaction or needs a dedicated chat view. " +
        "This tool only renders a UI and does not modify any external data.",
      inputSchema: displayChatInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        // Per Apps SDK guidelines: mark read-only tools correctly
        readOnlyHint: true, // This tool only displays UI, no side effects
        destructiveHint: false, // Does not delete or modify data
        openWorldHint: false, // Does not interact with external systems
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("chat-view"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Opening chat interface...",
        "openai/toolInvocation/invoked": "Chat interface ready",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const seedMessage = args?.seedMessage?.trim?.() ?? "";

      // Extract client metadata per Apps SDK guidelines
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
          // Widget-specific metadata (hidden from model)
          clientInfo: {
            userAgent,
            location: userLocation,
          },
        },
      };
    },
  );

  /**
   * Tool: display_search_results
   * Purpose: Display search results in a structured, scannable format
   * Type: Read-only (displays data, no external side effects)
   */
  server.registerTool(
    "display_search_results",
    {
      title: "Display Search Results",
      description:
        "Displays search results in a visually structured card layout with titles, " +
        "descriptions, and optional tags. Use this when presenting multiple search " +
        "results, recommendations, or lists of items that users need to scan and " +
        "choose from. This tool only renders results and does not perform searches.",
      inputSchema: displaySearchResultsInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: true, // Only displays data
        destructiveHint: false, // Does not modify data
        openWorldHint: false, // Does not interact with external systems
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("search-results"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Preparing search results...",
        "openai/toolInvocation/invoked": "Search results displayed",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const { query, results } = args;
      const count = results?.length ?? 0;

      // Extract client metadata
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
          // Widget-specific metadata
          searchContext: {
            location: userLocation,
            timestamp: new Date().toISOString(),
          },
        },
      };
    },
  );

  /**
   * Tool: display_table
   * Purpose: Display tabular data in a structured table format
   * Type: Read-only (displays data, no external side effects)
   */
  server.registerTool(
    "display_table",
    {
      title: "Display Data Table",
      description:
        "Displays data in a structured table format with columns and rows. Use this " +
        "when presenting structured data, comparisons, or lists that benefit from " +
        "tabular layout. Ideal for showing prices, specifications, schedules, or " +
        "any data with consistent fields across items.",
      inputSchema: displayTableInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: true, // Only displays data
        destructiveHint: false, // Does not modify data
        openWorldHint: false, // Does not interact with external systems
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("pizzaz-table"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Preparing table...",
        "openai/toolInvocation/invoked": "Table displayed",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const { title, columns, rows } = args;
      const rowCount = rows?.length ?? 0;

      // Extract client metadata
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
          // Widget-specific metadata
          tableContext: {
            generatedAt: new Date().toISOString(),
          },
        },
      };
    },
  );

  /**
   * Tool: display_demo
   * Purpose: Display the kitchen sink demo widget for testing
   * Type: Read-only (displays UI, no external side effects)
   */
  server.registerTool(
    "display_demo",
    {
      title: "Display Demo Widget",
      description:
        "Displays a demonstration widget showcasing various Apps SDK capabilities. " +
        "Use this for testing or demonstrating the widget system. This is primarily " +
        "for development and testing purposes.",
      inputSchema: {},
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("kitchen-sink-lite"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Loading demo...",
        "openai/toolInvocation/invoked": "Demo widget ready",
        "openai/fileParams": [],
      },
    },
    async () => {
      return {
        content: [{ type: "text", text: "Demo widget displayed" }],
        structuredContent: { demo: true },
      };
    },
  );

  /**
   * Tool: display_dashboard
   * Purpose: Display the dashboard widget
   * Type: Read-only (displays UI, no external side effects)
   */
  server.registerTool(
    "display_dashboard",
    {
      title: "Display Dashboard",
      description:
        "Displays a dashboard widget with analytics and quick actions. " +
        "Use this when the user wants a high-level overview or a dashboard-style view.",
      inputSchema: displayDashboardInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("dashboard-widget"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Opening dashboard...",
        "openai/toolInvocation/invoked": "Dashboard ready",
        "openai/fileParams": [],
      },
    },
    async () => {
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
  );

  // ============================================================
  // Shopping Cart Tools
  // ============================================================

  /**
   * Tool: add_to_cart
   * Purpose: Add items to the shopping cart
   * Type: Stateful (modifies cart state via widgetSessionId)
   */
  server.registerTool(
    "add_to_cart",
    {
      title: "Add to Cart",
      description:
        "Adds one or more items to the shopping cart. Use this when the user wants to " +
        "add products to their cart. The cart persists across conversation turns using " +
        "widgetSessionId. Returns the updated cart state.",
      inputSchema: addToCartInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
        idempotentHint: false,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("shopping-cart"),
        "openai/widgetAccessible": true, // Widget can call this tool directly
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Adding items to cart...",
        "openai/toolInvocation/invoked": "Items added to cart",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
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
  );

  /**
   * Tool: remove_from_cart
   * Purpose: Remove items from the shopping cart
   * Type: Stateful (modifies cart state)
   */
  server.registerTool(
    "remove_from_cart",
    {
      title: "Remove from Cart",
      description:
        "Removes items from the shopping cart by their IDs. Use this when the user " +
        "wants to remove specific products from their cart.",
      inputSchema: removeFromCartInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("shopping-cart"),
        "openai/widgetAccessible": true, // Widget can call this tool directly
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Removing items from cart...",
        "openai/toolInvocation/invoked": "Items removed from cart",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const { itemIds, sessionId } = args;

      return {
        content: [
          {
            type: "text",
            text: `Removed ${itemIds.length} item(s) from cart`,
          },
        ],
        structuredContent: {
          action: "remove",
          items: itemIds.map((id) => ({ id })),
        },
        _meta: {
          widgetSessionId: sessionId,
        },
      };
    },
  );

  /**
   * Tool: show_cart
   * Purpose: Display the current shopping cart
   * Type: Read-only (displays current state)
   */
  server.registerTool(
    "show_cart",
    {
      title: "Show Cart",
      description:
        "Displays the current shopping cart contents. Use this when the user wants " +
        "to see what's in their cart, review items, or proceed to checkout.",
      inputSchema: showCartInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("shopping-cart"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Loading cart...",
        "openai/toolInvocation/invoked": "Cart displayed",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const { sessionId } = args;

      return {
        content: [{ type: "text", text: "Shopping cart displayed" }],
        structuredContent: {
          action: "show",
        },
        _meta: {
          widgetSessionId: sessionId,
        },
      };
    },
  );

  // ============================================================
  // Pizzaz Shop Tools
  // ============================================================

  /**
   * Tool: show_shop
   * Purpose: Display the Pizzaz Shop e-commerce interface
   * Type: Read-only (displays UI)
   */
  server.registerTool(
    "show_shop",
    {
      title: "Show Pizzaz Shop",
      description:
        "Displays the Pizzaz Shop e-commerce interface with cart, checkout, and " +
        "order confirmation views. Use this for demonstrating a full checkout flow " +
        "with animated transitions and multi-step navigation.",
      inputSchema: showShopInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("pizzaz-shop"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Opening Pizzaz Shop...",
        "openai/toolInvocation/invoked": "Pizzaz Shop ready",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const { view, items } = args;

      return {
        content: [{ type: "text", text: "Pizzaz Shop displayed" }],
        structuredContent: {
          view: view ?? "cart",
          items,
        },
      };
    },
  );

  /**
   * Tool: place_order
   * Purpose: Place an order in the Pizzaz Shop
   * Type: Stateful (creates order)
   */
  server.registerTool(
    "place_order",
    {
      title: "Place Order",
      description:
        "Places an order in the Pizzaz Shop with the current cart contents. " +
        "Optionally specify delivery option and tip percentage.",
      inputSchema: placeOrderInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
        idempotentHint: false,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("pizzaz-shop"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Placing order...",
        "openai/toolInvocation/invoked": "Order placed successfully",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const { deliveryOption, tipPercent } = args;
      const orderId = `PZ-${Date.now().toString(36).toUpperCase()}`;

      return {
        content: [
          {
            type: "text",
            text: `Order ${orderId} placed successfully`,
          },
        ],
        structuredContent: {
          view: "confirmation",
          orderId,
          deliveryOption: deliveryOption ?? "standard",
          tipPercent: tipPercent ?? 10,
        },
      };
    },
  );

  // ============================================================
  // Auth Demo Tools
  // ============================================================

  /**
   * Tool: auth_status
   * Purpose: Check current authentication status
   * Type: Read-only (displays auth state)
   */
  server.registerTool(
    "auth_status",
    {
      title: "Check Auth Status",
      description:
        "Displays the current authentication status including auth level, provider, " +
        "expiration, and granted scopes. Use this to show users their current auth state.",
      inputSchema: authStatusInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("auth-demo"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Checking auth status...",
        "openai/toolInvocation/invoked": "Auth status retrieved",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const { checkLevel } = args;

      // Simulated auth status (in production, this would check real auth state)
      const authStatus = {
        authenticated: true,
        level: "oauth",
        provider: "demo",
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        scopes: ["read", "write", "profile"],
      };

      const meetsLevel =
        !checkLevel ||
        ["none", "basic", "oauth", "oauth_elevated"].indexOf(authStatus.level) >=
          ["none", "basic", "oauth", "oauth_elevated"].indexOf(checkLevel);

      return {
        content: [
          {
            type: "text",
            text: authStatus.authenticated
              ? `Authenticated via ${authStatus.provider} (${authStatus.level})`
              : "Not authenticated",
          },
        ],
        structuredContent: {
          authStatus,
          meetsRequiredLevel: meetsLevel,
        },
        _meta: {
          authStatus,
        },
      };
    },
  );

  /**
   * Tool: auth_login
   * Purpose: Initiate authentication flow
   * Type: Stateful (initiates auth)
   */
  server.registerTool(
    "auth_login",
    {
      title: "Login",
      description:
        "Initiates an authentication flow. In production, this would redirect to " +
        "an OAuth provider. For demo purposes, simulates successful authentication.",
      inputSchema: authLoginInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
        idempotentHint: false,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("auth-demo"),
        "openai/widgetAccessible": false,
        "openai/visibility": "public",
        "openai/toolInvocation/invoking": "Initiating login...",
        "openai/toolInvocation/invoked": "Login successful",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const { provider, scopes } = args;

      const authStatus = {
        authenticated: true,
        level: "oauth",
        provider: provider ?? "demo",
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        scopes: scopes ?? ["read", "write"],
      };

      const user = {
        id: "demo-user-123",
        name: "Demo User",
        email: "demo@example.com",
        plan: "Pro",
      };

      return {
        content: [
          {
            type: "text",
            text: `Successfully authenticated as ${user.name}`,
          },
        ],
        structuredContent: {
          authStatus,
          user,
        },
        _meta: {
          authStatus,
        },
      };
    },
  );

  /**
   * Tool: auth_logout
   * Purpose: End authentication session
   * Type: Stateful (clears auth)
   * Note: Private visibility - widget-only, hidden from model
   */
  server.registerTool(
    "auth_logout",
    {
      title: "Logout",
      description: "Ends the current authentication session and clears credentials.",
      inputSchema: authLogoutInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("auth-demo"),
        "openai/widgetAccessible": true, // Widget can call this tool directly
        "openai/visibility": "private", // Hidden from model - widget-only
        "openai/toolInvocation/invoking": "Logging out...",
        "openai/toolInvocation/invoked": "Logged out successfully",
        "openai/fileParams": [],
      },
    },
    async () => {
      return {
        content: [{ type: "text", text: "Successfully logged out" }],
        structuredContent: {
          authStatus: {
            authenticated: false,
            level: "none",
          },
        },
        _meta: {
          authStatus: {
            authenticated: false,
            level: "none",
          },
        },
      };
    },
  );

  /**
   * Tool: auth_refresh
   * Purpose: Refresh authentication token
   * Type: Stateful (refreshes token)
   * Note: Private visibility - widget-only, hidden from model
   */
  server.registerTool(
    "auth_refresh",
    {
      title: "Refresh Auth",
      description: "Refreshes the current authentication token to extend the session.",
      inputSchema: authRefreshInputSchema,
      securitySchemes: [{ type: "noauth" }],
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
        idempotentHint: true,
      },
      _meta: {
        securitySchemes: [{ type: "noauth" }],
        "openai/outputTemplate": outputTemplate("auth-demo"),
        "openai/widgetAccessible": true, // Widget can call this tool directly
        "openai/visibility": "private", // Hidden from model - widget-only
        "openai/toolInvocation/invoking": "Refreshing auth...",
        "openai/toolInvocation/invoked": "Auth refreshed",
        "openai/fileParams": [],
      },
    },
    async (args, { _meta } = {}) => {
      const authStatus = {
        authenticated: true,
        level: "oauth",
        provider: "demo",
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        scopes: ["read", "write", "profile"],
      };

      return {
        content: [
          {
            type: "text",
            text: `Auth token refreshed, expires at ${authStatus.expiresAt}`,
          },
        ],
        structuredContent: {
          authStatus,
        },
        _meta: {
          authStatus,
        },
      };
    },
  );

  return server;
}

export { createChatUiServer, outputTemplate, versionedUri, WIDGET_VERSION };

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
        .end("ChatUI MCP server - Apps SDK compliant");
      return;
    }

    const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
    if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
      res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
      res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

      const server = createChatUiServer();
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
    console.log(`ChatUI MCP server listening on http://localhost:${port}${MCP_PATH}`);
    console.log(`Widget source: ${widgetHtmlPath}`);
    console.log(`Widget bundles: ${widgetsDistPath}`);
  });
}
