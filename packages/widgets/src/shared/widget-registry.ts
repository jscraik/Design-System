import { createRequire } from "node:module";

import type { WidgetName } from "../sdk/generated/widget-manifest";

/**
 * Metadata used to describe a widget tool.
 */
export interface WidgetMeta {
  title: string;
  description?: string;
  invoking?: string;
  invoked?: string;
  accessible?: boolean;
  visibility?: "public" | "private";
}

/**
 * Standardized widget tool configuration payload.
 */
export interface WidgetToolConfig {
  name: string;
  config: {
    title: string;
    description?: string;
    _meta: {
      "openai/outputTemplate": string;
      "openai/toolInvocation/invoking": string;
      "openai/toolInvocation/invoked": string;
      "openai/widgetAccessible": boolean;
      "openai/visibility"?: string;
    };
  };
  handler: () => Promise<unknown>;
}

/**
 * Create a standardized widget tool configuration with auto-generated URIs.
 * @param widgetName - Name of the widget (must match manifest).
 * @param meta - Widget metadata and configuration.
 * @param handler - Tool execution handler.
 * @returns Standardized tool configuration.
 * @throws Error when the widget is missing from the manifest.
 */
export function createWidgetTool(
  widgetName: WidgetName,
  meta: WidgetMeta,
  handler: () => Promise<unknown>,
  toolName?: string,
): WidgetToolConfig {
  // Import manifest dynamically to avoid circular dependencies
  let widgetManifest: Record<string, { uri: string }>;

  try {
    // This will be available after build
    const require = createRequire(import.meta.url);
    widgetManifest = require("../sdk/generated/widget-manifest").widgetManifest;
  } catch {
    // Fallback for development
    widgetManifest = {
      [widgetName]: { uri: `${widgetName}.dev-${Date.now()}` },
    };
  }

  let widgetInfo = widgetManifest[widgetName];
  if (!widgetInfo) {
    const message = `Widget "${widgetName}" not found in manifest`;
    if (process.env.NODE_ENV === "production") {
      console.warn(message);
      widgetInfo = { uri: `${widgetName}.missing` };
    } else {
      throw new Error(message);
    }
  }

  return {
    name: toolName ?? widgetName,
    config: {
      title: meta.title,
      description: meta.description,
      _meta: {
        "openai/outputTemplate": `ui://widget/${widgetInfo.uri}`,
        "openai/toolInvocation/invoking": meta.invoking || `Running ${meta.title}...`,
        "openai/toolInvocation/invoked": meta.invoked || `Completed ${meta.title}`,
        "openai/widgetAccessible": meta.accessible ?? true,
        "openai/visibility": meta.visibility ?? "public",
        securitySchemes: [{ type: "noauth" }],
      },
    },
    handler,
  };
}

/**
 * Batch create multiple widget tools.
 * @param tools - Array of widget tool definitions.
 * @returns Array of standardized tool configurations.
 */
export function createWidgetTools(
  tools: Array<{
    widgetName: WidgetName;
    toolName?: string;
    meta: WidgetMeta;
    handler: () => Promise<unknown>;
  }>,
): WidgetToolConfig[] {
  return tools.map(({ widgetName, meta, handler, toolName }) =>
    createWidgetTool(widgetName, meta, handler, toolName),
  );
}

/**
 * Create environment-aware resource metadata for widgets.
 * @param options - CSP and domain configuration.
 * @returns Widget metadata suitable for tool responses.
 */
export function createResourceMeta(options: {
  workerDomain?: string;
  widgetDomain?: string;
  connectDomains?: string[];
  resourceDomains?: string[];
}) {
  type WidgetCSP = {
    connect_domains: string[];
    resource_domains: string[];
  };
  type ResourceMeta = {
    "openai/widgetCSP": WidgetCSP;
    "openai/widgetDomain"?: string;
  };

  const meta: ResourceMeta = {
    "openai/widgetCSP": {
      connect_domains: options.connectDomains || [],
      resource_domains: options.resourceDomains || [],
    },
  };

  if (options.widgetDomain) {
    meta["openai/widgetDomain"] = options.widgetDomain;
  }

  if (options.workerDomain) {
    meta["openai/widgetCSP"].resource_domains.push(options.workerDomain);
  }

  return meta;
}
