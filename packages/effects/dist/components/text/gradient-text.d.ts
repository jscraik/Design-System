/**
 * Preset gradient color combinations
 */
export declare const gradientPresets: {
    readonly sunset: readonly ["#ff6b6b", "#feca57", "#ff9ff3"];
    readonly ocean: readonly ["#00b4d8", "#0077b6", "#023e8a"];
    readonly forest: readonly ["#00f260", "#0575e6", "#00c6ff"];
    readonly aurora: readonly ["#a8ff78", "#78ffd6", "#00c6ff"];
    readonly fire: readonly ["#ff416c", "#ff4b2b", "#ff9068"];
    readonly cyber: readonly ["#00f260", "#0575e6", "#8e44ad"];
};
/**
 * Props for GradientText component
 */
export interface GradientTextProps {
    /** Text content */
    children: string;
    /** Gradient direction */
    direction?: "horizontal" | "vertical" | "diagonal" | "radial";
    /** Animation type */
    animate?: "none" | "flow" | "shimmer";
    /** Preset gradient colors */
    preset?: keyof typeof gradientPresets;
    /** Custom gradient colors (overrides preset) */
    colors?: string[];
    /** Additional CSS classes */
    className?: string;
}
/**
 * Smooth gradient text overlay with animation.
 *
 * Uses background-clip: text for smooth color transitions.
 * Background can be animated for flowing or shimmering effects.
 *
 * Accessibility:
 * - Respects prefers-reduced-motion
 * - Semantic text content
 *
 * @example
 * ```tsx
 * <GradientText preset="sunset" animate="flow">
 *   Beautiful Gradient Text
 * </GradientText>
 * ```
 *
 * @param props - Component props
 * @returns Gradient text element
 */
export declare function GradientText({ children, direction, animate, preset, colors, className, }: GradientTextProps): import("react/jsx-runtime").JSX.Element;
export declare namespace GradientText {
    var displayName: string;
}
//# sourceMappingURL=gradient-text.d.ts.map