import { useSyncExternalStore } from "react";

export const SET_GLOBALS_EVENT_TYPE = "openai:set_globals" as const;

type UnknownRecord = Record<string, unknown>;

export type OpenAiDisplayMode = "inline" | "pip" | "fullscreen";
export type OpenAiTheme = "light" | "dark";

export interface OpenAiGlobals {
  toolInput?: UnknownRecord;
  toolOutput?: UnknownRecord;
  toolResponseMetadata?: UnknownRecord;
  widgetState?: UnknownRecord | null;
  locale?: string;
  theme?: OpenAiTheme;
  displayMode?: OpenAiDisplayMode;
  maxHeight?: number;
  safeArea?: UnknownRecord;
  view?: UnknownRecord;
  userAgent?: string;
}

export interface OpenAiBridge extends OpenAiGlobals {
  setWidgetState?: (state: UnknownRecord | null) => void;
  callTool?: (name: string, args?: UnknownRecord) => Promise<unknown>;
  sendFollowUpMessage?: (args: { prompt: string }) => Promise<unknown>;
  uploadFile?: (file: File) => Promise<{ fileId: string }>;
  getFileDownloadUrl?: (args: { fileId: string }) => Promise<{ downloadUrl: string }>;
  requestDisplayMode?: (args: { mode: OpenAiDisplayMode }) => Promise<unknown>;
  requestModal?: (args: UnknownRecord) => Promise<unknown>;
  notifyIntrinsicHeight?: (args: { height: number }) => void;
  openExternal?: (args: { href: string }) => Promise<unknown>;
  requestClose?: () => void;
}

export interface SetGlobalsEvent extends CustomEvent<{ globals: OpenAiGlobals }> {
  type: typeof SET_GLOBALS_EVENT_TYPE;
}

declare global {
  interface Window {
    openai?: OpenAiBridge;
  }
}

/**
 * Subscribe to `window.openai` global changes dispatched by the host.
 * Based on the Apps SDK docs: `openai:set_globals` events + `useSyncExternalStore`.
 */
export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(
  key: K
): OpenAiGlobals[K] {
  return useSyncExternalStore(
    (onChange) => {
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
    () => window.openai?.[key]
  );
}

export function useToolInput() {
  return useOpenAiGlobal("toolInput");
}

export function useToolOutput() {
  return useOpenAiGlobal("toolOutput");
}

export function useWidgetState() {
  return useOpenAiGlobal("widgetState");
}

export function createMockOpenAI(overrides: Partial<OpenAiBridge> = {}): OpenAiBridge {
  const mock: OpenAiBridge = {
    theme: "dark",
    displayMode: "inline",
    locale: "en-US",
    toolInput: {},
    toolOutput: {
      demo: true,
      message: "Standalone mode: window.openai was mocked.",
    },
    widgetState: null,
    setWidgetState: () => {},
    callTool: async () => {
      throw new Error(
        "callTool is not available in standalone mode. Run this UI inside ChatGPT (Apps SDK) or provide a mock implementation."
      );
    },
    sendFollowUpMessage: async () => {
      throw new Error(
        "sendFollowUpMessage is not available in standalone mode. Run this UI inside ChatGPT (Apps SDK) or provide a mock implementation."
      );
    },
    ...overrides,
  };

  return mock;
}

/**
 * For standalone / Storybook: provide a minimal `window.openai` so UI code can run.
 */
export function ensureMockOpenAI(overrides: Partial<OpenAiBridge> = {}) {
  if (typeof window === "undefined") return;
  if (window.openai) return;
  window.openai = createMockOpenAI(overrides);
}
