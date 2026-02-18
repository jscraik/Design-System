import {
  type OpenAiDisplayMode,
  type OpenAiTheme,
  type OpenAiGlobals as RuntimeOpenAiGlobals,
  useHost,
  useOpenAiGlobal as useRuntimeOpenAiGlobal,
} from "@design-studio/runtime";
import type { SetStateAction } from "react";
import { useCallback } from "react";

import { validateWidgetStateBudget } from "./widget-state-budget";

// Enhanced OpenAI types based on Toolbase-AI template
/**
 * Define the generic output shape for OpenAI globals.
 */
export type GlobalOutput = {
  Input?: unknown;
  Output?: unknown;
  Metadata?: unknown;
  State?: unknown;
};

/**
 * Default output typing for OpenAI globals.
 */
export type DefaultGlobalOutputs = {
  Input: Record<string, unknown>;
  Output: Record<string, unknown>;
  Metadata: Record<string, unknown>;
  State: Record<string, unknown>;
};

/**
 * Host-provided theme mode.
 */
export type Theme = OpenAiTheme;
/**
 * Device type classification from the host.
 */
export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";
/**
 * Display mode for widget rendering.
 */
export type DisplayMode = OpenAiDisplayMode;

/**
 * Safe-area inset values in pixels.
 */
export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

/**
 * Safe-area container for inset values.
 */
export type SafeArea = {
  insets: SafeAreaInsets;
};

/**
 * User agent capabilities and device classification.
 */
export type UserAgent = {
  device: { type: DeviceType };
  capabilities: {
    hover: boolean;
    touch: boolean;
  };
};

/**
 * Global OpenAI properties exposed to widgets.
 */
export type OpenAiGlobals<T extends GlobalOutput = DefaultGlobalOutputs> = {
  // Visual properties
  theme: Theme;
  userAgent: UserAgent;
  locale: string;

  // Layout properties
  maxHeight: number;
  displayMode: DisplayMode;
  safeArea: SafeArea;

  // State management
  toolInput: T["Input"];
  toolOutput: T["Output"] | null;
  toolResponseMetadata: T["Metadata"] | null;
  widgetState: T["State"] | null;
  setWidgetState: (state: T["State"]) => Promise<void>;
};

/**
 * Response payload from a tool invocation.
 */
export type CallToolResponse = {
  result: string;
  structuredContent?: Record<string, unknown> | null;
  isError: boolean;
  meta?: Record<string, unknown> | null;
  _meta?: Record<string, unknown> | null;
};

/**
 * Request a widget display mode change.
 */
export type RequestDisplayMode = (args: { mode: DisplayMode }) => Promise<{
  mode: DisplayMode;
}>;

/**
 * Invoke a tool from inside a widget.
 */
export type CallTool = (name: string, args: Record<string, unknown>) => Promise<CallToolResponse>;

/**
 * DOM event type emitted when globals are updated.
 */
/**
 * Return a global OpenAI property with reactive updates.
 * @param key - The OpenAI globals key to read.
 * @returns The current value for the requested key.
 */
export function useOpenAIGlobal<T extends GlobalOutput, K extends keyof OpenAiGlobals<T>>(
  key: K,
): OpenAiGlobals<T>[K] | undefined {
  return useRuntimeOpenAiGlobal(key as keyof RuntimeOpenAiGlobals) as
    | OpenAiGlobals<T>[K]
    | undefined;
}

/**
 * Return widget state with a React-style setter.
 * @returns A tuple of the current widget state and a setter function.
 * @example
 * const [state, setState] = useWidgetState<{ count: number }>();
 * setState((prev) => ({ count: (prev?.count ?? 0) + 1 }));
 */
export function useWidgetState<T extends Record<string, unknown>>(): readonly [
  T | null | undefined,
  (state: SetStateAction<T | null | undefined>) => void,
] {
  const currentState = useOpenAIGlobal<{ State: T }, "widgetState">("widgetState");
  const host = useHost();

  const setState = useCallback(
    (action: SetStateAction<T | null | undefined>) => {
      if (!host.setState) {
        return;
      }

      const newState = typeof action === "function" ? action(currentState) : action;

      if (newState != null) {
        validateWidgetStateBudget(newState);
        host.setState(newState);
      }
    },
    [host, currentState],
  );

  return [currentState, setState] as const;
}

/**
 * Return the current theme.
 * @returns The theme name or undefined if unavailable.
 */
export function useTheme(): Theme | undefined {
  return useOpenAIGlobal("theme");
}

/**
 * Return the current display mode and a request helper.
 * @returns The display mode and a request function (if available).
 */
export function useDisplayMode(): {
  mode: DisplayMode | undefined;
  requestMode: RequestDisplayMode | undefined;
} {
  const mode = useOpenAIGlobal("displayMode");
  const host = useHost();
  const requestMode = host.requestDisplayMode;

  return { mode, requestMode };
}

/**
 * Return user agent capabilities.
 * @returns The user agent info or undefined if unavailable.
 */
export function useUserAgent(): UserAgent | undefined {
  return useOpenAIGlobal("userAgent");
}

/**
 * Return safe-area information for layout.
 * @returns The safe-area info or undefined if unavailable.
 */
export function useSafeArea(): SafeArea | undefined {
  return useOpenAIGlobal("safeArea");
}

/**
 * Return the maximum height constraint for the widget.
 * @returns The max height value or undefined if unavailable.
 */
export function useMaxHeight(): number | undefined {
  return useOpenAIGlobal("maxHeight");
}

/**
 * Return the tool input payload.
 * @returns The tool input payload or undefined if unavailable.
 */
export function useToolInput<T = Record<string, unknown>>(): T | undefined {
  return useOpenAIGlobal("toolInput") as T | undefined;
}

/**
 * Return the tool output payload.
 * @returns The tool output payload or undefined if unavailable.
 */
export function useToolOutput<T = Record<string, unknown>>(): T | null | undefined {
  return useOpenAIGlobal("toolOutput") as T | null | undefined;
}

/**
 * Return the tool response metadata payload.
 * @returns The metadata payload or undefined if unavailable.
 */
export function useToolMetadata<T = Record<string, unknown>>(): T | null | undefined {
  return useOpenAIGlobal("toolResponseMetadata") as T | null | undefined;
}

/**
 * Return a helper to call tools from within the widget.
 * @returns The callTool function or undefined if unavailable.
 */
export function useCallTool(): CallTool | undefined {
  const host = useHost();
  return host.callTool as CallTool | undefined;
}

/**
 * Return derived device capability flags.
 * @returns Convenience flags for device type and input capabilities.
 */
export function useDeviceCapabilities() {
  const userAgent = useUserAgent();

  return {
    isMobile: userAgent?.device.type === "mobile",
    isTablet: userAgent?.device.type === "tablet",
    isDesktop: userAgent?.device.type === "desktop",
    hasHover: userAgent?.capabilities.hover ?? false,
    hasTouch: userAgent?.capabilities.touch ?? false,
  };
}

/**
 * Return the active locale string.
 * @returns The locale or undefined if unavailable.
 */
export function useLocale(): string | undefined {
  return useOpenAIGlobal("locale");
}

/**
 * Return a helper to send follow-up messages via the host.
 */
export function useSendMessage(): ((text: string) => Promise<void>) | undefined {
  const host = useHost();
  return host.sendMessage;
}
