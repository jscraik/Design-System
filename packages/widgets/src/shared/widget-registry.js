import { createRequire } from "node:module";

/**
 * Create a standardized widget tool configuration with auto-generated URIs.
 * @param {string} widgetName - Name of the widget (must match manifest).
 * @param {object} meta - Widget metadata and configuration.
 * @param {Function} handler - Tool execution handler.
 * @param {string} [toolName] - Optional tool name override.
 * @returns {{name: string, config: {title: string, description?: string, _meta: object}, handler: Function}}
 */
export function createWidgetTool(widgetName, meta, handler, toolName) {
  let widgetManifest;

  try {
    const require = createRequire(import.meta.url);
    widgetManifest = require("../sdk/generated/widget-manifest.js").widgetManifest;
  } catch {
    widgetManifest = {
      [widgetName]: { uri: `${widgetName}.dev-${Date.now()}` },
    };
  }

  let widgetInfo = widgetManifest[widgetName];
  if (!widgetInfo) {
    const message = `Widget "${widgetName}" not found in manifest`;
    const isProduction =
      typeof globalThis.process !== "undefined" &&
      globalThis.process?.env?.NODE_ENV === "production";
    if (isProduction) {
      globalThis.console?.warn(message);
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
 * @param {Array<{widgetName: string, toolName?: string, meta: object, handler: Function}>} tools
 * @returns {Array}
 */
export function createWidgetTools(tools) {
  return tools.map(({ widgetName, toolName, meta, handler }) =>
    createWidgetTool(widgetName, meta, handler, toolName),
  );
}

/**
 * Create environment-aware resource metadata for widgets.
 * @param {object} options
 * @returns {{ "openai/widgetCSP": { connect_domains: string[], resource_domains: string[] }, "openai/widgetDomain"?: string }}
 */
export function createResourceMeta(options) {
  const meta = {
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
