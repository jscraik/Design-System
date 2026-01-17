import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Import the new widget registry system
import {
  createResourceMeta,
  createWidgetTools,
} from "../../packages/widgets/src/shared/widget-registry.js";
import { startMcpHttpServer } from "./lib/http-server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const widgetHtmlPath = process.env.WEB_WIDGET_HTML
  ? path.resolve(process.env.WEB_WIDGET_HTML)
  : path.resolve(__dirname, "../web/apps/web/dist/widget.html");
const widgetsDistPath = process.env.WIDGETS_DIST
  ? path.resolve(process.env.WIDGETS_DIST)
  : path.resolve(__dirname, "../../packages/widgets/dist/src");
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
const emptyInputSchema = z.object({}).strict();
const widgetPreviewInputSchema = z
  .object({
    payload: z
      .record(z.unknown())
      .optional()
      .describe("Optional widget payload data for preview/testing"),
  })
  .strict();

const displayChatInputSchema = z
  .object({
    seedMessage: z
      .string()
      .optional()
      .describe("Optional initial message to seed the chat conversation"),
  })
  .strict();

const searchResultSchema = z.object({
  id: z.union([z.string(), z.number()]).describe("Unique identifier for the result"),
  title: z.string().describe("Title of the search result"),
  description: z.string().optional().describe("Brief description of the result"),
  url: z.string().optional().describe("URL to the full content"),
  tags: z.array(z.string()).optional().describe("Tags or categories for the result"),
});

const displaySearchResultsInputSchema = z
  .object({
    query: z.string().describe("The search query that was performed"),
    results: z.array(searchResultSchema).describe("Array of search results to display"),
  })
  .strict();

const displayTableInputSchema = z
  .object({
    title: z.string().optional().describe("Optional title for the table"),
    columns: z.array(z.string()).describe("Column headers for the table"),
    rows: z
      .array(z.record(z.unknown()))
      .describe("Array of row objects with keys matching column names"),
  })
  .strict();

const displayDashboardInputSchema = emptyInputSchema;

// Shopping Cart schemas
const cartItemSchema = z.object({
  id: z.string().describe("Unique identifier for the item"),
  name: z.string().describe("Display name of the item"),
  price: z.number().describe("Price per unit"),
  quantity: z.number().describe("Quantity to add"),
  image: z.string().optional().describe("URL to item image"),
  description: z.string().optional().describe("Brief item description"),
});

const addToCartInputSchema = z
  .object({
    items: z.array(cartItemSchema).describe("Items to add to the cart"),
    sessionId: z.string().optional().describe("Cart session ID for cross-turn persistence"),
  })
  .strict();

const _removeFromCartInputSchema = z
  .object({
    itemIds: z.array(z.string()).describe("IDs of items to remove from cart"),
    sessionId: z.string().optional().describe("Cart session ID"),
  })
  .strict();

const _showCartInputSchema = z
  .object({
    sessionId: z.string().optional().describe("Cart session ID to display"),
  })
  .strict();

// Pizzaz Shop schemas
const _showShopInputSchema = z
  .object({
    view: z
      .enum(["cart", "checkout", "confirmation"])
      .optional()
      .describe("Initial view to display"),
    items: z.array(cartItemSchema).optional().describe("Pre-populate cart with items"),
  })
  .strict();

const _placeOrderInputSchema = z
  .object({
    deliveryOption: z.enum(["standard", "express"]).optional().describe("Delivery speed"),
    tipPercent: z.number().optional().describe("Tip percentage (0, 10, 15, 20)"),
  })
  .strict();

// Auth Demo schemas
const _authStatusInputSchema = z
  .object({
    checkLevel: z
      .enum(["none", "basic", "oauth", "oauth_elevated"])
      .optional()
      .describe("Minimum auth level to check for"),
  })
  .strict();

