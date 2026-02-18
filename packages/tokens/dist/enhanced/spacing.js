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
export const spacingCSSVars = {
    "--ds-spacing-xs": "0.25rem",
    "--ds-spacing-sm": "0.5rem",
    "--ds-spacing-md": "1rem",
    "--ds-spacing-lg": "1.5rem",
    "--ds-spacing-xl": "2rem",
    "--ds-spacing-2xl": "2.5rem",
    "--ds-spacing-3xl": "3rem",
    "--ds-spacing-4xl": "4rem",
    "--ds-spacing-5xl": "6rem",
};
/**
 * Spacing scale for JavaScript/TypeScript usage
 */
export const spacing = {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "2.5rem", // 40px
    "3xl": "3rem", // 48px
    "4xl": "4rem", // 64px
    "5xl": "6rem", // 96px
};
/**
 * Helper to get spacing value
 */
export function getSpacing(token) {
    return spacing[token];
}
/**
 * Numeric spacing values (in pixels)
 * Useful for calculations and animations
 */
export const spacingPixels = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 40,
    "3xl": 48,
    "4xl": 64,
    "5xl": 96,
};
