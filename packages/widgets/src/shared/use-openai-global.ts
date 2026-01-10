import { useOpenAiGlobal as useOpenAiGlobalRuntime } from "@astudio/runtime";
import type { OpenAiGlobals } from "@astudio/runtime";

/**
 * Reads a value from the OpenAI global runtime context.
 *
 * @param key - The global key to read.
 * @returns The value for the key, or `null` when unavailable.
 *
 * @example
 * ```ts
 * const theme = useOpenAiGlobal("theme");
 * ```
 */
export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(key: K): OpenAiGlobals[K] | null {
  const value = useOpenAiGlobalRuntime(key);
  return value ?? null;
}
