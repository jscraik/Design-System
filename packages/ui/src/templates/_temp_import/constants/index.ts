// Re-export design tokens from the main design-tokens.ts file
export { colors as colorTokens, space, typography as typographyTokens } from "../design-tokens";

// Convert space tokens to pixel strings for easier use
import { space } from "../design-tokens";

export const spacingScale = {
  "0": `${space.s0}px`,
  "2": `${space.s2}px`,
  "4": `${space.s4}px`,
  "8": `${space.s8}px`,
  "12": `${space.s12}px`,
  "16": `${space.s16}px`,
  "24": `${space.s24}px`,
  "32": `${space.s32}px`,
  "40": `${space.s40}px`,
  "48": `${space.s48}px`,
  "64": `${space.s64}px`,
  "128": `${space.s128}px`,
};

// Create semantic spacing for convenience
export const semanticSpacing = {
  "container-padding": {
    sm: "16px",
    md: "24px",
    lg: "32px",
  },
  "component-gap": {
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
  "section-spacing": {
    sm: "32px",
    md: "48px",
    lg: "64px",
  },
  "border-radius": {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
};

// Create semantic typography for convenience
export const semanticTypography = {
  heading: {
    large: "text-heading-1",
    medium: "text-heading-2",
    small: "text-heading-3",
  },
  body: {
    default: "text-body",
    emphasis: "text-body-emphasis",
    small: "text-body-small",
  },
};

export const typographyClasses = {
  heading1: "text-heading-1",
  heading2: "text-heading-2",
  heading3: "text-heading-3",
  body: "text-body",
  bodyEmphasis: "text-body-emphasis",
  bodySmall: "text-body-small",
  caption: "text-caption",
};

// Type exports
export type SpacingToken = keyof typeof spacingScale;
export type SemanticSpacingToken = keyof typeof semanticSpacing;
export type FontFamily = string;
export type FontSize = number;
export type FontWeight = number;
export type LineHeight = number;
export type LetterSpacing = number;
