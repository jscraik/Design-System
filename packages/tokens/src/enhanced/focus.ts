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
 * Focus styles for keyboard navigation.
 *
 * @warning The bare `:focus-visible` selector applies to **every** focusable
 * element on the page, including components that define their own focus styles
 * (dropdowns, checkboxes, custom sliders). Including this block in a global
 * stylesheet can produce double-ring conflicts with component-level focus styles.
 *
 * Preferred approaches (in order):
 * 1. Use the `focus-visible:ring-*` Tailwind utilities per-component.
 * 2. Scope to an opt-in class: `.ds-focusable:focus-visible { … }`.
 * 3. Only use this global block if your project has no per-component focus styles.
 */
export const focusVisibleCSS = `
  /* Focus ring styles — scope with .ds-focusable or apply per-component via Tailwind utilities */
  .ds-focusable:focus-visible,
  [data-ds-focusable]:focus-visible {
    box-shadow: var(--ds-focus-ring);
    border-radius: var(--ds-focus-radius);
    outline: none;
  }

  /* Inset focus ring (for inputs, etc.) */
  .ds-focusable.input-focus-ring:focus-visible,
  [data-ds-focusable].input-focus-ring:focus-visible {
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
    .ds-focusable:focus-visible,
    [data-ds-focusable]:focus-visible {
      transition: none;
    }
  }
`;
