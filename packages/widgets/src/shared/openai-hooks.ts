import type { SetStateAction } from 'react';
import { useCallback, useSyncExternalStore } from 'react';

const hasWindow = typeof window !== 'undefined';
const isDev =
    typeof import.meta !== 'undefined' && Boolean((import.meta as ImportMeta).env?.DEV);

// Enhanced OpenAI types based on Toolbase-AI template
export type GlobalOutput = {
    Input?: unknown;
    Output?: unknown;
    Metadata?: unknown;
    State?: unknown;
};

export type DefaultGlobalOutputs = {
    Input: Record<string, unknown>;
    Output: Record<string, unknown>;
    Metadata: Record<string, unknown>;
    State: Record<string, unknown>;
};

export type Theme = "light" | "dark";
export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";
export type DisplayMode = "pip" | "inline" | "fullscreen";

export type SafeAreaInsets = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};

export type SafeArea = {
    insets: SafeAreaInsets;
};

export type UserAgent = {
    device: { type: DeviceType };
    capabilities: {
        hover: boolean;
        touch: boolean;
    };
};

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

export type CallToolResponse = {
    result: string;
    structuredContent?: Record<string, unknown> | null;
    isError: boolean;
    meta?: Record<string, unknown> | null;
    _meta?: Record<string, unknown> | null;
};

export type RequestDisplayMode = (args: { mode: DisplayMode }) => Promise<{
    mode: DisplayMode;
}>;

export type CallTool = (
    name: string,
    args: Record<string, unknown>
) => Promise<CallToolResponse>;

// Event types for global state updates
export const SET_GLOBALS_EVENT_TYPE = "openai:set_globals";

export class SetGlobalsEvent<T extends GlobalOutput> extends CustomEvent<{
    globals: Partial<OpenAiGlobals<T>>;
}> {
    readonly type = SET_GLOBALS_EVENT_TYPE;
}

/**
 * Enhanced hook for accessing OpenAI global properties with reactive updates
 * Based on Toolbase-AI template patterns
 */
export function useOpenAIGlobal<T extends GlobalOutput, K extends keyof OpenAiGlobals<T>>(
    key: K
): OpenAiGlobals<T>[K] | undefined {
    return useSyncExternalStore(
        (onChange) => {
            if (!hasWindow) {
                return () => { };
            }

            const handleSetGlobal = (event: SetGlobalsEvent<T>) => {
                const value = event.detail.globals[key];
                if (value === undefined) {
                    return;
                }
                onChange();
            };

            window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, {
                passive: true,
            });

            return () => {
                window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
            };
        },
        () => (hasWindow ? (window.openai as OpenAiGlobals<T>)?.[key] : undefined),
        () => undefined
    );
}

/**
 * Enhanced widget state management hook with React-like API
 * Provides persistent state across widget interactions
 */
export function useWidgetState<T extends Record<string, unknown>>(): readonly [
    T | null | undefined,
    (state: SetStateAction<T | null | undefined>) => void,
] {
    const currentState = useOpenAIGlobal<{ State: T }, 'widgetState'>('widgetState');
    const globalSetter = useOpenAIGlobal<{ State: T }, 'setWidgetState'>('setWidgetState');

    const setState = useCallback(
        (action: SetStateAction<T | null | undefined>) => {
            if (!globalSetter) {
                if (isDev) {
                    console.warn('setWidgetState is not available on window.openai');
                }
                return;
            }

            const newState =
                typeof action === 'function'
                    ? action(currentState)
                    : action;

            if (newState != null) {
                globalSetter(newState).catch((err) => {
                    if (isDev) {
                        console.warn('setWidgetState could not be set on window.openai', err);
                    }
                });
            }
        },
        [globalSetter, currentState]
    );

    return [currentState, setState] as const;
}

/**
 * Hook for accessing theme information
 */
export function useTheme(): Theme | undefined {
    return useOpenAIGlobal('theme');
}

/**
 * Hook for accessing display mode and requesting changes
 */
export function useDisplayMode(): {
    mode: DisplayMode | undefined;
    requestMode: RequestDisplayMode | undefined;
} {
    const mode = useOpenAIGlobal('displayMode');
    const requestMode = hasWindow ? window.openai?.requestDisplayMode : undefined;

    return { mode, requestMode };
}

/**
 * Hook for accessing user agent information
 */
export function useUserAgent(): UserAgent | undefined {
    return useOpenAIGlobal('userAgent');
}

/**
 * Hook for accessing safe area information for proper layout
 */
export function useSafeArea(): SafeArea | undefined {
    return useOpenAIGlobal('safeArea');
}

/**
 * Hook for accessing maximum height constraint
 */
export function useMaxHeight(): number | undefined {
    return useOpenAIGlobal('maxHeight');
}

/**
 * Hook for accessing tool input data
 */
export function useToolInput<T = Record<string, unknown>>(): T | undefined {
    return useOpenAIGlobal('toolInput') as T | undefined;
}

/**
 * Hook for accessing tool output data
 */
export function useToolOutput<T = Record<string, unknown>>(): T | null | undefined {
    return useOpenAIGlobal('toolOutput') as T | null | undefined;
}

/**
 * Hook for accessing tool response metadata
 */
export function useToolMetadata<T = Record<string, unknown>>(): T | null | undefined {
    return useOpenAIGlobal('toolResponseMetadata') as T | null | undefined;
}

/**
 * Hook for calling tools from within widgets
 */
export function useCallTool(): CallTool | undefined {
    return hasWindow ? window.openai?.callTool : undefined;
}

/**
 * Hook for responsive design based on device capabilities
 */
export function useDeviceCapabilities() {
    const userAgent = useUserAgent();

    return {
        isMobile: userAgent?.device.type === 'mobile',
        isTablet: userAgent?.device.type === 'tablet',
        isDesktop: userAgent?.device.type === 'desktop',
        hasHover: userAgent?.capabilities.hover ?? false,
        hasTouch: userAgent?.capabilities.touch ?? false,
    };
}

/**
 * Hook for locale-aware formatting and internationalization
 */
export function useLocale(): string | undefined {
    return useOpenAIGlobal('locale');
}
