import { useOpenAiGlobal } from "./use-openai-global";

/**
 * Returns the maximum height constraint for the widget, if provided by host.
 *
 * @returns Maximum height in pixels, or `null` when unavailable.
 */
export const useMaxHeight = (): number | null => {
  return useOpenAiGlobal("maxHeight");
};
