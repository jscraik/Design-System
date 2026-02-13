/**
 * Theme utilities for consistent styling.
 */

/**
 * CSS variable tokens for color usage in UI components.
 */
export const colors = {
  // Foundation colors
  bg: {
    dark1: "var(--foundation-bg-dark-1)",
    dark2: "var(--foundation-bg-dark-2)",
    light1: "var(--foundation-bg-light-1)",
    light2: "var(--foundation-bg-light-2)",
  },
  text: {
    darkPrimary: "var(--foundation-text-dark-primary)",
    darkSecondary: "var(--foundation-text-dark-secondary)",
    darkTertiary: "var(--foundation-text-dark-tertiary)",
    lightPrimary: "var(--foundation-text-light-primary)",
    lightSecondary: "var(--foundation-text-light-secondary)",
  },
  accent: {
    blue: "var(--foundation-accent-blue)",
    green: "var(--foundation-accent-green)",
    orange: "var(--foundation-accent-orange)",
    red: "var(--foundation-accent-red)",
    purple: "var(--foundation-accent-purple, var(--foundation-accent-blue))",
  },
} as const;

/**
 * Rem-based spacing scale for layout and component padding.
 */
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
} as const;

/**
 * Border-radius scale for UI components.
 */
export const borderRadius = {
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

/**
 * Reads a CSS custom property from `:root`.
 *
 * @param property - CSS variable name (e.g., `--foundation-bg-dark-1`).
 * @returns The trimmed CSS value, or an empty string during SSR.
 */
export function getCSSVar(property: string): string {
  if (typeof window !== "undefined") {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  }
  return "";
}

/**
 * Sets a CSS custom property on `:root`.
 *
 * @param property - CSS variable name (e.g., `--foundation-bg-dark-1`).
 * @param value - CSS value to assign.
 */
export function setCSSVar(property: string, value: string): void {
  if (typeof window !== "undefined") {
    document.documentElement.style.setProperty(property, value);
  }
}

/**
 * Creates a variants object that includes a `base` class string.
 *
 * @param base - Base class string applied to all variants.
 * @param variants - Variant map to merge with `base`.
 * @returns The merged variants object including `base`.
 *
 * @example
 * ```ts
 * const button = createVariants("inline-flex", { primary: "bg-accent-blue" });
 * ```
 */
export function createVariants<T extends Record<string, unknown>>(
  base: string,
  variants: T,
): T & { base: string } {
  return { base, ...variants };
}

/**
 * Generates a `color-mix` string with opacity.
 *
 * @param color - CSS color value or variable.
 * @param opacity - Opacity from `0` to `1`.
 * @returns A `color-mix` string in SRGB space.
 */
export function withOpacity(color: string, opacity: number): string {
  return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
}