const _authLoginInputSchema = z
  .object({
    provider: z.string().optional().describe("OAuth provider (e.g., 'google', 'github')"),
    scopes: z.array(z.string()).optional().describe("Requested OAuth scopes"),
  })
  .strict();

const _authLogoutInputSchema = emptyInputSchema;

const _authRefreshInputSchema = z
  .object({
    forceRefresh: z.boolean().optional().describe("Force token refresh even if not expired"),
  })
  .strict();

const displayChatOutputSchema = z
  .object({
    seedMessage: z.string(),
    locale: z.string(),
  })
  .strict();

const displaySearchResultsOutputSchema = z
  .object({
    query: z.string(),
    results: z.array(searchResultSchema),
    locale: z.string(),
  })
  .strict();

const displayTableOutputSchema = z
  .object({
    title: z.string().optional(),
    columns: z.array(z.string()),
    data: z.array(z.record(z.unknown())),
    locale: z.string(),
  })
  .strict();

const displayDemoOutputSchema = z
  .object({
    demo: z.boolean(),
  })
  .strict();

const widgetPreviewOutputSchema = z
  .object({
    widgetName: z.string(),
    payload: z.record(z.unknown()).optional(),
    locale: z.string(),
  })
  .strict();

const dashboardStatSchema = z.object({
  label: z.string(),
  value: z.string(),
  change: z.string(),
});

const dashboardChatSchema = z.object({
  id: z.number(),
  title: z.string(),
  model: z.string(),
  time: z.string(),
});

const displayDashboardOutputSchema = z
  .object({
    dashboard: z.boolean(),
    headerText: z.string(),
    stats: z.array(dashboardStatSchema),
    recentChats: z.array(dashboardChatSchema),
  })
  .strict();

const addToCartOutputSchema = z
  .object({
    action: z.literal("add"),
    items: z.array(cartItemSchema),
    sessionId: z.string(),
  })
  .strict();

const removeFromCartOutputSchema = z
  .object({
    action: z.literal("remove"),
    items: z.array(z.object({ id: z.string() })),
    sessionId: z.string(),
  })
  .strict();

const showCartOutputSchema = z
  .object({
    action: z.literal("show"),
    sessionId: z.string().optional(),
  })
  .strict();

const showShopOutputSchema = z
  .object({
    view: z.enum(["cart", "checkout", "confirmation"]),
    items: z.array(cartItemSchema).optional(),
  })
  .strict();

const placeOrderOutputSchema = z
  .object({
    view: z.literal("confirmation"),
    orderId: z.string(),
    deliveryOption: z.enum(["standard", "express"]),
    tipPercent: z.number(),
  })
  .strict();

const authStatusSchema = z
  .object({
    authenticated: z.boolean(),
    level: z.enum(["none", "basic", "oauth", "oauth_elevated"]),
    provider: z.string().optional(),
    expiresAt: z.string().optional(),
    scopes: z.array(z.string()).optional(),
  })
  .strict();

const authStatusOutputSchema = z
  .object({
    authStatus: authStatusSchema,
    meetsRequiredLevel: z.boolean(),
  })
  .strict();

const authLoginOutputSchema = z
  .object({
    authStatus: authStatusSchema,
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      plan: z.string(),
    }),
  })
  .strict();

const authLogoutOutputSchema = z
  .object({
    authStatus: authStatusSchema,
  })
  .strict();

const authRefreshOutputSchema = authLogoutOutputSchema;

function contentWithJsonFallback(message, structuredContent) {
  const json = JSON.stringify(structuredContent, null, 2);
  return [
    { type: "text", text: message },
    { type: "text", text: json },
  ];
}

function toJsonSchema(schema, name) {
  const jsonSchema = zodToJsonSchema(schema, { name, target: "jsonSchema2019-09" });
  const upgraded = upgradeTo202012(jsonSchema);
  return { ...upgraded, $schema: "https://json-schema.org/draft/2020-12/schema" };
}

