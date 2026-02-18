import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useSyncExternalStore } from "react";
/**
 * Event name used by the host to announce `window.openai` updates.
 */
export const SET_GLOBALS_EVENT_TYPE = "openai:set_globals";
const HostContext = createContext(null);
/**
 * Provide a host instance to widget components.
 * @param props - Provider props.
 * @returns The provider element.
 */
export function HostProvider({ host, children }) {
    return _jsx(HostContext.Provider, { value: host, children: children });
}
/**
 * Access the current host instance.
 * @returns The host instance.
 * @throws Error when the host provider is missing.
 */
export function useHost() {
    const host = useContext(HostContext);
    if (!host) {
        throw new Error("HostProvider is missing. Wrap your app in <HostProvider />.");
    }
    return host;
}
/**
 * Create a host adapter for embedded ChatGPT mode (wraps `window.openai`).
 * @returns The embedded host adapter.
 */
export function createEmbeddedHost() {
    const getOpenAi = () => (typeof window !== "undefined" ? window.openai : undefined);
    return {
        mode: "embedded",
        get toolInput() {
            return getOpenAi()?.toolInput;
        },
        get toolOutput() {
            return getOpenAi()?.toolOutput;
        },
        get toolResponseMetadata() {
            return getOpenAi()?.toolResponseMetadata;
        },
        get callTool() {
            const openai = getOpenAi();
            if (!openai?.callTool)
                return undefined;
            return (name, args) => {
                const current = getOpenAi();
                if (!current?.callTool) {
                    return Promise.reject(new Error("window.openai.callTool is unavailable"));
                }
                return current.callTool(name, args);
            };
        },
        get sendMessage() {
            const openai = getOpenAi();
            if (!openai?.sendFollowUpMessage)
                return undefined;
            return async (text) => {
                const current = getOpenAi();
                if (!current?.sendFollowUpMessage) {
                    throw new Error("window.openai.sendFollowUpMessage is unavailable");
                }
                await current.sendFollowUpMessage({ prompt: text });
            };
        },
        get getState() {
            const openai = getOpenAi();
            if (!openai?.getWidgetState)
                return undefined;
            return () => getOpenAi()?.getWidgetState?.();
        },
        get setState() {
            const openai = getOpenAi();
            if (!openai?.setWidgetState)
                return undefined;
            return (state) => {
                getOpenAi()?.setWidgetState?.(state);
            };
        },
        get uploadFile() {
            const openai = getOpenAi();
            if (!openai?.uploadFile)
                return undefined;
            return async (file) => {
                const current = getOpenAi();
                if (!current?.uploadFile) {
                    throw new Error("window.openai.uploadFile is unavailable");
                }
                return current.uploadFile(file);
            };
        },
        get getFileDownloadUrl() {
            const openai = getOpenAi();
            if (!openai?.getFileDownloadUrl)
                return undefined;
            return async (args) => {
                const current = getOpenAi();
                if (!current?.getFileDownloadUrl) {
                    throw new Error("window.openai.getFileDownloadUrl is unavailable");
                }
                return current.getFileDownloadUrl(args);
            };
        },
        get requestDisplayMode() {
            const openai = getOpenAi();
            if (!openai?.requestDisplayMode)
                return undefined;
            return async (args) => {
                const current = getOpenAi();
                if (!current?.requestDisplayMode) {
                    throw new Error("window.openai.requestDisplayMode is unavailable");
                }
                return current.requestDisplayMode(args);
            };
        },
        get requestModal() {
            const openai = getOpenAi();
            if (!openai?.requestModal)
                return undefined;
            return async (args) => {
                const current = getOpenAi();
                if (!current?.requestModal) {
                    throw new Error("window.openai.requestModal is unavailable");
                }
                return current.requestModal(args);
            };
        },
        get openExternal() {
            const openai = getOpenAi();
            if (!openai?.openExternal)
                return undefined;
            return async (args) => {
                const current = getOpenAi();
                if (!current?.openExternal) {
                    throw new Error("window.openai.openExternal is unavailable");
                }
                return current.openExternal(args);
            };
        },
        get requestClose() {
            const openai = getOpenAi();
            return openai?.requestClose?.bind(openai);
        },
        get notifyIntrinsicHeight() {
            const openai = getOpenAi();
            if (!openai?.notifyIntrinsicHeight)
                return undefined;
            return (args) => openai.notifyIntrinsicHeight(args);
        },
    };
}
/**
 * Create a host adapter for standalone mode (API-based).
 * @param apiBase - Base URL for the standalone API.
 * @returns The standalone host adapter.
 */
