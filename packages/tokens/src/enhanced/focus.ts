/**
 * @design-studio/tokens - Enhanced Focus
 *
 * Focus ring system inspired by Geist design system.
 * Provides consistent, accessible focus indicators across components.
 *
 * Focus Ring Pattern:
 * - Layered shadow effect (2px border + 4px offset ring)
 * - 2px border-radius for smooth appearance
 * - Works with :focus-visible (keyboard only)
 * - Respects prefers-reduced-motion
 *
 * Usage in CSS:
 *   .my-element:focus-visible {
 *     box-shadow: var(--ds-focus-ring);
 *     border-radius: var(--ds-focus-radius);
 *   }
 */

/**
 * Focus ring tokens as CSS custom properties
 */
export const focusCSSVars = {
  "--ds-focus-ring": "0 0 0 1px var(--ds-color-border), 0px 0px 0px 4px var(--ds-color-focus)",
  "--ds-focus-ring-inset":
    "0 0 0 1px var(--ds-color-border), inset 0 0 0 2px var(--ds-color-focus)",
  "--ds-focus-radius": "2px",
  "--ds-focus-width": "2px",
  "--ds-focus-offset": "4px",
} as const;

/**
 * Focus ring configuration
 */
export const focus = {
  ring: {
    offset: 4, // px
    width: 2, // px
    radius: 2, // px
  },
} as const;

/**
 * Focus ring colors
 * These should be mapped to the color system
 */
export const focusColors = {
  ring: "blue.7", // Primary focus ring color
  ringInset: "blue.5", // Inset focus ring color
  border: "gray.6", // Border color
} as const;

/**
 * Focus ring styles for different use cases
 */
export const focusStyles = {
  default: {
    boxShadow: "var(--ds-focus-ring)",
    borderRadius: "var(--ds-focus-radius)",
  },
  inset: {
    boxShadow: "var(--ds-focus-ring-inset)",
    borderRadius: "var(--ds-focus-radius)",
  },
  none: {
    outline: "none",
  },
} as const;

/**
 * Helper to build focus ring CSS string
 */
export function focusRing(options?: { inset?: boolean; color?: string; radius?: number }): string {
  const inset = options?.inset ? "inset " : "";
  const color = options?.color || "var(--ds-color-focus)";
  const offset = focus.ring.offset;
  const width = focus.ring.width;

  return `${inset}0 0 0 ${width}px var(--ds-color-border), ${inset}0 0 0 ${offset}px ${color}`;
}

/**
 * Focus styles for keyboard navigation
 * Use with :focus-visible to show only for keyboard users
 */
export const focusVisibleCSS = `
  /* Focus ring styles */
  :focus-visible {
    box-shadow: var(--ds-focus-ring);
    border-radius: var(--ds-focus-radius);
    outline: none;
  }

  /* Inset focus ring (for inputs, etc.) */
  :focus-visible.input-focus-ring {
    box-shadow: var(--ds-focus-ring-inset);
    border-radius: var(--ds-focus-radius);
    outline: none;
  }

  /* No outline when focusing with mouse */
  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    :focus-visible {
      transition: none;
    }
  }
`;