function upgradeTo202012(schema) {
  if (!schema || typeof schema !== "object") return schema;

  const cloned = Array.isArray(schema) ? schema.map(upgradeTo202012) : { ...schema };

  if (cloned.definitions) {
    cloned.$defs = upgradeTo202012(cloned.definitions);
    delete cloned.definitions;
  }

  for (const [key, value] of Object.entries(cloned)) {
    if (key === "$ref" && typeof value === "string") {
      cloned.$ref = value.replace("#/definitions/", "#/$defs/");
      continue;
    }
    cloned[key] = upgradeTo202012(value);
  }

  return cloned;
}

const displayChatInputJsonSchema = toJsonSchema(displayChatInputSchema, "DisplayChatInput");
const displaySearchResultsInputJsonSchema = toJsonSchema(
  displaySearchResultsInputSchema,
  "DisplaySearchResultsInput",
);
const displayTableInputJsonSchema = toJsonSchema(displayTableInputSchema, "DisplayTableInput");
const displayDashboardInputJsonSchema = toJsonSchema(
  displayDashboardInputSchema,
  "DisplayDashboardInput",
);
const displayDemoInputJsonSchema = toJsonSchema(emptyInputSchema, "DisplayDemoInput");
const emptyInputJsonSchema = toJsonSchema(emptyInputSchema, "EmptyInput");
const addToCartInputJsonSchema = toJsonSchema(addToCartInputSchema, "AddToCartInput");
const removeFromCartInputJsonSchema = toJsonSchema(
  _removeFromCartInputSchema,
  "RemoveFromCartInput",
);
const showCartInputJsonSchema = toJsonSchema(_showCartInputSchema, "ShowCartInput");
const showShopInputJsonSchema = toJsonSchema(_showShopInputSchema, "ShowShopInput");
const placeOrderInputJsonSchema = toJsonSchema(_placeOrderInputSchema, "PlaceOrderInput");
const authStatusInputJsonSchema = toJsonSchema(_authStatusInputSchema, "AuthStatusInput");
const authLoginInputJsonSchema = toJsonSchema(_authLoginInputSchema, "AuthLoginInput");
const authLogoutInputJsonSchema = toJsonSchema(_authLogoutInputSchema, "AuthLogoutInput");
const authRefreshInputJsonSchema = toJsonSchema(_authRefreshInputSchema, "AuthRefreshInput");

const displayChatOutputJsonSchema = toJsonSchema(displayChatOutputSchema, "DisplayChatOutput");
const displaySearchResultsOutputJsonSchema = toJsonSchema(
  displaySearchResultsOutputSchema,
  "DisplaySearchResultsOutput",
);
const displayTableOutputJsonSchema = toJsonSchema(displayTableOutputSchema, "DisplayTableOutput");
const displayDemoOutputJsonSchema = toJsonSchema(displayDemoOutputSchema, "DisplayDemoOutput");
const displayDashboardOutputJsonSchema = toJsonSchema(
  displayDashboardOutputSchema,
  "DisplayDashboardOutput",
);
const addToCartOutputJsonSchema = toJsonSchema(addToCartOutputSchema, "AddToCartOutput");
const removeFromCartOutputJsonSchema = toJsonSchema(
  removeFromCartOutputSchema,
  "RemoveFromCartOutput",
);
const showCartOutputJsonSchema = toJsonSchema(showCartOutputSchema, "ShowCartOutput");
const showShopOutputJsonSchema = toJsonSchema(showShopOutputSchema, "ShowShopOutput");
const placeOrderOutputJsonSchema = toJsonSchema(placeOrderOutputSchema, "PlaceOrderOutput");
const authStatusOutputJsonSchema = toJsonSchema(authStatusOutputSchema, "AuthStatusOutput");
const authLoginOutputJsonSchema = toJsonSchema(authLoginOutputSchema, "AuthLoginOutput");
const authLogoutOutputJsonSchema = toJsonSchema(authLogoutOutputSchema, "AuthLogoutOutput");
const authRefreshOutputJsonSchema = toJsonSchema(authRefreshOutputSchema, "AuthRefreshOutput");

