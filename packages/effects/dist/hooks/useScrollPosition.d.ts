/**
 * Scroll position state returned by useScrollPosition hook
 */
export interface ScrollPosition {
    scrollY: number;
    scrollX: number;
    scrollProgress: number;
    direction: "up" | "down" | null;
}
/**
 * Options for useScrollPosition hook
 */
export interface UseScrollPositionOptions {
    /** Throttle updates in milliseconds */
    throttle?: number;
    /** Element to track (defaults to window) */
    element?: HTMLElement | Window;
}
/**
 * Tracks scroll position and direction for scroll-driven animations.
 *
 * @example
 * ```tsx
 * const { scrollProgress, direction } = useScrollPosition();
 * ```
 *
 * @param options - Hook configuration options
 * @returns Scroll position data
 */
export declare function useScrollPosition(options?: UseScrollPositionOptions): ScrollPosition;
//# sourceMappingURL=useScrollPosition.d.ts.map