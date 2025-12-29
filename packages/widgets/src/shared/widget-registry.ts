import type { WidgetName } from '../generated/widget-manifest';

export interface WidgetMeta {
    title: string;
    description?: string;
    invoking?: string;
    invoked?: string;
    accessible?: boolean;
    visibility?: 'public' | 'private';
}

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
 * Creates a standardized widget tool configuration with auto-generated URIs
 * @param widgetName - Name of the widget (must match manifest)
 * @param meta - Widget metadata and configuration
 * @param handler - Tool execution handler
 * @returns Standardized tool configuration
 */
export function createWidgetTool(
    widgetName: WidgetName,
    meta: WidgetMeta,
    handler: () => Promise<unknown>
): WidgetToolConfig {
    // Import manifest dynamically to avoid circular dependencies
    let widgetManifest: Record<string, { uri: string }>;

    try {
        // This will be available after build
        widgetManifest = require('../generated/widget-manifest').widgetManifest;
    } catch {
        // Fallback for development
        widgetManifest = {
            [widgetName]: { uri: `${widgetName}.dev-${Date.now()}` }
        };
    }

    const widgetInfo = widgetManifest[widgetName];
    if (!widgetInfo) {
        throw new Error(`Widget "${widgetName}" not found in manifest`);
    }

    return {
        name: widgetName,
        config: {
            title: meta.title,
            description: meta.description,
            _meta: {
                "openai/outputTemplate": `ui://widget/${widgetInfo.uri}`,
                "openai/toolInvocation/invoking": meta.invoking || `Running ${meta.title}...`,
                "openai/toolInvocation/invoked": meta.invoked || `Completed ${meta.title}`,
                "openai/widgetAccessible": meta.accessible ?? true,
                ...(meta.visibility && { "openai/visibility": meta.visibility })
            }
        },
        handler
    };
}

/**
 * Batch create multiple widget tools
 * @param tools - Array of widget tool definitions
 * @returns Array of standardized tool configurations
 */
export function createWidgetTools(
    tools: Array<{
        widgetName: WidgetName;
        meta: WidgetMeta;
        handler: () => Promise<unknown>;
    }>
): WidgetToolConfig[] {
    return tools.map(({ widgetName, meta, handler }) =>
        createWidgetTool(widgetName, meta, handler)
    );
}

/**
 * Environment-aware resource metadata for widgets
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
