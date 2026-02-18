/**
 * Props for LiquidToggle component
 */
export interface LiquidToggleProps {
    /** Whether the toggle is pressed/active */
    pressed?: boolean;
    /** Callback when pressed state changes */
    onPressedChange?: (pressed: boolean) => void;
    /** Visual variant */
    variant?: "default" | "outline" | "ghost";
    /** Size variant */
    size?: "sm" | "default" | "lg";
    /** Liquid effect intensity */
    liquid?: "none" | "subtle" | "full";
    /** Disable the toggle */
    disabled?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Child content */
    children: React.ReactNode;
    /** Accessible name */
    ariaLabel?: string;
}
/**
 * Morphing toggle with liquid effect.
 *
 * Built on Radix UI Toggle primitive for accessibility.
 * Uses CSS morphing and SVG filters for the liquid animation.
 *
 * Accessibility:
 * - Full keyboard navigation (Tab, Enter, Space)
 * - ARIA attributes (aria-pressed, aria-label)
 * - Respects prefers-reduced-motion
 *
 * @example
 * ```tsx
 * <LiquidToggle
 *   pressed={isOn}
 *   onPressedChange={setIsOn}
 *   ariaLabel="Enable feature"
 * >
 *   Toggle Me
 * </LiquidToggle>
 * ```
 *
 * @param props - Component props
 * @returns Liquid toggle element
 */
export declare function LiquidToggle({ pressed, onPressedChange, variant, size, liquid, disabled, className, children, ariaLabel, }: LiquidToggleProps): import("react/jsx-runtime").JSX.Element;
export declare namespace LiquidToggle {
    var displayName: string;
}
//# sourceMappingURL=liquid-toggle.d.ts.map