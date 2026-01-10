import { useOpenAiGlobal as useRuntimeOpenAiGlobal } from "@astudio/runtime";
import type { OpenAiGlobals } from "@astudio/runtime";

export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(
  key: K,
): Exclude<OpenAiGlobals[K], undefined> | null {
  const value = useRuntimeOpenAiGlobal(key);
  return value === undefined ? null : (value as Exclude<OpenAiGlobals[K], undefined>);
}
