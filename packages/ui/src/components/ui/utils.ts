import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves Tailwind conflicts.
 *
 * @param inputs - Class name values from `clsx`.
 * @returns A de-duplicated, conflict-resolved class string.
 *
 * @example
 * ```ts
 * cn("px-2", condition && "px-4");
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
