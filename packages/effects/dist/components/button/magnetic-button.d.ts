/**
 * Props for MagneticButton component
 */
export interface MagneticButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Visual variant */
    variant?: "default" | "outline" | "ghost" | "link";
    /** Size variant */
    size?: "sm" | "default" | "lg";
    /** Magnetic strength (0-1, higher = stronger pull) */
    magneticStrength?: number;
    /** Spring stiffness for return animation */
    stiffness?: number;
    /** Spring damping for return animation */
    damping?: number;
    /** Disable magnetic effect */
    disableMagnetic?: boolean;
    /** Disable the button */
    disabled?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Accessible name */
    ariaLabel?: string;
    /** Click handler */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
/**
 * Button with cursor-follow magnetic effect.
 *
 * Uses Framer Motion for smooth spring physics animation.
 * The button subtly follows the mouse cursor when nearby.
 *
 * Accessibility:
 * - Full keyboard navigation (Tab, Enter, Space)
 * - ARIA support (aria-label)
 * - Respects prefers-reduced-motion
 *
 * @example
 * ```tsx
 * <MagneticButton magneticStrength={0.3}>
 *   Hover me
 * </MagneticButton>
 * ```
 *
 * @param props - Component props
 * @returns Magnetic button element
 */
export declare function MagneticButton({ children, variant, size, magneticStrength, stiffness, damping, disableMagnetic, disabled, className, ariaLabel, onClick, }: MagneticButtonProps): import("react/jsx-runtime").JSX.Element;
export declare namespace MagneticButton {
    var displayName: string;
}
//# sourceMappingURL=magnetic-button.d.ts.map