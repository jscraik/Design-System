import { useOpenAiGlobal } from "./use-openai-global";

/**
 * Reads widget props from the host `toolOutput`, falling back to a default value.
 *
 * @param defaultState - Fallback object or factory when tool output is unavailable.
 * @returns Widget props resolved from the host or fallback.
 *
 * @example
 * ```ts
 * const props = useWidgetProps({ title: "Untitled" });
 * ```
 */
export function useWidgetProps<T extends Record<string, unknown>>(defaultState?: T | (() => T)): T {
  const props = useOpenAiGlobal("toolOutput") as T;

  const fallback =
    typeof defaultState === "function"
      ? (defaultState as () => T | null)()
      : (defaultState ?? null);

  return props ?? fallback;
}
