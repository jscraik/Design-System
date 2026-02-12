/**
 * @design-studio/tokens - Enhanced Spacing
 *
 * 10-step spacing scale inspired by Geist design system.
 * Provides fine-grained control over spacing values.
 *
 * Scale: 0.25rem base (4px)
 * - xs: 0.25rem (4px) - micro spacing
 * - sm: 0.5rem (8px) - small spacing
 * - md: 1rem (16px) - medium spacing (base)
 * - lg: 1.5rem (24px) - large spacing
 * - xl: 2rem (32px) - extra large spacing
 * - 2xl: 2.5rem (40px) - 2x extra large
 * - 3xl: 3rem (48px) - 3x extra large (section spacing)
 * - 4xl: 4rem (64px) - 4x extra large
 * - 5xl: 6rem (96px) - 5x extra large (hero spacing)
 */
/**
 * Spacing scale as CSS custom properties
 * Generated for CSS usage
 */
export declare const spacingCSSVars: {
    readonly "--ds-spacing-xs": "0.25rem";
    readonly "--ds-spacing-sm": "0.5rem";
    readonly "--ds-spacing-md": "1rem";
    readonly "--ds-spacing-lg": "1.5rem";
    readonly "--ds-spacing-xl": "2rem";
    readonly "--ds-spacing-2xl": "2.5rem";
    readonly "--ds-spacing-3xl": "3rem";
    readonly "--ds-spacing-4xl": "4rem";
    readonly "--ds-spacing-5xl": "6rem";
};
/**
 * Spacing scale for JavaScript/TypeScript usage
 */
export declare const spacing: {
    readonly xs: "0.25rem";
    readonly sm: "0.5rem";
    readonly md: "1rem";
    readonly lg: "1.5rem";
    readonly xl: "2rem";
    readonly "2xl": "2.5rem";
    readonly "3xl": "3rem";
    readonly "4xl": "4rem";
    readonly "5xl": "6rem";
};
/**
 * Spacing scale type
 */
export type SpacingToken = keyof typeof spacing;
/**
 * Helper to get spacing value
 */
export declare function getSpacing(token: SpacingToken): string;
/**
 * Numeric spacing values (in pixels)
 * Useful for calculations and animations
 */
export declare const spacingPixels: {
    readonly xs: 4;
    readonly sm: 8;
    readonly md: 16;
    readonly lg: 24;
    readonly xl: 32;
    readonly "2xl": 40;
    readonly "3xl": 48;
    readonly "4xl": 64;
    readonly "5xl": 96;
};
//# sourceMappingURL=spacing.d.ts.map