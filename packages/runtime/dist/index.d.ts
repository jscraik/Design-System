import type { ReactNode } from "react";
/**
 * Event name used by the host to announce `window.openai` updates.
 */
export declare const SET_GLOBALS_EVENT_TYPE: "openai:set_globals";
type UnknownRecord = Record<string, unknown>;
/**
 * Display modes supported by the Apps SDK host.
 */
export type OpenAiDisplayMode = "inline" | "pip" | "fullscreen";
/**
 * Theme modes supported by the Apps SDK host.
 */
export type OpenAiTheme = "light" | "dark";
/**
 * Globals provided by the ChatGPT host via window.openai
 * @see https://developers.openai.com/apps-sdk/build/chatgpt-ui
 */
export interface OpenAiGlobals {
    /** Arguments supplied when the tool was invoked */
    toolInput?: UnknownRecord;
    /** structuredContent from tool result - surfaced to model and component */
    toolOutput?: UnknownRecord;
    /** _meta payload from tool result - only widget sees it, never the model */
    toolResponseMetadata?: UnknownRecord;
    /** Snapshot of UI state persisted between renders */
    widgetState?: UnknownRecord | null;
    /** BCP 47 locale string (e.g., "en-US") */
    locale?: string;
    /** Current theme */
    theme?: OpenAiTheme;
    /** Current display mode */
    displayMode?: OpenAiDisplayMode;
    /** Maximum height for the widget iframe */
    maxHeight?: number;
    /** Safe area insets for mobile */
    safeArea?: UnknownRecord;
    /** View configuration */
    view?: UnknownRecord;
    /** User agent hint for analytics or formatting */
    userAgent?: string;
}
/**
 * Full window.openai bridge interface per Apps SDK spec
 * @see https://developers.openai.com/apps-sdk/reference
 */
export interface OpenAiBridge extends OpenAiGlobals {
    /** Stores a new widget state snapshot synchronously */
    setWidgetState?: (state: UnknownRecord | null) => void;
    /** Gets current widget state */
    getWidgetState?: () => UnknownRecord | null;
    /** Invoke another MCP tool from the widget */
    callTool?: (name: string, args?: UnknownRecord) => Promise<unknown>;
    /** Ask ChatGPT to post a message authored by the component */
    sendFollowUpMessage?: (args: {
        prompt: string;
    }) => Promise<unknown>;
    /** Upload a user-selected file and receive a fileId (supports image/png, image/jpeg, image/webp) */
    uploadFile?: (file: File) => Promise<{
        fileId: string;
    }>;
    /** Request a temporary download URL for a file */
    getFileDownloadUrl?: (args: {
        fileId: string;
    }) => Promise<{
        downloadUrl: string;
    }>;
    /** Request PiP/fullscreen modes */
    requestDisplayMode?: (args: {
        mode: OpenAiDisplayMode;
    }) => Promise<unknown>;
    /** Spawn a modal owned by ChatGPT */
    requestModal?: (args: UnknownRecord) => Promise<unknown>;
    /** Report dynamic widget heights to avoid scroll clipping */
    notifyIntrinsicHeight?: (args: {
        height: number;
    }) => void;
    /** Open a vetted external link in the user's browser */
    openExternal?: (args: {
        href: string;
    }) => Promise<unknown>;
    /** Request to close the widget */
    requestClose?: () => void;
}
/**
 * Custom event payload emitted when the host updates `window.openai`.
 */
export interface SetGlobalsEvent extends CustomEvent<{
    globals: OpenAiGlobals;
}> {
    type: typeof SET_GLOBALS_EVENT_TYPE;
}
declare global {
    interface Window {
        openai?: OpenAiBridge;
    }
}
/**
 * Host abstraction for both embedded (ChatGPT) and standalone modes
 */
/**
 * Host abstraction for embedded and standalone widget environments.
 */
