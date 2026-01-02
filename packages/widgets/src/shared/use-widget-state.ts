import { useCallback, useEffect, useState, type SetStateAction } from "react";
import { useHost, useOpenAiGlobal as useOpenAiGlobalRuntime } from "@chatui/runtime";

import type { UnknownObject } from "./types";

/**
 * Reads and writes widget state, syncing with the host when available.
 *
 * @param defaultState - Default state value or factory.
 * @returns A tuple of `[state, setState]`.
 *
 * @example
 * ```ts
 * const [state, setState] = useWidgetState({ count: 0 });
 * ```
 */
export function useWidgetState<T extends UnknownObject>(
  defaultState: T | (() => T),
): readonly [T, (state: SetStateAction<T>) => void];
/**
 * Reads and writes optional widget state, syncing with the host when available.
 *
 * @param defaultState - Default state value or factory, or `null`.
 * @returns A tuple of `[state, setState]` where state may be `null`.
 */
export function useWidgetState<T extends UnknownObject>(
  defaultState?: T | (() => T | null) | null,
): readonly [T | null, (state: SetStateAction<T | null>) => void];
/**
 * Implementation signature for `useWidgetState`.
 */
export function useWidgetState<T extends UnknownObject>(
  defaultState?: T | (() => T | null) | null,
): readonly [T | null, (state: SetStateAction<T | null>) => void] {
  const widgetStateFromWindow = useOpenAiGlobalRuntime("widgetState") as T | null | undefined;
  const host = useHost();

  const [widgetState, _setWidgetState] = useState<T | null>(() => {
    if (widgetStateFromWindow !== undefined) {
      return widgetStateFromWindow;
    }

    return typeof defaultState === "function" ? defaultState() : (defaultState ?? null);
  });

  useEffect(() => {
    if (widgetStateFromWindow !== undefined) {
      _setWidgetState(widgetStateFromWindow);
    }
  }, [widgetStateFromWindow]);

  const setWidgetState = useCallback(
    (state: SetStateAction<T | null>) => {
      _setWidgetState((prevState) => {
        const newState = typeof state === "function" ? state(prevState) : state;

        if (newState !== undefined) {
          if (host.setState) {
            host.setState(newState);
          } else if (typeof window !== "undefined") {
            void window.openai?.setWidgetState?.(newState ?? null);
          }
        }

        return newState;
      });
    },
    [host],
  );

  return [widgetState, setWidgetState] as const;
}
