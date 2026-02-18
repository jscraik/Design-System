/**
 * Props for StickyReveal component
 */
export interface StickyRevealProps {
    /** Content to reveal on scroll */
    children: React.ReactNode;
    /** Reveal direction */
    direction?: "up" | "down" | "left" | "right";
    /** Fade intensity */
    fade?: "none" | "subtle" | "full";
    /** Scroll position (0-1) to trigger reveal */
    triggerAt?: number;
    /** Whether element should stick during scroll */
    sticky?: boolean;
    /** Additional CSS classes */
    className?: string;
}
/**
 * Scroll-driven reveal animation using View Timeline API.
 *
 * The element reveals itself when the user scrolls to a specific position.
 * Uses Intersection Observer as fallback for browsers without View Timeline.
 *
 * Accessibility:
 * - Respects prefers-reduced-motion
 * - No decorative-only content
 *
 * @example
 * ```tsx
 * <StickyReveal triggerAt={0.3} sticky>
 *   <h2>Revealed Content</h2>
 * </StickyReveal>
 * ```
 *
 * @param props - Component props
 * @returns Scroll-revealed element
 */
export declare function StickyReveal({ children, direction, fade, triggerAt, sticky, className, }: StickyRevealProps): import("react/jsx-runtime").JSX.Element;
export declare namespace StickyReveal {
    var displayName: string;
}
//# sourceMappingURL=sticky-reveal.d.ts.map