const toolListSchemaMap = {
  display_chat: { input: displayChatInputJsonSchema, output: displayChatOutputJsonSchema },
  display_search_results: {
    input: displaySearchResultsInputJsonSchema,
    output: displaySearchResultsOutputJsonSchema,
  },
  display_table: { input: displayTableInputJsonSchema, output: displayTableOutputJsonSchema },
  display_demo: { input: displayDemoInputJsonSchema, output: displayDemoOutputJsonSchema },
  display_dashboard: {
    input: displayDashboardInputJsonSchema,
    output: displayDashboardOutputJsonSchema,
  },
  add_to_cart: { input: addToCartInputJsonSchema, output: addToCartOutputJsonSchema },
  remove_from_cart: {
    input: removeFromCartInputJsonSchema,
    output: removeFromCartOutputJsonSchema,
  },
  show_cart: { input: showCartInputJsonSchema, output: showCartOutputJsonSchema },
  show_shop: { input: showShopInputJsonSchema, output: showShopOutputJsonSchema },
  place_order: { input: placeOrderInputJsonSchema, output: placeOrderOutputJsonSchema },
  auth_status: { input: authStatusInputJsonSchema, output: authStatusOutputJsonSchema },
  auth_login: { input: authLoginInputJsonSchema, output: authLoginOutputJsonSchema },
  auth_logout: { input: authLogoutInputJsonSchema, output: authLogoutOutputJsonSchema },
  auth_refresh: { input: authRefreshInputJsonSchema, output: authRefreshOutputJsonSchema },
};

function installListToolsHandler(server) {
  server.server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: Object.entries(server._registeredTools)
      .filter(([, tool]) => tool.enabled)
      .map(([name, tool]) => {
        const schemas = toolListSchemaMap[name] ?? {};
        const inputSchema =
          schemas.input ??
          (tool.inputSchema
            ? toJsonSchema(tool.inputSchema, `${name}Input`)
            : emptyInputJsonSchema);
        const outputSchema =
          schemas.output ??
          (tool.outputSchema ? toJsonSchema(tool.outputSchema, `${name}Output`) : undefined);
        const toolDefinition = {
          name,
          title: tool.title,
          description: tool.description,
          inputSchema,
          annotations: tool.annotations,
          _meta: tool._meta,
        };
        if (outputSchema) {
          toolDefinition.outputSchema = outputSchema;
        }
        return toolDefinition;
      }),
  }));
}

