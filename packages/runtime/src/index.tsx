import type { ReactNode } from "react";
import { createContext, useContext, useSyncExternalStore } from "react";

/**
 * Event name used by the host to announce `window.openai` updates.
 */
export const SET_GLOBALS_EVENT_TYPE = "openai:set_globals" as const;

type UnknownRecord = Record<string, unknown>;

// Display modes per Apps SDK spec
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
  sendFollowUpMessage?: (args: { prompt: string }) => Promise<unknown>;
  /** Upload a user-selected file and receive a fileId (supports image/png, image/jpeg, image/webp) */
  uploadFile?: (file: File) => Promise<{ fileId: string }>;
  /** Request a temporary download URL for a file */
  getFileDownloadUrl?: (args: { fileId: string }) => Promise<{ downloadUrl: string }>;
  /** Request PiP/fullscreen modes */
  requestDisplayMode?: (args: { mode: OpenAiDisplayMode }) => Promise<unknown>;
  /** Spawn a modal owned by ChatGPT */
  requestModal?: (args: UnknownRecord) => Promise<unknown>;
  /** Report dynamic widget heights to avoid scroll clipping */
  notifyIntrinsicHeight?: (args: { height: number }) => void;
  /** Open a vetted external link in the user's browser */
  openExternal?: (args: { href: string }) => Promise<unknown>;
  /** Request to close the widget */
  requestClose?: () => void;
}

/**
 * Custom event payload emitted when the host updates `window.openai`.
 */
export interface SetGlobalsEvent extends CustomEvent<{ globals: OpenAiGlobals }> {
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
  uploadFile?: (file: File) => Promise<{ fileId: string }>;
  getFileDownloadUrl?: (args: { fileId: string }) => Promise<{ downloadUrl: string }>;
  requestDisplayMode?: (args: { mode: OpenAiDisplayMode }) => Promise<unknown>;
  requestModal?: (args: UnknownRecord) => Promise<unknown>;
  openExternal?: (args: { href: string }) => Promise<unknown>;
  requestClose?: () => void;
  notifyIntrinsicHeight?: (args: { height: number }) => void;
};

const HostContext = createContext<Host | null>(null);

/**
 * Provide a host instance to widget components.
 * @param props - Provider props.
 * @returns The provider element.
 */
export function HostProvider({ host, children }: { host: Host; children: ReactNode }) {
  return <HostContext.Provider value={host}>{children}</HostContext.Provider>;
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
export function createEmbeddedHost(): Host {
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
      if (!openai?.callTool) return undefined;
      return (name: string, args?: unknown) => {
        const current = getOpenAi();
        if (!current?.callTool) {
          return Promise.reject(new Error("window.openai.callTool is unavailable"));
        }
        return current.callTool(name, args as UnknownRecord);
      };
    },
    get sendMessage() {
      const openai = getOpenAi();
      if (!openai?.sendFollowUpMessage) return undefined;
      return async (text: string) => {
        const current = getOpenAi();
        if (!current?.sendFollowUpMessage) {
          throw new Error("window.openai.sendFollowUpMessage is unavailable");
        }
        await current.sendFollowUpMessage({ prompt: text });
      };
    },
    get getState() {
      const openai = getOpenAi();
      if (!openai?.getWidgetState) return undefined;
      return () => getOpenAi()?.getWidgetState?.();
    },
    get setState() {
      const openai = getOpenAi();
      if (!openai?.setWidgetState) return undefined;
      return (state: unknown) => {
        getOpenAi()?.setWidgetState?.(state as UnknownRecord | null);
      };
    },
    get uploadFile() {
      const openai = getOpenAi();
      if (!openai?.uploadFile) return undefined;
      return async (file: File) => {
        const current = getOpenAi();
        if (!current?.uploadFile) {
          throw new Error("window.openai.uploadFile is unavailable");
        }
        return current.uploadFile(file);
      };
    },
    get getFileDownloadUrl() {
      const openai = getOpenAi();
      if (!openai?.getFileDownloadUrl) return undefined;
      return async (args: { fileId: string }) => {
        const current = getOpenAi();
        if (!current?.getFileDownloadUrl) {
          throw new Error("window.openai.getFileDownloadUrl is unavailable");
        }
        return current.getFileDownloadUrl(args);
      };
    },
    get requestDisplayMode() {
      const openai = getOpenAi();
      if (!openai?.requestDisplayMode) return undefined;
      return async (args: { mode: OpenAiDisplayMode }) => {
        const current = getOpenAi();
        if (!current?.requestDisplayMode) {
          throw new Error("window.openai.requestDisplayMode is unavailable");
        }
        return current.requestDisplayMode(args);
      };
    },
    get requestModal() {
      const openai = getOpenAi();
      if (!openai?.requestModal) return undefined;
      return async (args: UnknownRecord) => {
        const current = getOpenAi();
        if (!current?.requestModal) {
          throw new Error("window.openai.requestModal is unavailable");
        }
        return current.requestModal(args);
      };
    },
    get openExternal() {
      const openai = getOpenAi();
      if (!openai?.openExternal) return undefined;
      return async (args: { href: string }) => {
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
      if (!openai?.notifyIntrinsicHeight) return undefined;
      return (args: { height: number }) => openai.notifyIntrinsicHeight!(args);
    },
  };
}

