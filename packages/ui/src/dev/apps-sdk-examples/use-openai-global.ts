import type { OpenAiGlobals } from "@design-studio/runtime";
import { useOpenAiGlobal as useRuntimeOpenAiGlobal } from "@design-studio/runtime";

export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(
  key: K,
): Exclude<OpenAiGlobals[K], undefined> | null {
  const value = useRuntimeOpenAiGlobal(key);
  return value === undefined ? null : (value as Exclude<OpenAiGlobals[K], undefined>);
}