function createEnhancedChatUiServer() {
  const server = new McpServer({
    name: "astudio-enhanced",
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

  // Main aStudio widget resource
  server.registerResource("astudio-widget", "ui://widget/astudio.html", {}, async () => ({
    contents: [
      {
        uri: "ui://widget/astudio.html",
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
      toolName: "display_chat",
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
        const structuredContent = {
          seedMessage,
          locale,
        };

        return {
          content: contentWithJsonFallback(
            seedMessage
              ? `Chat interface opened with message: "${seedMessage}"`
              : "Chat interface opened",
            structuredContent,
          ),
          structuredContent,
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
      toolName: "display_search_results",
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
        const structuredContent = {
          query,
          results,
          locale,
        };

        return {
          content: contentWithJsonFallback(
            `Displaying ${count} result${count !== 1 ? "s" : ""} for "${query}"`,
            structuredContent,
          ),
          structuredContent,
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
      toolName: "display_table",
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
        const structuredContent = {
          title,
          columns,
          data: rows,
          locale,
        };

        return {
          content: contentWithJsonFallback(
            title
              ? `Displaying "${title}" with ${rowCount} row${rowCount !== 1 ? "s" : ""}`
              : `Displaying table with ${rowCount} row${rowCount !== 1 ? "s" : ""}`,
            structuredContent,
          ),
          structuredContent,
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
      toolName: "display_dashboard",
      meta: {
        title: "Display Dashboard",
        description: "Displays a dashboard widget with analytics and quick actions",
        invoking: "Opening dashboard...",
        invoked: "Dashboard ready",
        accessible: false,
      },
      handler: async () => {
        const structuredContent = {
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
        };
        return {
          content: contentWithJsonFallback("Dashboard displayed", structuredContent),
          structuredContent,
        };
      },
    },
    {
      widgetName: "kitchen-sink-lite",
      toolName: "display_demo",
      meta: {
        title: "Display Demo Widget",
        description: "Displays a demonstration widget showcasing various Apps SDK capabilities",
        invoking: "Loading demo...",
        invoked: "Demo widget ready",
        accessible: false,
      },
      handler: async () => {
        const structuredContent = { demo: true };
        return {
          content: contentWithJsonFallback("Demo widget displayed", structuredContent),
          structuredContent,
        };
      },
    },
    {
      widgetName: "shopping-cart",
      toolName: "add_to_cart",
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
        const structuredContent = {
          action: "add",
          items,
          sessionId: widgetSessionId,
        };

        return {
          content: contentWithJsonFallback(
            `Added ${items.length} item(s) to cart`,
            structuredContent,
          ),
          structuredContent,
          _meta: {
            widgetSessionId,
          },
        };
      },
    },
    {
      widgetName: "shopping-cart",
      toolName: "remove_from_cart",
      meta: {
        title: "Remove from Cart",
        description: "Removes items from the shopping cart by their IDs",
        invoking: "Removing items from cart...",
        invoked: "Items removed from cart",
        accessible: true,
      },
      handler: async (args) => {
        const { itemIds, sessionId } = args;
        const widgetSessionId = sessionId ?? `cart-${Date.now().toString(36)}`;
        const structuredContent = {
          action: "remove",
          items: itemIds.map((id) => ({ id })),
          sessionId: widgetSessionId,
        };

        return {
          content: contentWithJsonFallback(
            `Removed ${itemIds.length} item(s) from cart`,
            structuredContent,
          ),
          structuredContent,
          _meta: {
            widgetSessionId,
          },
        };
      },
    },
    {
      widgetName: "shopping-cart",
      toolName: "show_cart",
      meta: {
        title: "Show Cart",
        description: "Displays the current shopping cart contents",
        invoking: "Loading cart...",
        invoked: "Cart displayed",
        accessible: false,
      },
      handler: async (args) => {
        const { sessionId } = args;
        const structuredContent = {
          action: "show",
          ...(sessionId ? { sessionId } : {}),
        };

        return {
          content: contentWithJsonFallback("Shopping cart displayed", structuredContent),
          structuredContent,
          _meta: {
            widgetSessionId: sessionId,
          },
        };
      },
    },
    {
      widgetName: "pizzaz-shop",
      toolName: "show_shop",
      meta: {
        title: "Show Pizzaz Shop",
        description: "Displays the Pizzaz Shop e-commerce interface",
        invoking: "Opening Pizzaz Shop...",
        invoked: "Pizzaz Shop ready",
        accessible: false,
      },
      handler: async (args) => {
        const { view, items } = args;
        const structuredContent = {
          view: view ?? "cart",
          items,
        };

        return {
          content: contentWithJsonFallback("Pizzaz Shop displayed", structuredContent),
          structuredContent,
        };
      },
    },
    {
      widgetName: "pizzaz-shop",
      toolName: "place_order",
      meta: {
        title: "Place Order",
        description: "Places an order in the Pizzaz Shop with the current cart contents",
        invoking: "Placing order...",
        invoked: "Order placed successfully",
        accessible: false,
      },
      handler: async (args) => {
        const { deliveryOption, tipPercent } = args;
        const orderId = `PZ-${Date.now().toString(36).toUpperCase()}`;
        const structuredContent = {
          view: "confirmation",
          orderId,
          deliveryOption: deliveryOption ?? "standard",
          tipPercent: tipPercent ?? 10,
        };

        return {
          content: contentWithJsonFallback(
            `Order ${orderId} placed successfully`,
            structuredContent,
          ),
          structuredContent,
        };
      },
    },
    {
      widgetName: "auth-demo",
      toolName: "auth_status",
      meta: {
        title: "Check Auth Status",
        description: "Displays the current authentication status",
        invoking: "Checking auth status...",
        invoked: "Auth status retrieved",
        accessible: false,
      },
      handler: async (args) => {
        const { checkLevel } = args;
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
        const structuredContent = {
          authStatus,
          meetsRequiredLevel: meetsLevel,
        };

        return {
          content: contentWithJsonFallback(
            authStatus.authenticated
              ? `Authenticated via ${authStatus.provider} (${authStatus.level})`
              : "Not authenticated",
            structuredContent,
          ),
          structuredContent,
          _meta: {
            authStatus,
          },
        };
      },
    },
    {
      widgetName: "auth-demo",
      toolName: "auth_login",
      meta: {
        title: "Login",
        description: "Initiates an authentication flow (demo)",
        invoking: "Initiating login...",
        invoked: "Login successful",
        accessible: false,
      },
      handler: async (args) => {
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
        const structuredContent = {
          authStatus,
          user,
        };

        return {
          content: contentWithJsonFallback(
            `Successfully authenticated as ${user.name}`,
            structuredContent,
          ),
          structuredContent,
          _meta: {
            authStatus,
          },
        };
      },
    },
    {
      widgetName: "auth-demo",
      toolName: "auth_logout",
      meta: {
        title: "Logout",
        description: "Ends the current authentication session and clears credentials",
        invoking: "Logging out...",
        invoked: "Logged out successfully",
        accessible: true,
        visibility: "private",
      },
      handler: async () => {
        const structuredContent = {
          authStatus: {
            authenticated: false,
            level: "none",
          },
        };

        return {
          content: contentWithJsonFallback("Successfully logged out", structuredContent),
          structuredContent,
          _meta: {
            authStatus: {
              authenticated: false,
              level: "none",
            },
          },
        };
      },
    },
    {
      widgetName: "auth-demo",
      toolName: "auth_refresh",
      meta: {
        title: "Refresh Auth",
        description: "Refreshes the current authentication token to extend the session",
        invoking: "Refreshing auth...",
        invoked: "Auth refreshed",
        accessible: true,
        visibility: "private",
      },
      handler: async () => {
        const authStatus = {
          authenticated: true,
          level: "oauth",
          provider: "demo",
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          scopes: ["read", "write", "profile"],
        };
        const structuredContent = {
          authStatus,
        };

        return {
          content: contentWithJsonFallback(
            `Auth token refreshed, expires at ${authStatus.expiresAt}`,
            structuredContent,
          ),
          structuredContent,
          _meta: {
            authStatus,
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
        outputSchema: getOutputSchemaForTool(name),
        securitySchemes: [{ type: "noauth" }],
        annotations: getAnnotationsForTool(name), // Helper function to get appropriate annotations
        _meta: config._meta,
      },
      handler,
    );
  });

  // Auto-generate widget preview tools for testing all widgets
  Object.entries(widgetManifest.widgetManifest).forEach(([widgetName, widgetInfo]) => {
    const toolName = `widget_preview_${widgetName}`;
    server.registerTool(
      toolName,
      {
        title: `Preview Widget: ${widgetName}`,
        description: `Renders the ${widgetName} widget for preview and testing.`,
        inputSchema: widgetPreviewInputSchema,
        outputSchema: widgetPreviewOutputSchema,
        securitySchemes: [{ type: "noauth" }],
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          openWorldHint: false,
          idempotentHint: true,
        },
        _meta: {
          securitySchemes: [{ type: "noauth" }],
          "openai/outputTemplate": `ui://widget/${widgetInfo.uri}`,
          "openai/widgetAccessible": false,
          "openai/visibility": "public",
          "openai/toolInvocation/invoking": `Loading ${widgetName} preview...`,
          "openai/toolInvocation/invoked": `${widgetName} preview ready`,
          "openai/fileParams": [],
        },
      },
      async (args, { _meta } = {}) => {
        const payload = args?.payload;
        const locale = _meta?.["openai/locale"] ?? "en";
        const structuredContent = {
          widgetName,
          ...(payload ? { payload } : {}),
          locale,
        };

        return {
          content: contentWithJsonFallback(`Previewing ${widgetName}`, structuredContent),
          structuredContent,
        };
      },
    );
  });

  installListToolsHandler(server);

  return server;
}

// Helper functions to get appropriate schemas and annotations
function getInputSchemaForTool(toolName) {
  const schemaMap = {
    display_chat: displayChatInputSchema,
    display_search_results: displaySearchResultsInputSchema,
    display_table: displayTableInputSchema,
    display_dashboard: displayDashboardInputSchema,
    display_demo: emptyInputSchema,
    add_to_cart: addToCartInputSchema,
    remove_from_cart: _removeFromCartInputSchema,
    show_cart: _showCartInputSchema,
    show_shop: _showShopInputSchema,
    place_order: _placeOrderInputSchema,
    auth_status: _authStatusInputSchema,
    auth_login: _authLoginInputSchema,
    auth_logout: _authLogoutInputSchema,
    auth_refresh: _authRefreshInputSchema,
    // Add more mappings as needed
  };
  return schemaMap[toolName] || emptyInputSchema;
}

function getOutputSchemaForTool(toolName) {
  const schemaMap = {
    display_chat: displayChatOutputSchema,
    display_search_results: displaySearchResultsOutputSchema,
    display_table: displayTableOutputSchema,
    display_dashboard: displayDashboardOutputSchema,
    display_demo: displayDemoOutputSchema,
    add_to_cart: addToCartOutputSchema,
    remove_from_cart: removeFromCartOutputSchema,
    show_cart: showCartOutputSchema,
    show_shop: showShopOutputSchema,
    place_order: placeOrderOutputSchema,
    auth_status: authStatusOutputSchema,
    auth_login: authLoginOutputSchema,
    auth_logout: authLogoutOutputSchema,
    auth_refresh: authRefreshOutputSchema,
    // Add more mappings as needed
  };
  return schemaMap[toolName];
}

function getAnnotationsForTool(toolName) {
  const annotationsMap = {
    display_chat: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true,
    },
    display_search_results: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true,
    },
    display_table: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true,
    },
    display_dashboard: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true,
    },
    display_demo: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true,
    },
    add_to_cart: {
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: false,
    },
    remove_from_cart: {
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: false,
      idempotentHint: true,
    },
    show_cart: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true,
    },
    show_shop: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true,
    },
    place_order: {
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: false,
    },
    auth_status: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true,
    },
    auth_login: {
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: true,
      idempotentHint: false,
    },
    auth_logout: {
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: false,
      idempotentHint: true,
    },
    auth_refresh: {
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: true,
      idempotentHint: true,
    },
  };

  return (
    annotationsMap[toolName] ?? {
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: false,
    }
  );
}

export { createEnhancedChatUiServer };

// Direct run support (same as original)
const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  startMcpHttpServer({
    createServerInstance: createEnhancedChatUiServer,
    rootMessage: "ChatUI Enhanced MCP server - Auto-discovery enabled",
    onListen: () => {
      console.log(`Widget source: ${widgetHtmlPath}`);
      console.log(`Widget bundles: ${widgetsDistPath}`);
      console.log(
        `Auto-discovery: ${Object.keys(widgetManifest.widgetManifest).length} widgets found`,
      );
    },
  });
}