/**
 * Create a host adapter for standalone mode (API-based).
 * @param apiBase - Base URL for the standalone API.
 * @returns The standalone host adapter.
 */
export function createStandaloneHost(apiBase: string): Host {
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
    setState: () => {},
    uploadFile: async () => {
      throw new Error("uploadFile is not available in standalone mode");
    },
    getFileDownloadUrl: async () => {
      throw new Error("getFileDownloadUrl is not available in standalone mode");
    },
    requestDisplayMode: async () => {},
    requestModal: async () => {},
    openExternal: async () => {},
    requestClose: () => {},
    notifyIntrinsicHeight: () => {},
  };
}

/**
 * Create a mock host for testing or Storybook.
 * @param overrides - Partial host overrides.
 * @returns A mock host implementation.
 */
export function createMockHost(overrides: Partial<Host> = {}): Host {
  return {
    mode: "standalone",
    callTool: async () => ({ ok: true }),
    sendMessage: async () => {},
    getState: () => null,
    setState: () => {},
    uploadFile: async () => ({ fileId: "mock-file-id" }),
    getFileDownloadUrl: async () => ({ downloadUrl: "https://example.com/mock-file" }),
    requestDisplayMode: async () => {},
    requestModal: async () => {},
    openExternal: async () => {},
    requestClose: () => {},
    notifyIntrinsicHeight: () => {},
    ...overrides,
  };
}

/**
 * Subscribe to `window.openai` global changes dispatched by the host.
 * @param key - Global key to read.
 * @returns The current value for the key.
 * @see https://developers.openai.com/apps-sdk/build/chatgpt-ui
 */
export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(key: K): OpenAiGlobals[K] {
  const isBrowser = typeof window !== "undefined";
  return useSyncExternalStore(
    (onChange: () => void) => {
      if (!isBrowser) return () => {};
      const handleSetGlobal = (event: Event) => {
        const typed = event as SetGlobalsEvent;
        const value = typed.detail?.globals?.[key];
        if (value === undefined) return;
        onChange();
      };

      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, {
        passive: true,
      });

      return () => {
        window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
      };
    },
    () => (isBrowser ? window.openai?.[key] : undefined),
    () => undefined,
  );
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
export function createMockOpenAI(overrides: Partial<OpenAiBridge> = {}): OpenAiBridge {
  const mock: OpenAiBridge = {
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
    setWidgetState: () => {},
    getWidgetState: () => null,
    callTool: async () => {
      throw new Error(
        "callTool is not available in standalone mode. Run this UI inside ChatGPT (Apps SDK) or provide a mock implementation.",
      );
    },
    sendFollowUpMessage: async () => {
      throw new Error(
        "sendFollowUpMessage is not available in standalone mode. Run this UI inside ChatGPT (Apps SDK) or provide a mock implementation.",
      );
    },
    uploadFile: async () => ({ fileId: "mock-file-id" }),
    getFileDownloadUrl: async () => ({ downloadUrl: "https://example.com/mock-file" }),
    requestDisplayMode: async () => {},
    requestModal: async () => {},
    notifyIntrinsicHeight: () => {},
    openExternal: async () => {},
    requestClose: () => {},
    ...overrides,
  };

  return mock;
}

/**
 * Ensure a minimal `window.openai` exists for standalone or Storybook rendering.
 * @param overrides - Partial overrides for the mock bridge.
 */
export function ensureMockOpenAI(overrides: Partial<OpenAiBridge> = {}) {
  if (typeof window === "undefined") return;
  if (window.openai) return;
  window.openai = createMockOpenAI(overrides);
}
