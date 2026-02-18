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
export declare const focusCSSVars: {
    readonly "--ds-focus-ring": "0 0 0 1px var(--ds-color-border), 0px 0px 0px 4px var(--ds-color-focus)";
    readonly "--ds-focus-ring-inset": "0 0 0 1px var(--ds-color-border), inset 0 0 0 2px var(--ds-color-focus)";
    readonly "--ds-focus-radius": "2px";
    readonly "--ds-focus-width": "2px";
    readonly "--ds-focus-offset": "4px";
};
/**
 * Focus ring configuration
 */
export declare const focus: {
    readonly ring: {
        readonly offset: 4;
        readonly width: 2;
        readonly radius: 2;
    };
};
/**
 * Focus ring colors
 * These should be mapped to the color system
 */
export declare const focusColors: {
    readonly ring: "blue.7";
    readonly ringInset: "blue.5";
    readonly border: "gray.6";
};
/**
 * Focus ring styles for different use cases
 */
export declare const focusStyles: {
    readonly default: {
        readonly boxShadow: "var(--ds-focus-ring)";
        readonly borderRadius: "var(--ds-focus-radius)";
    };
    readonly inset: {
        readonly boxShadow: "var(--ds-focus-ring-inset)";
        readonly borderRadius: "var(--ds-focus-radius)";
    };
    readonly none: {
        readonly outline: "none";
    };
};
/**
 * Helper to build focus ring CSS string
 */
export declare function focusRing(options?: {
    inset?: boolean;
    color?: string;
    radius?: number;
}): string;
/**
 * Focus styles for keyboard navigation
 * Use with :focus-visible to show only for keyboard users
 */
export declare const focusVisibleCSS = "\n  /* Focus ring styles */\n  :focus-visible {\n    box-shadow: var(--ds-focus-ring);\n    border-radius: var(--ds-focus-radius);\n    outline: none;\n  }\n\n  /* Inset focus ring (for inputs, etc.) */\n  :focus-visible.input-focus-ring {\n    box-shadow: var(--ds-focus-ring-inset);\n    border-radius: var(--ds-focus-radius);\n    outline: none;\n  }\n\n  /* No outline when focusing with mouse */\n  :focus:not(:focus-visible) {\n    outline: none;\n  }\n\n  /* Respect reduced motion preference */\n  @media (prefers-reduced-motion: reduce) {\n    :focus-visible {\n      transition: none;\n    }\n  }\n";
//# sourceMappingURL=focus.d.ts.map