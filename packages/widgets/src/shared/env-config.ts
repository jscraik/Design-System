/**
 * Environment configuration utilities inspired by Toolbase-AI template
 * Provides type-safe environment variable handling and validation
 */

export interface EnvironmentConfig {
    WORKER_DOMAIN_BASE?: string;
    WIDGET_DOMAIN?: string;
    NODE_ENV: 'development' | 'production' | 'test';
    DEV: boolean;
    PROD: boolean;
}

/**
 * Get environment configuration with validation
 */
export function getEnvironmentConfig(): EnvironmentConfig {
    const env = import.meta.env;
    const nodeEnv =
        env.NODE_ENV === "production" || env.NODE_ENV === "test" ? env.NODE_ENV : "development";

    return {
        WORKER_DOMAIN_BASE: env.VITE_WORKER_DOMAIN_BASE || env.WORKER_DOMAIN_BASE,
        WIDGET_DOMAIN: env.VITE_WIDGET_DOMAIN || env.WIDGET_DOMAIN,
        NODE_ENV: nodeEnv,
        DEV: env.DEV || false,
        PROD: env.PROD || false,
    };
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(required: (keyof EnvironmentConfig)[] = []): void {
    const config = getEnvironmentConfig();
    const missing: string[] = [];

    for (const key of required) {
        if (!config[key]) {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}. ` +
            `Please set these in your .env file or environment.`
        );
    }
}

/**
 * Get base URL for widget resources
 */
export function getWidgetBaseUrl(): string {
    const config = getEnvironmentConfig();

    if (config.DEV) {
        return 'http://localhost:5173'; // Default Vite dev server
    }

    return config.WORKER_DOMAIN_BASE || '';
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
    return getEnvironmentConfig().DEV;
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
    return getEnvironmentConfig().PROD;
}

/**
 * Get widget domain for CSP configuration
 */
export function getWidgetDomain(): string | undefined {
    return getEnvironmentConfig().WIDGET_DOMAIN;
}

/**
 * Create environment-aware resource metadata
 */
export function createEnvironmentMeta() {
    const config = getEnvironmentConfig();

    type WidgetCSP = {
        connect_domains: string[];
        resource_domains: string[];
    };
    type EnvironmentMeta = {
        "openai/widgetCSP": WidgetCSP;
        "openai/widgetDomain"?: string;
    };

    const meta: EnvironmentMeta = {
        "openai/widgetCSP": {
            connect_domains: [] as string[],
            resource_domains: [] as string[],
        },
    };

    if (config.WIDGET_DOMAIN) {
        meta["openai/widgetDomain"] = config.WIDGET_DOMAIN;
    }

    if (config.WORKER_DOMAIN_BASE) {
        meta["openai/widgetCSP"].resource_domains.push(config.WORKER_DOMAIN_BASE);
    }

    // Add development-specific domains
    if (config.DEV) {
        meta["openai/widgetCSP"].resource_domains.push('http://localhost:5173');
        meta["openai/widgetCSP"].connect_domains.push('http://localhost:5173');
    }

    return meta;
}
