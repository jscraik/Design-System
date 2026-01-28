/**
 * @astudio/tokens - Enhanced Motion
 *
 * Motion system inspired by Geist design system.
 * Provides consistent animation timing and duration across components.
 *
 * Easing Functions:
 * - swift: cubic-bezier(0.175, 0.885, 0.32, 1.1) - For overlays, popovers (slight overshoot)
 * - standard: cubic-bezier(0.4, 0, 0.2, 1) - For standard transitions (ease-in-out)
 * - easeOut: cubic-bezier(0, 0, 0.2, 1) - For exit animations (ease-out)
 *
 * Durations (ms):
 * - micro: 75 - Micro-interactions (hover, focus)
 * - fast: 150 - Fast transitions (dropdowns, toggles)
 * - standard: 200 - Standard transitions (modals, drawers)
 * - moderate: 250 - Moderate transitions (page transitions)
 * - slow: 350 - Slow transitions (complex animations)
 * - complex: 500 - Complex animations (multi-stage)
 * - long: 1000 - Long animations (hero, intro)
 * - extraLong: 1400 - Extra long animations (special cases)
 */

/**
 * Easing functions as CSS custom properties
 */
export const easingCSSVars = {
  "--ds-easing-swift": "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
  "--ds-easing-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
  "--ds-easing-ease-out": "cubic-bezier(0, 0, 0.2, 1)",
  "--ds-easing-ease-in": "cubic-bezier(0.4, 0, 1, 1)",
  "--ds-easing-linear": "linear",
} as const;

/**
 * Easing functions for JavaScript/TypeScript usage
 */
export const easing = {
  swift: "cubic-bezier(0.175, 0.885, 0.32, 1.1)", // Overlays, popovers
  standard: "cubic-bezier(0.4, 0, 0.2, 1)", // Standard transitions
  easeOut: "cubic-bezier(0, 0, 0.2, 1)", // Exit animations
  easeIn: "cubic-bezier(0.4, 0, 1, 1)", // Enter animations
  linear: "linear", // No easing
} as const;

/**
 * Easing function type
 */
export type EasingToken = keyof typeof easing;

/**
 * Duration tokens as CSS custom properties (in ms)
 */
export const durationCSSVars = {
  "--ds-duration-micro": "75ms",
  "--ds-duration-fast": "150ms",
  "--ds-duration-standard": "200ms",
  "--ds-duration-moderate": "250ms",
  "--ds-duration-slow": "350ms",
  "--ds-duration-complex": "500ms",
  "--ds-duration-long": "1000ms",
  "--ds-duration-extra-long": "1400ms",
} as const;

/**
 * Duration tokens for JavaScript/TypeScript usage (in ms)
 */
export const duration = {
  micro: 75, // Micro-interactions
  fast: 150, // Fast transitions
  standard: 200, // Standard transitions
  moderate: 250, // Moderate transitions
  slow: 350, // Slow transitions
  complex: 500, // Complex animations
  long: 1000, // Long animations
  extraLong: 1400, // Extra long animations
} as const;

/**
 * Duration type
 */
export type DurationToken = keyof typeof duration;

/**
 * Motion token patterns for common UI elements
 * Maps elements to their recommended easing + duration
 */
export const motionTokens = {
  // Overlays (modals, dropdowns, popovers)
  overlay: {
    enter: { easing: easing.swift, duration: duration.standard },
    exit: { easing: easing.easeOut, duration: duration.fast },
  },
  // Popovers
  popover: {
    enter: { easing: easing.swift, duration: duration.fast },
    exit: { easing: easing.easeOut, duration: duration.fast },
  },
  // Dropdowns
  dropdown: {
    enter: { easing: easing.standard, duration: duration.fast },
    exit: { easing: easing.easeOut, duration: duration.micro },
  },
  // Toggles (switches, checkboxes)
  toggle: {
    active: { easing: easing.standard, duration: duration.micro },
    inactive: { easing: easing.standard, duration: duration.micro },
  },
  // Tabs
  tab: {
    enter: { easing: easing.standard, duration: duration.fast },
    exit: { easing: easing.standard, duration: duration.fast },
  },
  // Tooltips
  tooltip: {
    enter: { easing: easing.swift, duration: duration.fast },
    exit: { easing: easing.easeOut, duration: duration.micro },
  },
  // Focus rings
  focus: {
    enter: { easing: easing.easeOut, duration: duration.micro },
    exit: { easing: easing.easeOut, duration: duration.micro },
  },
  // Page transitions
  page: {
    enter: { easing: easing.standard, duration: duration.moderate },
    exit: { easing: easing.easeOut, duration: duration.moderate },
  },
} as const;

