/**
 * Holographic color presets
 */
export declare const holoColors: {
    readonly neon: {
        readonly color1: "#ff0080";
        readonly color2: "#7928ca";
        readonly color3: "#ff0080";
        readonly color4: "#7928ca";
    };
    readonly ocean: {
        readonly color1: "#00b4d8";
        readonly color2: "#0077b6";
        readonly color3: "#00b4d8";
        readonly color4: "#023e8a";
    };
    readonly sunset: {
        readonly color1: "#ff6b6b";
        readonly color2: "#feca57";
        readonly color3: "#ff9ff3";
        readonly color4: "#54a0ff";
    };
    readonly aurora: {
        readonly color1: "#00f260";
        readonly color2: "#0575e6";
        readonly color3: "#00f260";
        readonly color4: "#0575e6";
    };
};
/**
 * Props for HoloCard component
 */
export interface HoloCardProps {
    /** Card content */
    children: React.ReactNode;
    /** Visual variant */
    variant?: "default" | "gradient" | "glass";
    /** Size variant */
    size?: "sm" | "default" | "lg";
    /** Color preset for holographic effect */
    colors?: keyof typeof holoColors;
    /** Custom colors override */
    customColors?: {
        color1: string;
        color2: string;
        color3: string;
        color4: string;
    };
    /** Tilt intensity (0-1) */
    tiltIntensity?: number;
    /** Scale on hover (1 = no scale) */
    hoverScale?: number;
    /** Disable 3D tilt effect */
    disableTilt?: boolean;
    /** Disable holographic shimmer */
    disableShimmer?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Click handler */
    onClick?: () => void;
}
/**
 * Iridescent holographic card with mouse-driven effects.
 *
 * Features:
 * - 3D tilt following mouse position
 * - Animated holographic gradient overlay
 * - Backdrop blur for glass effect
 * - Smooth spring physics animations
 *
 * Accessibility:
 * - Respects prefers-reduced-motion
 * - Keyboard-accessible when onClick provided
 *
 * @example
 * ```tsx
 * <HoloCard colors="neon" hoverScale={1.05}>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </HoloCard>
 * ```
 *
 * @param props - Component props
 * @returns Holographic card element
 */
export declare function HoloCard({ children, variant, size, colors, customColors, tiltIntensity, hoverScale, disableTilt, disableShimmer, className, onClick, }: HoloCardProps): import("react/jsx-runtime").JSX.Element;
export declare namespace HoloCard {
    var displayName: string;
}
//# sourceMappingURL=holo-card.d.ts.map