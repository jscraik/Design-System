/**
 * Animation utilities for effects components
 */
/**
 * Standard easing functions for animations
 */
export declare const easings: {
    readonly linear: "linear";
    readonly easeIn: "cubic-bezier(0.4, 0, 1, 1)";
    readonly easeOut: "cubic-bezier(0, 0, 0.2, 1)";
    readonly easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly spring: "cubic-bezier(0.34, 1.56, 0.64, 1)";
    readonly magnetic: "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
};
/**
 * Standard duration presets (in milliseconds)
 */
export declare const durations: {
    readonly instant: 100;
    readonly fast: 150;
    readonly normal: 250;
    readonly slow: 350;
    readonly slower: 500;
};
/**
 * Animation duration based on reduced motion preference
 *
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @param duration - Normal duration
 * @returns Adjusted duration
 */
export declare function getReducedMotionDuration(prefersReducedMotion: boolean, duration: number): number;
/**
 * CSS transition string builder
 *
 * @param properties - CSS properties to animate
 * @param duration - Duration in ms
 * @param easing - Easing function
 * @returns CSS transition string
 */
export declare function buildTransition(properties: string[], duration: number, easing?: keyof typeof easings): string;
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
export declare function buildScrollAnimation(name: string, timeline: TimelineConfig): string;
//# sourceMappingURL=animation.d.ts.map