/**
 * ChatGPT Design System - Design Tokens Reference
 * Use these tokens throughout the application for consistency
 */

export const DesignTokens = {
  // Typography Classes (prefer tokenized utilities)
  typography: {
    hero: "text-hero font-semibold",
    h1: "text-h1 font-semibold",
    h2: "text-h2 font-semibold",
    h3: "text-h3 font-semibold",
    h4: "text-h4 font-semibold",
    h5: "text-h5 font-semibold",
    h6: "text-h6 font-semibold",
    paragraphLg: "text-paragraph-lg font-normal",
    paragraphMd: "text-paragraph-md font-normal",
    paragraphSm: "text-paragraph-sm font-normal",
    caption: "text-caption font-normal",
    // Legacy (avoid for new work)
    heading1: "text-heading-1 font-semibold",
    heading2: "text-heading-2 font-semibold",
    heading3: "text-heading-3 font-semibold",
    body: "text-body font-normal",
    bodySmall: "text-body-small font-normal",
  },

  // Spacing Tokens (use with gap-, p-, m-, etc.)
  spacing: {
    "0": "0",
    "1": "2px",
    "2": "4px",
    "4": "8px",
    "6": "12px",
    "8": "16px",
    "12": "24px",
    "16": "32px",
    "20": "40px",
    "24": "48px",
    "32": "64px",
    "64": "128px",
  },

  // Color Tokens (from ChatGPT palette)
  colors: {
    // Backgrounds
    bgPrimary: "bg-[var(--bg-primary)]",
    bgSecondary: "bg-[var(--bg-secondary)]",
    bgTertiary: "bg-[var(--bg-tertiary)]",

    // Text
    textPrimary: "text-[var(--text-primary)]",
    textSecondary: "text-[var(--text-secondary)]",
    textTertiary: "text-[var(--text-tertiary)]",
    textQuaternary: "text-[var(--text-quaternary)]",
    textError: "text-[var(--text-error)]",

    // Borders
    borderLight: "border-[var(--border-light)]",
    borderMedium: "border-[var(--border-medium)]",
    borderHeavy: "border-[var(--border-heavy)]",
    borderXlight: "border-[var(--border-xlight)]",

    // Buttons
    btnPrimary: "bg-[var(--btn-primary)]",
    btnPrimaryText: "text-[var(--btn-primary-text)]",
    btnSecondary: "bg-[var(--btn-secondary)]",
    btnSecondaryText: "text-[var(--btn-secondary-text)]",

    // States
    hover: "hover:bg-[var(--bg-hover)]",
    active: "active:bg-[var(--bg-active)]",
    focus: "focus:ring-[var(--focus-ring)]",
  },

  // Border Radius
  radius: {
    sm: "rounded-[6px]",
    md: "rounded-[8px]",
    lg: "rounded-[12px]",
    xl: "rounded-[16px]",
    full: "rounded-full",
  },

  // Shadows
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },
} as const;

/**
 * Quick Reference Guide:
 *
 * TYPOGRAPHY:
 * - Use hero + h1–h6 for headings
 * - Use paragraphLg/paragraphMd/paragraphSm for body content
 * - Legacy heading/body tokens remain for backwards compatibility
 *
 * SPACING:
 * - Use space-64 (128px) for major page sections
 * - Use space-16 (32px) for component spacing
 * - Use space-8 (16px) for element spacing
 * - Use space-4 (8px) for tight spacing
 *
 * COLORS:
 * - Use CSS variables via the color tokens
 * - Dark mode is built-in via the 'dark' class
 *
 * ICONS:
 * - Import from ChatGPTIcons.tsx
 * - All icons support className prop for sizing
 * - Use currentColor for automatic theme integration
 */
