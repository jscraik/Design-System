/**
 * RTL (Right-to-Left) support utilities.
 *
 * Provides helpers for locales such as Arabic, Hebrew, and Persian.
 */

/**
 * List of ISO language codes that are commonly rendered RTL.
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

/**
 * Union type of supported RTL language codes.
 */
export type RTLLanguage = (typeof RTL_LANGUAGES)[number];

/**
 * Determines whether a locale is RTL.
 *
 * @param locale - Locale string (e.g., `en-US`, `ar`, `fa-IR`).
 * @returns `true` when the base language is RTL.
 *
 * @example
 * ```ts
 * isRTL("ar-EG"); // true
 * ```
 */
export function isRTL(locale: string): boolean {
  const lang = locale.split("-")[0].toLowerCase();
  return RTL_LANGUAGES.includes(lang as RTLLanguage);
}

/**
 * Returns the writing direction for a locale.
 *
 * @param locale - Locale string (e.g., `en-US`, `ar`).
 * @returns `"rtl"` when the locale is RTL, otherwise `"ltr"`.
 */
export function getDirection(locale: string): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr";
}

/**
 * Maps a physical CSS property to its logical equivalent.
 *
 * @param property - Physical property to convert.
 * @param direction - Document direction.
 * @returns Logical property name when available, otherwise the original input.
 *
 * @example
 * ```ts
 * getLogicalProperty("margin-left", "rtl"); // "margin-inline-end"
 * ```
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
 * Selects an LTR or RTL-specific value.
 *
 * @param ltrValue - Value to use for LTR.
 * @param rtlValue - Value to use for RTL.
 * @param isRtl - Whether RTL is active.
 * @returns The appropriate value for the current direction.
 */
export function flipForRTL<T>(ltrValue: T, rtlValue: T, isRtl: boolean): T {
  return isRtl ? rtlValue : ltrValue;
}

/**
 * Returns the text alignment for a direction.
 *
 * @param direction - Document direction.
 * @returns `"left"` for LTR or `"right"` for RTL.
 */
export function getTextAlign(direction: "ltr" | "rtl"): "left" | "right" {
  return direction === "rtl" ? "right" : "left";
}

/**
 * Returns logical start/end alignment values.
 *
 * @param direction - Document direction.
 * @returns Start/end alignment tokens for the direction.
 */
export function getStartEnd(direction: "ltr" | "rtl"): {
  start: "left" | "right";
  end: "left" | "right";
} {
  return direction === "rtl" ? { start: "right", end: "left" } : { start: "left", end: "right" };
}

/**
 * Tailwind class helpers for RTL support.
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
 * Returns a bundle of RTL utilities for a locale.
 *
 * @param locale - Locale string (e.g., `en-US`, `ar`).
 * @returns Helper values and functions derived from the locale direction.
 *
 * @example
 * ```ts
 * const { direction, textAlign } = getRTLUtils("fa-IR");
 * ```
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
