// Import the widget manifest from the widgets package
// This will be auto-generated during build
import { widgetManifest } from "./widget-manifest.generated";

// Types for Cloudflare Workers environment
interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  WIDGET_SERVER: DurableObjectNamespace;
  WORKER_DOMAIN_BASE?: string;
  WIDGET_DOMAIN?: string;
}

// Widget manifest types
interface WidgetInfo {
  name: string;
  uri: string;
  hash: string;
  originalPath: string;
}

// MCP Protocol types
interface McpResource {
  uri: string;
  name?: string;
  description?: string;
  mimeType?: string;
}

interface McpToolDefinition {
  description: string;
  inputSchema: Record<string, unknown>;
  _meta?: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<McpResponse>;
}

interface McpResponse {
  content: Array<{ type: string; text: string }>;
  structuredContent?: Record<string, unknown>;
}

/**
 * Cloudflare Workers MCP server for ChatUI widgets.
 * Serves widget resources and MCP tool responses.
 */

/**
 * Return security headers for all responses.
 * @returns A record of security header values.
 */
function getSecurityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.openai.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  };
}

/**
 * Add security headers to a response.
 * @param response - The response to decorate.
 * @returns A response with security headers applied.
 */
function addSecurityHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  const securityHeaders = getSecurityHeaders();

  for (const [key, value] of Object.entries(securityHeaders)) {
    newHeaders.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * MCP server implementation for widget resources and tools.
 */
export class ChatUIWidgetServer {
  private env: Env;
  private resources: Map<string, McpResource> = new Map();
  private tools: Map<string, McpToolDefinition> = new Map();

  /**
   * Create a widget server instance.
   * @param env - Cloudflare Workers environment bindings.
   */
  constructor(env: Env) {
    this.env = env;
  }

  /**
   * Initialize resources and tool definitions.
   */
  async init(): Promise<void> {
    // Auto-register all widgets from the manifest
    for (const [widgetName, widgetInfo] of Object.entries(widgetManifest)) {
      const typedWidgetInfo = widgetInfo as WidgetInfo;
      const resourceUri = `ui://widget/${typedWidgetInfo.uri}`;

      this.resources.set(`${widgetName}-widget`, {
        uri: resourceUri,
        name: `${widgetName}-widget`,
        description: `Interactive ${widgetName} widget component`,
        mimeType: "text/html+skybridge",
      });
    }

    // Register example tools that use the widgets
    this.registerExampleTools();

    console.log(
      `ChatUI Widget Server initialized with ${Object.keys(widgetManifest).length} widgets`,
    );
  }

  /**
   * Handle MCP protocol requests.
   * @param request - The incoming request.
   * @returns The MCP response.
   */
  async handleMcpRequest(request: Request): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return addSecurityHeaders(
        new Response(null, {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
      );
    }

    try {
      if (request.method === "GET") {
        // Return server capabilities
        return addSecurityHeaders(
          new Response(
            JSON.stringify({
              name: "ChatUI-Widgets",
              version: "1.0.0",
              description: "Interactive widgets powered by ChatUI library",
              resources: Array.from(this.resources.values()),
              tools: Array.from(this.tools.keys()).map((name) => ({
                name,
                description: this.tools.get(name)?.description || `Tool: ${name}`,
                inputSchema: this.tools.get(name)?.inputSchema || {
                  type: "object",
                  properties: {},
                },
                _meta: this.tools.get(name)?._meta,
              })),
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          ),
        );
      }

      if (request.method === "POST") {
        const body = (await request.json()) as Record<string, unknown>;

        // Handle resource requests
        if (body.method === "resources/read") {
          const params = body.params as { uri?: string };
          return await this.handleResourceRead(params?.uri || "");
        }

        // Handle tool calls
        if (body.method === "tools/call") {
          const params = body.params as { name?: string; arguments?: Record<string, unknown> };
          return await this.handleToolCall(params?.name || "", params?.arguments || {});
        }

        // Handle list requests
        if (body.method === "resources/list") {
          return addSecurityHeaders(
            new Response(
              JSON.stringify({
                resources: Array.from(this.resources.values()),
              }),
              {
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              },
            ),
          );
        }

        if (body.method === "tools/list") {
          return addSecurityHeaders(
            new Response(
              JSON.stringify({
                tools: Array.from(this.tools.keys()).map((name) => ({
                  name,
                  description: this.tools.get(name)?.description || `Tool: ${name}`,
                  inputSchema: this.tools.get(name)?.inputSchema || {
                    type: "object",
                    properties: {},
                  },
                  _meta: this.tools.get(name)?._meta,
                })),
              }),
              {
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              },
            ),
          );
        }
      }

      return addSecurityHeaders(new Response("Method not supported", { status: 405 }));
    } catch (error) {
      console.error("MCP request error:", error);
      return addSecurityHeaders(
        new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }),
      );
    }
  }

  /**
   * Handle resource read requests.
   * @param uri - The resource URI to resolve.
   * @returns A response with the resource payload.
   */
  private async handleResourceRead(uri: string): Promise<Response> {
    try {
      // Find the widget by URI
      const widgetEntry = Object.entries(widgetManifest).find(
        ([, info]) => `ui://widget/${(info as WidgetInfo).uri}` === uri,
      );

      if (!widgetEntry) {
        return addSecurityHeaders(
          new Response(JSON.stringify({ error: "Resource not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          }),
        );
      }

      const [widgetName, widgetInfo] = widgetEntry;
      const typedWidgetInfo = widgetInfo as WidgetInfo;

      // Fetch the widget HTML from Cloudflare Assets
      const response = await this.env.ASSETS.fetch(
        new Request(`http://localhost/${typedWidgetInfo.originalPath}`),
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch widget ${widgetName}: ${response.status}`);
      }

      const html = await response.text();

      // Create resource metadata following OpenAI's official specifications
      const resourceMeta = {
        "openai/widgetPrefersBorder": true,
        "openai/widgetDescription": `Interactive ${widgetName} component with auto-generated cache busting and enhanced functionality`,
        "openai/widgetDomain":
          this.env.WIDGET_DOMAIN || this.env.WORKER_DOMAIN_BASE || "https://localhost:8787",
        "openai/widgetCSP": {
          connect_domains: [
            this.env.WORKER_DOMAIN_BASE || "https://localhost:8787",
            this.env.WIDGET_DOMAIN || "https://localhost:8787",
            "https://web-sandbox.oaiusercontent.com",
          ].filter(Boolean),
          resource_domains: [
            this.env.WORKER_DOMAIN_BASE || "https://localhost:8787",
            "https://*.oaistatic.com",
          ].filter(Boolean),
          redirect_domains: [this.env.WIDGET_DOMAIN || "https://localhost:8787"].filter(Boolean),
        },
      };

      return addSecurityHeaders(
        new Response(
          JSON.stringify({
            contents: [
              {
                uri,
                mimeType: "text/html+skybridge",
                text: html,
                _meta: resourceMeta,
              },
            ],
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        ),
      );
    } catch (error) {
      console.error(`Error serving resource ${uri}:`, error);
      return addSecurityHeaders(
        new Response(JSON.stringify({ error: "Failed to read resource" }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }),
      );
    }
  }

  /**
   * Handle tool call requests.
   * @param toolName - Tool name to invoke.
   * @param args - Tool arguments payload.
   * @returns A response with the tool result.
   */
  private async handleToolCall(toolName: string, args: Record<string, unknown>): Promise<Response> {
    try {
      const tool = this.tools.get(toolName);
      if (!tool) {
        return addSecurityHeaders(
          new Response(JSON.stringify({ error: "Tool not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          }),
        );
      }

      const result = await tool.handler(args);
      return addSecurityHeaders(
        new Response(JSON.stringify(result), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }),
      );
    } catch (error) {
      console.error(`Error calling tool ${toolName}:`, error);
      return addSecurityHeaders(
        new Response(JSON.stringify({ error: "Tool execution failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }),
      );
    }
  }

  /**
   * Register example tools that demonstrate widget usage.
   */
  private registerExampleTools(): void {
    // Example: Dashboard tool (public, no widget access)
    if (widgetManifest["dashboard-widget"]) {
      this.tools.set("show_dashboard", {
        description:
          "Display an interactive dashboard with analytics and quick actions for monitoring widget performance and system metrics",
        inputSchema: {
          type: "object",
          properties: {
            timeRange: {
              type: "string",
              enum: ["1h", "24h", "7d", "30d"],
              description: "Time range for analytics data",
              default: "24h",
            },
          },
          additionalProperties: false,
        },
        _meta: {
          "openai/outputTemplate": `ui://widget/${(widgetManifest["dashboard-widget"] as WidgetInfo).uri}`,
          "openai/toolInvocation/invoking": "Loading dashboard analytics...",
          "openai/toolInvocation/invoked": "Dashboard ready with latest metrics",
          "openai/widgetAccessible": false,
          "openai/widgetDescription":
            "Interactive analytics dashboard showing widget performance, deployment status, and system metrics with real-time updates",
        },
        handler: async (args: Record<string, unknown>) => {
          const timeRange = (args?.timeRange as string) || "24h";
          return {
            content: [{ type: "text", text: `Dashboard showing ${timeRange} analytics` }],
            structuredContent: {
              type: "dashboard",
              timeRange,
              stats: [
                {
                  label: "Active Widgets",
                  value: Object.keys(widgetManifest).length.toString(),
                  change: "+2",
                  trend: "up",
                },
                { label: "Deployments", value: "1", change: "New", trend: "neutral" },
                { label: "Response Time", value: "45ms", change: "-12%", trend: "down" },
                { label: "Success Rate", value: "99.8%", change: "+0.2%", trend: "up" },
              ],
              widgets: Object.keys(widgetManifest).map((name) => ({
                name,
                status: "active",
                lastUsed: new Date().toISOString(),
              })),
            },
          };
        },
      });
    }

    // Example: Kitchen-sink-lite demo widget (widget-accessible for interactive demos)
    if (widgetManifest["kitchen-sink-lite"]) {
      this.tools.set("show_enhanced_example", {
        description:
          "Display the kitchen-sink-lite demo widget showcasing OpenAI integration patterns including state management, theme detection, and tool calling",
        inputSchema: {
          type: "object",
          properties: {
            demoMode: {
              type: "string",
              enum: ["basic", "advanced", "interactive"],
              description: "Demo complexity level",
              default: "basic",
            },
          },
          additionalProperties: false,
        },
        _meta: {
          "openai/outputTemplate": `ui://widget/${(widgetManifest["kitchen-sink-lite"] as WidgetInfo).uri}`,
          "openai/toolInvocation/invoking": "Preparing kitchen-sink-lite demo...",
          "openai/toolInvocation/invoked": "kitchen-sink-lite demo ready for interaction",
          "openai/widgetAccessible": true,
          "openai/widgetDescription":
            "Kitchen-sink-lite demo widget showcasing advanced widget capabilities including state, theme adaptation, and OpenAI API integration patterns",
        },
        handler: async (args: Record<string, unknown>) => {
          const demoMode = (args?.demoMode as string) || "basic";
          return {
            content: [{ type: "text", text: `Kitchen-sink-lite demo in ${demoMode} mode` }],
            structuredContent: {
              type: "enhanced_demo",
              mode: demoMode,
              features: [
                "Persistent state management with host.setWidgetState",
                "Theme detection and adaptation (light/dark/auto)",
                "Device capability detection and responsive design",
                "Display mode control (inline/fullscreen/popup)",
                "Tool calling capabilities for widget-to-server communication",
              ],
              capabilities: {
                stateManagement: true,
                themeDetection: true,
                toolCalling: demoMode !== "basic",
                fileUpload: demoMode === "advanced",
                modalSupport: true,
              },
            },
          };
        },
      });
    }

    // Example: Shopping cart widget (widget-accessible for e-commerce interactions)
    if (widgetManifest["shopping-cart"]) {
      this.tools.set("show_shopping_cart", {
        description:
          "Display an interactive shopping cart with e-commerce functionality including add/remove items, quantity updates, and checkout flow",
        inputSchema: {
          type: "object",
          properties: {
            items: {
              type: "array",
              description: "Initial items to add to cart",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  price: { type: "number" },
                  quantity: { type: "number", minimum: 1 },
                  image: { type: "string", format: "uri" },
                },
                required: ["id", "name", "price", "quantity"],
              },
            },
            currency: {
              type: "string",
              enum: ["USD", "EUR", "GBP"],
              default: "USD",
            },
          },
          additionalProperties: false,
        },
        _meta: {
          "openai/outputTemplate": `ui://widget/${(widgetManifest["shopping-cart"] as WidgetInfo).uri}`,
          "openai/toolInvocation/invoking": "Setting up shopping cart...",
          "openai/toolInvocation/invoked": "Shopping cart ready for interaction",
          "openai/widgetAccessible": true,
          "openai/widgetDescription":
            "Interactive shopping cart with real-time updates, quantity controls, and checkout integration",
        },
        handler: async (args: Record<string, unknown>) => {
          const items =
            (args?.items as Array<{
              id: string;
              name: string;
              price: number;
              quantity: number;
              image?: string;
            }>) || [];
          const currency = (args?.currency as string) || "USD";
          const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

          return {
            content: [
              {
                type: "text",
                text: `Shopping cart with ${items.length} items (${currency} ${total.toFixed(2)})`,
              },
            ],
            structuredContent: {
              type: "shopping_cart",
              currency,
              items,
              totals: {
                subtotal: total,
                tax: total * 0.08, // 8% tax example
                shipping: items.length > 0 ? 5.99 : 0,
                total: total + total * 0.08 + (items.length > 0 ? 5.99 : 0),
              },
              checkout: {
                enabled: items.length > 0,
                methods: ["card", "paypal", "apple_pay"],
              },
            },
          };
        },
      });

      // Private tool for cart operations (hidden from model, widget-accessible only)
      this.tools.set("update_cart_item", {
        description: "Update quantity or remove items from shopping cart",
        inputSchema: {
          type: "object",
          properties: {
            itemId: { type: "string" },
            action: { type: "string", enum: ["update", "remove"] },
            quantity: { type: "number", minimum: 0 },
          },
          required: ["itemId", "action"],
          additionalProperties: false,
        },
        _meta: {
          "openai/outputTemplate": `ui://widget/${(widgetManifest["shopping-cart"] as WidgetInfo).uri}`,
          "openai/toolInvocation/invoking": "Updating cart...",
          "openai/toolInvocation/invoked": "Cart updated",
          "openai/widgetAccessible": true,
          "openai/visibility": "private",
        },
        handler: async (args: Record<string, unknown>) => {
          const { itemId, action, quantity } = args as {
            itemId: string;
            action: string;
            quantity?: number;
          };

          return {
            content: [{ type: "text", text: `Cart item ${itemId} ${action}d` }],
            structuredContent: {
              type: "cart_update",
              itemId,
              action,
              quantity,
              success: true,
            },
          };
        },
      });
    }

    // Example: Data table widget (public tool with rich data handling)
    if (widgetManifest["pizzaz-table"]) {
      this.tools.set("show_data_table", {
        description:
          "Display an interactive data table with sorting, filtering, and pagination capabilities for structured data visualization",
        inputSchema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              description: "Table data to display",
              items: {
                type: "object",
                additionalProperties: true,
              },
            },
            title: {
              type: "string",
              description: "Table title",
            },
            columns: {
              type: "array",
              description: "Column configuration",
              items: {
                type: "object",
                properties: {
                  key: { type: "string" },
                  label: { type: "string" },
                  sortable: { type: "boolean" },
                  filterable: { type: "boolean" },
                },
              },
            },
            pageSize: {
              type: "number",
              minimum: 5,
              maximum: 100,
              default: 10,
            },
          },
          additionalProperties: false,
        },
        _meta: {
          "openai/outputTemplate": `ui://widget/${(widgetManifest["pizzaz-table"] as WidgetInfo).uri}`,
          "openai/toolInvocation/invoking": "Preparing data table...",
          "openai/toolInvocation/invoked": "Data table ready with interactive features",
          "openai/widgetAccessible": false,
          "openai/widgetDescription":
            "Interactive data table with sorting, filtering, and pagination for structured data analysis",
        },
        handler: async (args: Record<string, unknown>) => {
          const title = (args?.title as string) || "Data Table";
          const pageSize = (args?.pageSize as number) || 10;
          const customData = args?.data as Record<string, unknown>[];
          const customColumns = args?.columns as Array<{
            key: string;
            label: string;
            sortable?: boolean;
            filterable?: boolean;
          }>;

          // Default sample data if none provided
          const defaultData = [
            {
              id: 1,
              name: "Widget Analytics",
              category: "Dashboard",
              status: "Active",
              usage: 1250,
              lastUpdated: "2025-12-28",
            },
            {
              id: 2,
              name: "Shopping Cart",
              category: "E-commerce",
              status: "Active",
              usage: 890,
              lastUpdated: "2025-12-27",
            },
            {
              id: 3,
              name: "Data Visualization",
              category: "Analytics",
              status: "Beta",
              usage: 456,
              lastUpdated: "2025-12-26",
            },
            {
              id: 4,
              name: "File Manager",
              category: "Utility",
              status: "Active",
              usage: 234,
              lastUpdated: "2025-12-25",
            },
            {
              id: 5,
              name: "Calendar Widget",
              category: "Productivity",
              status: "Pending",
              usage: 123,
              lastUpdated: "2025-12-24",
            },
          ];

          const data = customData || defaultData;
          const columns = customColumns || [
            { key: "name", label: "Name", sortable: true, filterable: true },
            { key: "category", label: "Category", sortable: true, filterable: true },
            { key: "status", label: "Status", sortable: true, filterable: true },
            { key: "usage", label: "Usage", sortable: true, filterable: false },
            { key: "lastUpdated", label: "Last Updated", sortable: true, filterable: false },
          ];

          return {
            content: [{ type: "text", text: `${title} with ${data.length} rows` }],
            structuredContent: {
              type: "data_table",
              title,
              data,
              columns,
              pagination: {
                pageSize,
                totalRows: data.length,
                currentPage: 1,
              },
              features: {
                sorting: true,
                filtering: true,
                pagination: data.length > pageSize,
                export: true,
              },
            },
          };
        },
      });
    }

    // Add more tools as needed...
    // Users can extend this method or create their own tool registration

    // Example: File processing tool (demonstrates file params and upload handling)
    if (widgetManifest["kitchen-sink-lite"]) {
      this.tools.set("process_image", {
        description:
          "Process and analyze uploaded images with interactive preview and editing capabilities",
        inputSchema: {
          type: "object",
          properties: {
            imageToProcess: {
              type: "object",
              properties: {
                download_url: { type: "string" },
                file_id: { type: "string" },
              },
              required: ["download_url", "file_id"],
              additionalProperties: false,
            },
            processingOptions: {
              type: "object",
              properties: {
                resize: { type: "boolean", default: false },
                filter: {
                  type: "string",
                  enum: ["none", "blur", "sharpen", "vintage"],
                  default: "none",
                },
                quality: { type: "number", minimum: 1, maximum: 100, default: 85 },
              },
            },
          },
          required: ["imageToProcess"],
          additionalProperties: false,
        },
        _meta: {
          "openai/outputTemplate": `ui://widget/${(widgetManifest["kitchen-sink-lite"] as WidgetInfo).uri}`,
          "openai/toolInvocation/invoking": "Processing image...",
          "openai/toolInvocation/invoked": "Image processing complete",
          "openai/widgetAccessible": true,
          "openai/fileParams": ["imageToProcess"],
          "openai/widgetDescription":
            "Interactive image processor with real-time preview and editing controls",
        },
        handler: async (args: Record<string, unknown>) => {
          const { imageToProcess, processingOptions } = args as {
            imageToProcess: { download_url: string; file_id: string };
            processingOptions?: { resize?: boolean; filter?: string; quality?: number };
          };

          return {
            content: [{ type: "text", text: "Image processed and ready for preview" }],
            structuredContent: {
              type: "image_processing",
              originalImage: {
                download_url: imageToProcess.download_url,
                file_id: imageToProcess.file_id,
              },
              processing: {
                status: "completed",
                options: processingOptions || {},
                results: {
                  dimensions: { width: 800, height: 600 },
                  format: "JPEG",
                  size: "245KB",
                },
              },
              features: {
                preview: true,
                download: true,
                share: true,
                editMore: true,
              },
            },
          };
        },
      });
    }

    // Example: Widget refresh tool (private, widget-accessible only)
    this.tools.set("refresh_widget_data", {
      description: "Refresh widget data and state (internal tool for widget use)",
      inputSchema: {
        type: "object",
        properties: {
          widgetType: { type: "string" },
          sessionId: { type: "string" },
        },
        required: ["widgetType"],
        additionalProperties: false,
      },
      _meta: {
        "openai/widgetAccessible": true,
        "openai/visibility": "private",
        "openai/toolInvocation/invoking": "Refreshing data...",
        "openai/toolInvocation/invoked": "Data refreshed",
      },
      handler: async (args: Record<string, unknown>) => {
        const { widgetType, sessionId } = args as { widgetType: string; sessionId?: string };

        return {
          content: [{ type: "text", text: `${widgetType} data refreshed` }],
          structuredContent: {
            type: "refresh_complete",
            widgetType,
            sessionId,
            timestamp: new Date().toISOString(),
            success: true,
          },
        };
      },
    });
  }

  /**
   * Static method to create and serve the MCP server
   */
  static async serve(request: Request, env: Env): Promise<Response> {
    const server = new ChatUIWidgetServer(env);
    await server.init();
    return server.handleMcpRequest(request);
  }
}

export class ChatUIWidgetServerDO {
  private server: ChatUIWidgetServer;
  private initPromise: Promise<void>;

  constructor(state: DurableObjectState, env: Env) {
    this.server = new ChatUIWidgetServer(env);
    this.initPromise = state.blockConcurrencyWhile(async () => {
      await this.server.init();
    });
  }

  async fetch(request: Request): Promise<Response> {
    await this.initPromise;
    return this.server.handleMcpRequest(request);
  }
}

/**
 * Cloudflare Workers fetch handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle MCP endpoint
    if (url.pathname === "/mcp") {
      const id = env.WIDGET_SERVER.idFromName("default");
      const stub = env.WIDGET_SERVER.get(id);
      return stub.fetch(request);
    }

    // Handle widget assets (fallback to ASSETS)
    if (url.pathname.startsWith("/src/") || url.pathname.startsWith("/assets/")) {
      return env.ASSETS.fetch(request);
    }

    // Default response
    return new Response(
      JSON.stringify({
        name: "ChatUI Widgets Server",
        version: "1.0.0",
        endpoints: {
          mcp: "/mcp",
          widgets: `${Object.keys(widgetManifest).length} widgets available`,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  },
};
