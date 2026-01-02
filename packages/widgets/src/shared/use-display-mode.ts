import { type DisplayMode } from "./types";
import { useOpenAiGlobal } from "./use-openai-global";

/**
 * Returns the current widget display mode from the host.
 *
 * @returns Display mode string or `null` when unavailable.
 */
export const useDisplayMode = (): DisplayMode | null => {
  const mode = useOpenAiGlobal("displayMode");
  return mode ?? null;
};
