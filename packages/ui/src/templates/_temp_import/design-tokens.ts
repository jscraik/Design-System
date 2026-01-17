/**
 * ChatUI Design Tokens
 * Official design system from Apps SDK UI foundations
 * Version: 1.0.0
 * Source: index.dtcg.json
 */

// ==========================================
// COLOR TOKENS
// ==========================================

export const colors = {
  background: {
    light: {
      primary: "#FFFFFF",
      secondary: "#E8E8E8",
      tertiary: "#F3F3F3",
    },
    dark: {
      primary: "#212121",
      secondary: "#303030",
      tertiary: "#414141",
    },
  },
  text: {
    light: {
      primary: "#0D0D0D",
      secondary: "#5D5D5D",
      tertiary: "#8F8F8F",
      inverted: "#FFFFFF",
    },
    dark: {
      primary: "#FFFFFF",
      secondary: "#CDCDCD",
      tertiary: "#AFAFAF",
      inverted: "#0D0D0D",
    },
  },
  icon: {
    light: {
      primary: "#0D0D0D",
      secondary: "#5D5D5D",
      tertiary: "#8F8F8F",
      inverted: "#FFFFFF",
      accent: "#0285FF",
      statusError: "#E02E2A",
      statusWarning: "#E25507",
      statusSuccess: "#008635",
    },
    dark: {
      primary: "#FFFFFF",
      secondary: "#CDCDCD",
      tertiary: "#AFAFAF",
      inverted: "#0D0D0D",
      accent: "#48AAFF",
      statusError: "#FF8583",
      statusWarning: "#FF9E6C",
      statusSuccess: "#40C977",
    },
  },
  border: {
    light: {
      light: "#0D0D0D0D",
      heavy: "#0D0D0D26",
    },
    dark: {
      default: "#FFFFFF26",
      light: "#FFFFFF0D",
    },
  },
  accent: {
    light: {
      gray: "#8F8F8F",
      red: "#E02E2A",
      orange: "#E25507",
      yellow: "#C08C00",
      green: "#008635",
      blue: "#0285FF",
      purple: "#934FF2",
      pink: "#E3008D",
      foreground: "#FFFFFF",
    },
    dark: {
      gray: "#ABABAB",
      red: "#FF8583",
      orange: "#FF9E6C",
      yellow: "#FFD666",
      green: "#40C977",
      blue: "#5A9FF5",
      purple: "#BA8FF7",
      pink: "#FF6BC7",
      foreground: "#FFFFFF",
    },
  },
  interactive: {
    light: {
      ring: "#0285FF",
    },
    dark: {
      ring: "#0285FF",
    },
  },
} as const;

// ==========================================
// SPACING TOKENS
// ==========================================

export const space = {
  s128: 128,
  s64: 64,
  s48: 48,
  s40: 40,
  s32: 32,
  s24: 24,
  s16: 16,
  s12: 12,
  s8: 8,
  s4: 4,
  s2: 2,
  s0: 0,
} as const;

// ==========================================
// TYPOGRAPHY TOKENS
// ==========================================

export const typography = {
  fontFamily: "SF Pro",
  web: {
    heading1: {
      size: 36,
      lineHeight: 40,
      weight: 600,
      tracking: -0.1,
    },
    heading2: {
      size: 24,
      lineHeight: 28,
      weight: 600,
      tracking: -0.25,
    },
    heading3: {
      size: 18,
      lineHeight: 26,
      weight: 600,
      tracking: -0.45,
    },
    body: {
      size: 16,
      lineHeight: 26,
      weight: 400,
      emphasisWeight: 600,
      tracking: -0.4,
    },
    bodySmall: {
      size: 14,
      lineHeight: 18,
      weight: 400,
      emphasisWeight: 600,
      tracking: -0.3,
    },
    caption: {
      size: 12,
      lineHeight: 16,
      weight: 400,
      emphasisWeight: 600,
      tracking: -0.1,
    },
  },
  ios: {
    heading1: {
      size: 32,
      lineHeight: 40,
      weight: 600,
      tracking: -0.1,
    },
    heading2: {
      size: 24,
      lineHeight: 28,
      weight: 600,
      tracking: -0.25,
    },
    heading3: {
      size: 16,
      lineHeight: 26,
      weight: 600,
      tracking: 0,
    },
    body: {
      size: 16,
      lineHeight: 26,
      weight: 400,
      emphasisWeight: 600,
      tracking: 0,
    },
    bodySmall: {
      size: 14,
      lineHeight: 18,
      weight: 400,
      emphasisWeight: 600,
      tracking: 0,
    },
    caption: {
      size: 12,
      lineHeight: 16,
      weight: 400,
      emphasisWeight: 600,
      tracking: 0,
    },
  },
  android: {
    heading1: {
      size: 32,
      lineHeight: 40,
      weight: 600,
      tracking: -0.1,
    },
    heading2: {
      size: 24,
      lineHeight: 28,
      weight: 600,
      tracking: -0.25,
    },
    heading3: {
      size: 16,
      lineHeight: 26,
      weight: 600,
      tracking: 0,
    },
    body: {
      size: 16,
      lineHeight: 26,
      weight: 400,
      emphasisWeight: 600,
      tracking: 0,
    },
    bodySmall: {
      size: 14,
      lineHeight: 18,
      weight: 400,
      emphasisWeight: 600,
      tracking: 0,
    },
    caption: {
      size: 12,
      lineHeight: 16,
      weight: 400,
      emphasisWeight: 600,
      tracking: 0,
    },
  },
} as const;