export type Host = {
    mode: "embedded" | "standalone";
    toolInput?: unknown;
    toolOutput?: unknown;
    toolResponseMetadata?: unknown;
    callTool?: (name: string, args?: unknown) => Promise<unknown>;
    sendMessage?: (text: string) => Promise<void>;
    getState?: () => unknown;
    setState?: (state: unknown) => void;
    uploadFile?: (file: File) => Promise<{
        fileId: string;
    }>;
    getFileDownloadUrl?: (args: {
        fileId: string;
    }) => Promise<{
        downloadUrl: string;
    }>;
    requestDisplayMode?: (args: {
        mode: OpenAiDisplayMode;
    }) => Promise<unknown>;
    requestModal?: (args: UnknownRecord) => Promise<unknown>;
    openExternal?: (args: {
        href: string;
    }) => Promise<unknown>;
    requestClose?: () => void;
    notifyIntrinsicHeight?: (args: {
        height: number;
    }) => void;
};
/**
 * Provide a host instance to widget components.
 * @param props - Provider props.
 * @returns The provider element.
 */
export declare function HostProvider({ host, children }: {
    host: Host;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Access the current host instance.
 * @returns The host instance.
 * @throws Error when the host provider is missing.
 */
export declare function useHost(): Host;
/**
 * Create a host adapter for embedded ChatGPT mode (wraps `window.openai`).
 * @returns The embedded host adapter.
 */
export declare function createEmbeddedHost(): Host;
/**
 * Create a host adapter for standalone mode (API-based).
 * @param apiBase - Base URL for the standalone API.
 * @returns The standalone host adapter.
 */
export declare function createStandaloneHost(apiBase: string): Host;
/**
 * Create a mock host for testing or Storybook.
 * @param overrides - Partial host overrides.
 * @returns A mock host implementation.
 */
export declare function createMockHost(overrides?: Partial<Host>): Host;
export type HostAdapterOptions = {
    mode?: "embedded" | "standalone" | "mock";
    apiBase?: string;
    mockOverrides?: Partial<Host>;
};
/**
 * Create the best available host adapter for the current environment.
 * @param options - Optional configuration for host selection.
 * @returns A host adapter implementation.
 */
export declare function createHostAdapter(options?: HostAdapterOptions): Host;
/**
 * Subscribe to `window.openai` global changes dispatched by the host.
 * @param key - Global key to read.
 * @returns The current value for the key.
 * @see https://developers.openai.com/apps-sdk/build/chatgpt-ui
 */
export declare function useOpenAiGlobal<K extends keyof OpenAiGlobals>(key: K): OpenAiGlobals[K];
/**
 * Read a `window.openai` global value outside React.
 * @param key - Global key to read.
 * @returns The value for the key, or undefined when unavailable.
 */
export declare function getOpenAiGlobal<K extends keyof OpenAiGlobals>(key: K): OpenAiGlobals[K] | undefined;
/** Return the current tool input payload. */
export declare function useToolInput(): UnknownRecord | undefined;
/** Return the current tool output payload. */
export declare function useToolOutput(): UnknownRecord | undefined;
/** Return the current tool response metadata. */
export declare function useToolResponseMetadata(): UnknownRecord | undefined;
/** Return the current widget state snapshot. */
export declare function useWidgetState(): UnknownRecord | null | undefined;
/** Return the current theme. */
export declare function useTheme(): OpenAiTheme | undefined;
/** Return the current display mode. */
export declare function useDisplayMode(): OpenAiDisplayMode | undefined;
/** Return the current locale string. */
export declare function useLocale(): string | undefined;
/** Return the current maximum height constraint. */
export declare function useMaxHeight(): number | undefined;
/**
 * Create a mock `window.openai` bridge for standalone or Storybook use.
 * @param overrides - Partial overrides for the mock bridge.
 * @returns A mock OpenAI bridge implementation.
 */
export declare function createMockOpenAI(overrides?: Partial<OpenAiBridge>): OpenAiBridge;
/**
 * Ensure a minimal `window.openai` exists for standalone or Storybook rendering.
 * @param overrides - Partial overrides for the mock bridge.
 */
export declare function ensureMockOpenAI(overrides?: Partial<OpenAiBridge>): void;
export {};
//# sourceMappingURL=index.d.ts.map