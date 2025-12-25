/**
 * ChatGPT Design System - Design Tokens Reference
 * Use these tokens throughout the application for consistency
 */

export const DesignTokens = {
  // Typography Classes
  typography: {
    heading1: 'text-[36px] font-semibold leading-[40px] tracking-[-0.1px]',
    heading2: 'text-[24px] font-semibold leading-[28px] tracking-[-0.25px]',
    heading3: 'text-[18px] font-semibold leading-[26px] tracking-[-0.45px]',
    bodyLargeEmphasized: 'text-[16px] font-semibold leading-[24px] tracking-[-0.32px]',
    bodySmallEmphasized: 'text-[14px] font-semibold leading-[20px] tracking-[-0.3px]',
    labelVLargeEmphasized: 'text-[12px] font-semibold leading-[18px] tracking-[-0.32px]',
    bodyLarge: 'text-[16px] font-normal leading-[24px] tracking-[-0.32px]',
    bodySmall: 'text-[14px] font-normal leading-[20px] tracking-[-0.3px]',
    labelLarge: 'text-[12px] font-normal leading-[18px] tracking-[-0.32px]',
  },

  // Spacing Tokens (use with gap-, p-, m-, etc.)
  spacing: {
    '0': '0',
    '1': '2px',
    '2': '4px',
    '4': '8px',
    '6': '12px',
    '8': '16px',
    '12': '24px',
    '16': '32px',
    '20': '40px',
    '24': '48px',
    '32': '64px',
    '64': '128px',
  },

  // Color Tokens (from ChatGPT palette)
  colors: {
    // Backgrounds
    bgPrimary: 'bg-[var(--bg-primary)]',
    bgSecondary: 'bg-[var(--bg-secondary)]',
    bgTertiary: 'bg-[var(--bg-tertiary)]',
    
    // Text
    textPrimary: 'text-[var(--text-primary)]',
    textSecondary: 'text-[var(--text-secondary)]',
    textTertiary: 'text-[var(--text-tertiary)]',
    textQuaternary: 'text-[var(--text-quaternary)]',
    textError: 'text-[var(--text-error)]',
    
    // Borders
    borderLight: 'border-[var(--border-light)]',
    borderMedium: 'border-[var(--border-medium)]',
    borderHeavy: 'border-[var(--border-heavy)]',
    borderXlight: 'border-[var(--border-xlight)]',
    
    // Buttons
    btnPrimary: 'bg-[var(--btn-primary)]',
    btnPrimaryText: 'text-[var(--btn-primary-text)]',
    btnSecondary: 'bg-[var(--btn-secondary)]',
    btnSecondaryText: 'text-[var(--btn-secondary-text)]',
    
    // States
    hover: 'hover:bg-[var(--bg-hover)]',
    active: 'active:bg-[var(--bg-active)]',
    focus: 'focus:ring-[var(--focus-ring)]',
  },

  // Border Radius
  radius: {
    sm: 'rounded-[6px]',
    md: 'rounded-[8px]',
    lg: 'rounded-[12px]',
    xl: 'rounded-[16px]',
    full: 'rounded-full',
  },

  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
} as const;

/**
 * Quick Reference Guide:
 * 
 * TYPOGRAPHY:
 * - Use heading1/2/3 for page titles and section headers
 * - Use bodyLarge/bodySmall for main content
 * - Use labelVLargeEmphasized for UI labels and buttons
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