// ==========================================
// TYPES
// ==========================================

export type ColorMode = "light" | "dark";
export type ColorCategory = keyof typeof colors;
export type SpaceKey = keyof typeof space;
export type TypographyPlatform = keyof typeof typography;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Get a color value for the current mode
 */
export function getColor(
  category: "background" | "text" | "icon",
  mode: ColorMode,
  variant: "primary" | "secondary" | "tertiary" | "inverted",
): string {
  if (variant === "inverted") {
    if (category === "text") {
      return colors.text[mode].inverted;
    }
    return colors[category][mode].primary;
  }
  return colors[category][mode][variant];
}

/**
 * Get an accent color for the current mode
 */
export function getAccentColor(
  mode: ColorMode,
  color: "blue" | "red" | "orange" | "green" | "purple" | "foreground",
): string {
  return colors.accent[mode][color];
}

/**
 * Get a spacing value
 */
export function getSpace(key: SpaceKey): number {
  return space[key];
}

/**
 * Get typography settings for a platform and text style
 */
export function getTypography(
  platform: "web" | "ios" | "android",
  style: "heading1" | "heading2" | "heading3" | "body" | "bodySmall" | "caption",
) {
  return typography[platform][style];
}

/**
 * Generate Tailwind color class for icons
 */
export function getIconColorClass(
  mode: ColorMode,
  variant: "primary" | "secondary" | "tertiary" = "primary",
): string {
  const colorMap = {
    light: {
      primary: "text-[#0D0D0D]",
      secondary: "text-[#5D5D5D]",
      tertiary: "text-[#8F8F8F]",
    },
    dark: {
      primary: "text-[#FFFFFF]",
      secondary: "text-[#CDCDCD]",
      tertiary: "text-[#AFAFAF]",
    },
  };
  return colorMap[mode][variant];
}

/**
 * Generate Tailwind background class
 */
export function getBackgroundClass(
  mode: ColorMode,
  variant: "primary" | "secondary" | "tertiary" = "primary",
): string {
  const colorMap = {
    light: {
      primary: "bg-[#FFFFFF]",
      secondary: "bg-[#E8E8E8]",
      tertiary: "bg-[#F3F3F3]",
    },
    dark: {
      primary: "bg-[#212121]",
      secondary: "bg-[#303030]",
      tertiary: "bg-[#414141]",
    },
  };
  return colorMap[mode][variant];
}

/**
 * Generate Tailwind text class
 */
export function getTextColorClass(
  mode: ColorMode,
  variant: "primary" | "secondary" | "tertiary" = "primary",
): string {
  const colorMap = {
    light: {
      primary: "text-[#0D0D0D]",
      secondary: "text-[#5D5D5D]",
      tertiary: "text-[#8F8F8F]",
    },
    dark: {
      primary: "text-[#FFFFFF]",
      secondary: "text-[#CDCDCD]",
      tertiary: "text-[#AFAFAF]",
    },
  };
  return colorMap[mode][variant];
}

/**
 * Generate Tailwind accent class
 */
export function getAccentClass(
  mode: ColorMode,
  color: "blue" | "red" | "orange" | "green" | "purple",
): string {
  const colorMap = {
    light: {
      blue: "text-[#0285FF]",
      red: "text-[#E02E2A]",
      orange: "text-[#E25507]",
      green: "text-[#008635]",
      purple: "text-[#9966CC]",
    },
    dark: {
      blue: "text-[#0285FF]",
      red: "text-[#FF8583]",
      orange: "text-[#FF9E6C]",
      green: "text-[#40C977]",
      purple: "text-[#B280E6]",
    },
  };
  return colorMap[mode][color];
}

/**
 * Generate Tailwind spacing class
 */
export function getSpaceClass(key: SpaceKey): string {
  return `[${space[key]}px]`;
}

// ==========================================
// DEFAULT EXPORT
// ==========================================

export const designTokens = {
  colors,
  space,
  typography,
  getColor,
  getAccentColor,
  getSpace,
  getTypography,
  getIconColorClass,
  getBackgroundClass,
  getTextColorClass,
  getAccentClass,
  getSpaceClass,
} as const;

export default designTokens;