export function createStandaloneHost(apiBase) {
    return {
        mode: "standalone",
        async callTool(name, args) {
            const res = await fetch(`${apiBase}/api/${name}`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(args),
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return await res.json();
        },
        async sendMessage(text) {
            console.log("standalone send:", text);
        },
        getState: () => null,
        setState: () => { },
        uploadFile: async () => {
            throw new Error("uploadFile is not available in standalone mode");
        },
        getFileDownloadUrl: async () => {
            throw new Error("getFileDownloadUrl is not available in standalone mode");
        },
        requestDisplayMode: async () => { },
        requestModal: async () => { },
        openExternal: async () => { },
        requestClose: () => { },
        notifyIntrinsicHeight: () => { },
    };
}
/**
 * Create a mock host for testing or Storybook.
 * @param overrides - Partial host overrides.
 * @returns A mock host implementation.
 */
export function createMockHost(overrides = {}) {
    return {
        mode: "standalone",
        callTool: async () => ({ ok: true }),
        sendMessage: async () => { },
        getState: () => null,
        setState: () => { },
        uploadFile: async () => ({ fileId: "mock-file-id" }),
        getFileDownloadUrl: async () => ({ downloadUrl: "https://example.com/mock-file" }),
        requestDisplayMode: async () => { },
        requestModal: async () => { },
        openExternal: async () => { },
        requestClose: () => { },
        notifyIntrinsicHeight: () => { },
        ...overrides,
    };
}
/**
 * Create the best available host adapter for the current environment.
 * @param options - Optional configuration for host selection.
 * @returns A host adapter implementation.
 */
export function createHostAdapter(options = {}) {
    const isBrowser = typeof window !== "undefined";
    if (options.mode === "mock") {
        return createMockHost(options.mockOverrides);
    }
    if (options.mode === "standalone") {
        if (!options.apiBase) {
            throw new Error("createHostAdapter requires apiBase for standalone mode");
        }
        return createStandaloneHost(options.apiBase);
    }
    if (isBrowser && window.openai) {
        return createEmbeddedHost();
    }
    if (options.apiBase) {
        return createStandaloneHost(options.apiBase);
    }
    return createMockHost(options.mockOverrides);
}
/**
 * Subscribe to `window.openai` global changes dispatched by the host.
 * @param key - Global key to read.
 * @returns The current value for the key.
 * @see https://developers.openai.com/apps-sdk/build/chatgpt-ui
 */
export function useOpenAiGlobal(key) {
    const isBrowser = typeof window !== "undefined";
    return useSyncExternalStore((onChange) => {
        if (!isBrowser)
            return () => { };
        const handleSetGlobal = (event) => {
            const typed = event;
            const value = typed.detail?.globals?.[key];
            if (value === undefined)
                return;
            onChange();
        };
        window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, {
            passive: true,
        });
        return () => {
            window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
        };
    }, () => (isBrowser ? window.openai?.[key] : undefined), () => undefined);
}
/**
 * Read a `window.openai` global value outside React.
 * @param key - Global key to read.
 * @returns The value for the key, or undefined when unavailable.
 */
export function getOpenAiGlobal(key) {
    if (typeof window === "undefined")
        return undefined;
    return window.openai?.[key];
}
// Convenience hooks for common globals
/** Return the current tool input payload. */
export function useToolInput() {
    return useOpenAiGlobal("toolInput");
}
/** Return the current tool output payload. */
export function useToolOutput() {
    return useOpenAiGlobal("toolOutput");
}
/** Return the current tool response metadata. */
export function useToolResponseMetadata() {
    return useOpenAiGlobal("toolResponseMetadata");
}
/** Return the current widget state snapshot. */
export function useWidgetState() {
    return useOpenAiGlobal("widgetState");
}
/** Return the current theme. */
export function useTheme() {
    return useOpenAiGlobal("theme");
}
/** Return the current display mode. */
export function useDisplayMode() {
    return useOpenAiGlobal("displayMode");
}
/** Return the current locale string. */
export function useLocale() {
    return useOpenAiGlobal("locale");
}
/** Return the current maximum height constraint. */
export function useMaxHeight() {
    return useOpenAiGlobal("maxHeight");
}
/**
 * Create a mock `window.openai` bridge for standalone or Storybook use.
 * @param overrides - Partial overrides for the mock bridge.
 * @returns A mock OpenAI bridge implementation.
 */
export function createMockOpenAI(overrides = {}) {
    const mock = {
        theme: "dark",
        displayMode: "inline",
        locale: "en-US",
        maxHeight: 600,
        toolInput: {},
        toolOutput: {
            demo: true,
            message: "Standalone mode: window.openai was mocked.",
        },
        toolResponseMetadata: {},
        widgetState: null,
        setWidgetState: () => { },
        getWidgetState: () => null,
        callTool: async () => {
            throw new Error("callTool is not available in standalone mode. Run this UI inside ChatGPT (Apps SDK) or provide a mock implementation.");
        },
        sendFollowUpMessage: async () => {
            throw new Error("sendFollowUpMessage is not available in standalone mode. Run this UI inside ChatGPT (Apps SDK) or provide a mock implementation.");
        },
        uploadFile: async () => ({ fileId: "mock-file-id" }),
        getFileDownloadUrl: async () => ({ downloadUrl: "https://example.com/mock-file" }),
        requestDisplayMode: async () => { },
        requestModal: async () => { },
        notifyIntrinsicHeight: () => { },
        openExternal: async () => { },
        requestClose: () => { },
        ...overrides,
    };
    return mock;
}
/**
 * Ensure a minimal `window.openai` exists for standalone or Storybook rendering.
 * @param overrides - Partial overrides for the mock bridge.
 */
export function ensureMockOpenAI(overrides = {}) {
    if (typeof window === "undefined")
        return;
    if (window.openai)
        return;
    window.openai = createMockOpenAI(overrides);
}
