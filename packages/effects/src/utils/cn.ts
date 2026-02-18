/**
 * Class name utility (simplified from full clsx+tailwind-merge)
 */

import { clsx } from "clsx";

/**
 * Combines class names using clsx
 *
 * @param inputs - Class names to combine
 * @returns Combined class string
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return clsx(...inputs);
}
