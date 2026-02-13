/**
 * Props for GlowText component
 */
export interface GlowTextProps {
    /** Text content */
    children: string;
    /** Glow color (any CSS color) */
    color?: string;
    /** Glow intensity */
    intensity?: "subtle" | "medium" | "intense";
    /** Animation type */
    animate?: "none" | "pulse" | "breathe";
    /** Additional CSS classes */
    className?: string;
}
/**
 * Multi-layer text glow effect with animation.
 *
 * Creates a glowing effect by stacking multiple text-shadow layers.
 * The glow can be animated for a pulsing or breathing effect.
 *
 * Accessibility:
 * - Respects prefers-reduced-motion
 * - Semantic text content (not decorative SVG)
 *
 * @example
 * ```tsx
 * <GlowText color="#00f260" intensity="intense" animate="pulse">
 *   Glowing Text
 * </GlowText>
 * ```
 *
 * @param props - Component props
 * @returns Glowing text element
 */
export declare function GlowText({ children, color, intensity, animate, className, }: GlowTextProps): import("react/jsx-runtime").JSX.Element;
export declare namespace GlowText {
    var displayName: string;
}
//# sourceMappingURL=glow-text.d.ts.map