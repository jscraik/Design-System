/**
 * Mouse position state returned by useMousePosition hook
 */
export interface MousePosition {
    x: number;
    y: number;
    elementX: number;
    elementY: number;
}
/**
 * Options for useMousePosition hook
 */
export interface UseMousePositionOptions {
    /** Whether to track mouse position relative to element */
    relative?: boolean;
    /** Throttle updates in milliseconds */
    throttle?: number;
}
/**
 * Tracks mouse position for magnetic and hover effects.
 *
 * @example
 * ```tsx
 * const { x, y, elementX, elementY } = useMousePosition({ relative: true });
 * ```
 *
 * @param options - Hook configuration options
 * @returns Mouse position coordinates
 */
export declare function useMousePosition(options?: UseMousePositionOptions): {
    elementRef: import('react').RefObject<HTMLElement | null>;
    x: number;
    y: number;
    elementX: number;
    elementY: number;
};
/**
 * Extended return type with element ref
 */
export interface UseMousePositionReturn extends MousePosition {
    elementRef: React.RefObject<HTMLElement>;
}
//# sourceMappingURL=useMousePosition.d.ts.map