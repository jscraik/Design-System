/**
 * RTL (Right-to-Left) Support Utilities
 *
 * Provides utilities for supporting RTL languages like Arabic, Hebrew, Persian, etc.
 */

/**
 * List of RTL language codes
 */
export const RTL_LANGUAGES = [
  "ar", // Arabic
  "arc", // Aramaic
  "dv", // Divehi
  "fa", // Persian
  "ha", // Hausa
  "he", // Hebrew
  "khw", // Khowar
  "ks", // Kashmiri
  "ku", // Kurdish
  "ps", // Pashto
  "ur", // Urdu
  "yi", // Yiddish
] as const;

export type RTLLanguage = (typeof RTL_LANGUAGES)[number];

/**
 * Check if a locale is RTL
 */
export function isRTL(locale: string): boolean {
  const lang = locale.split("-")[0].toLowerCase();
  return RTL_LANGUAGES.includes(lang as RTLLanguage);
}

/**
 * Get the direction for a locale
 */
export function getDirection(locale: string): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr";
}

/**
 * Get logical CSS property name based on direction
 * Converts physical properties to logical ones
 */
export function getLogicalProperty(
  property: "left" | "right" | "margin-left" | "margin-right" | "padding-left" | "padding-right",
  direction: "ltr" | "rtl",
): string {
  const logicalMap: Record<string, Record<"ltr" | "rtl", string>> = {
    left: { ltr: "inset-inline-start", rtl: "inset-inline-end" },
    right: { ltr: "inset-inline-end", rtl: "inset-inline-start" },
    "margin-left": { ltr: "margin-inline-start", rtl: "margin-inline-end" },
    "margin-right": { ltr: "margin-inline-end", rtl: "margin-inline-start" },
    "padding-left": { ltr: "padding-inline-start", rtl: "padding-inline-end" },
    "padding-right": { ltr: "padding-inline-end", rtl: "padding-inline-start" },
  };

  return logicalMap[property]?.[direction] || property;
}

/**
 * Flip a value for RTL
 * Useful for transforms, positions, etc.
 */
export function flipForRTL<T>(ltrValue: T, rtlValue: T, isRtl: boolean): T {
  return isRtl ? rtlValue : ltrValue;
}

/**
 * Get text alignment based on direction
 */
export function getTextAlign(direction: "ltr" | "rtl"): "left" | "right" {
  return direction === "rtl" ? "right" : "left";
}

/**
 * Get start/end alignment based on direction
 */
export function getStartEnd(direction: "ltr" | "rtl"): {
  start: "left" | "right";
  end: "left" | "right";
} {
  return direction === "rtl" ? { start: "right", end: "left" } : { start: "left", end: "right" };
}

/**
 * CSS class names for RTL support
 */
export const rtlClasses = {
  /** Flip horizontal for RTL */
  flipX: "rtl:-scale-x-100",
  /** Text alignment start */
  textStart: "text-start",
  /** Text alignment end */
  textEnd: "text-end",
  /** Margin start */
  ms: (value: string) => `ms-${value}`,
  /** Margin end */
  me: (value: string) => `me-${value}`,
  /** Padding start */
  ps: (value: string) => `ps-${value}`,
  /** Padding end */
  pe: (value: string) => `pe-${value}`,
  /** Start position */
  start: (value: string) => `start-${value}`,
  /** End position */
  end: (value: string) => `end-${value}`,
  /** Border start */
  borderStart: "border-s",
  /** Border end */
  borderEnd: "border-e",
  /** Rounded start */
  roundedStart: "rounded-s",
  /** Rounded end */
  roundedEnd: "rounded-e",
} as const;

/**
 * Hook-like function to get RTL utilities for a locale
 */
export function getRTLUtils(locale: string) {
  const rtl = isRTL(locale);
  const direction = getDirection(locale);

  return {
    isRTL: rtl,
    direction,
    flip: <T>(ltrValue: T, rtlValue: T) => flipForRTL(ltrValue, rtlValue, rtl),
    textAlign: getTextAlign(direction),
    ...getStartEnd(direction),
  };
}
