/**
 * Animation utilities for effects components
 */

/**
 * Standard easing functions for animations
 */
export const easings = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Custom spring-like easing
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  // Magnetic effect easing
  magnetic: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
} as const;

/**
 * Standard duration presets (in milliseconds)
 */
export const durations = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

/**
 * Animation duration based on reduced motion preference
 *
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @param duration - Normal duration
 * @returns Adjusted duration
 */
export function getReducedMotionDuration(prefersReducedMotion: boolean, duration: number): number {
  return prefersReducedMotion ? 0 : duration;
}

/**
 * CSS transition string builder
 *
 * @param properties - CSS properties to animate
 * @param duration - Duration in ms
 * @param easing - Easing function
 * @returns CSS transition string
 */
export function buildTransition(
  properties: string[],
  duration: number,
  easing: keyof typeof easings = "easeOut",
): string {
  return properties.map((prop) => `${prop} ${duration}ms ${easings[easing]}`).join(", ");
}

/**
 * Timeline configuration for scroll-driven animations
 */
export interface TimelineConfig {
  /** Start position (0-1) */
  start: number;
  /** End position (0-1) */
  end: number;
  /** Start value */
  from: number | string;
  /** End value */
  to: number | string;
}

/**
 * Generates CSS for scroll timeline animation
 *
 * @param name - Animation name
 * @param timeline - Timeline configuration
 * @returns CSS animation string with view-timeline
 */
export function buildScrollAnimation(name: string, timeline: TimelineConfig): string {
  return `
    animation: ${name} linear both;
    animation-timeline: view();
    animation-range: ${timeline.start * 100}% ${timeline.end * 100}%;
  `;
}