/**
 * Helper to get easing value
 */
export function getEasing(token: EasingToken): string {
  return easing[token];
}

/**
 * Helper to get duration value
 */
export function getDuration(token: DurationToken): number {
  return duration[token];
}

/**
 * Helper to build CSS transition string
 */
export function transition(
  properties: string | string[],
  options?: {
    easing?: EasingToken;
    duration?: DurationToken;
    delay?: DurationToken;
  },
): string {
  const easingValue = options?.easing ? easing[options.easing] : easing.standard;
  const durationValue = options?.duration ? duration[options.duration] : duration.fast;
  const delayValue = options?.delay ? duration[options.delay] : 0;

  const props = Array.isArray(properties) ? properties.join(", ") : properties;

  return `${props} ${durationValue}ms ${easingValue} ${delayValue}ms`;
}

/**
 * Helper to get motion token for element
 */
export function getMotion(
  element: keyof typeof motionTokens,
  phase: "enter" | "exit" | "active" | "inactive",
): { easing: string; duration: number } {
  const elementTokens = motionTokens[element] as Record<
    string,
    { easing: string; duration: number }
  >;
  const token = elementTokens[phase];

  if (!token) {
    // Default to standard motion if phase not found
    return {
      easing: easing.standard,
      duration: duration.fast,
    };
  }

  return {
    easing: token.easing,
    duration: token.duration,
  };
}

// ============================================================================
// MICRO-INTERACTIONS (from user's Radix UI analysis)
// ============================================================================

/**
 * Micro-interaction tokens for hover and press feedback
 *
 * These are subtle animations that provide immediate feedback for user interactions.
 * Based on user's design engineering analysis of Radix UI improvements.
 */
export const microInteractions = {
  /**
   * Hover micro-interaction
   * Subtle lift effect on hover
   */
  hover: {
    translateY: "-1px",
    scale: "1.01",
    duration: duration.micro,
    easing: easing.easeOut,
  },
  /**
   * Press/active micro-interaction
   * Subtle scale down on press
   */
  press: {
    scale: "0.98",
    duration: duration.micro,
    easing: easing.standard,
  },
} as const;

/**
 * Micro-interaction CSS variables
 */
export const microInteractionCSSVars = {
  "--ds-micro-hover-translate-y": microInteractions.hover.translateY,
  "--ds-micro-hover-scale": microInteractions.hover.scale,
  "--ds-micro-hover-duration": `${microInteractions.hover.duration}ms`,
  "--ds-micro-hover-easing": microInteractions.hover.easing,
  "--ds-micro-press-scale": microInteractions.press.scale,
  "--ds-micro-press-duration": `${microInteractions.press.duration}ms`,
  "--ds-micro-press-easing": microInteractions.press.easing,
} as const;

/**
 * Helper to build hover transition string
 */
export function hoverTransition(properties: string | string[] = "transform"): string {
  const props = Array.isArray(properties) ? properties.join(", ") : properties;
  return `${props} ${microInteractions.hover.duration}ms ${microInteractions.hover.easing}`;
}

/**
 * Helper to build press transition string
 */
export function pressTransition(properties: string | string[] = "transform"): string {
  const props = Array.isArray(properties) ? properties.join(", ") : properties;
  return `${props} ${microInteractions.press.duration}ms ${microInteractions.press.easing}`;
}
