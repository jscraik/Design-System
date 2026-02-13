import { cva } from "class-variance-authority";
import { useReducedMotion } from "../../hooks";
import { cn } from "../../utils";

/**
 * Gradient text variants
 */
const gradientTextVariants = cva("inline-block bg-clip-text text-transparent", {
  variants: {
    direction: {
      horizontal: "bg-gradient-to-r",
      vertical: "bg-gradient-to-b",
      diagonal: "bg-gradient-to-br",
      radial: "bg-gradient-radial",
    },
    animate: {
      none: "",
      flow: "animate-gradient-flow",
      shimmer: "animate-gradient-shimmer",
    },
  },
  defaultVariants: {
    direction: "horizontal",
    animate: "none",
  },
});

/**
 * Preset gradient color combinations
 */
export const gradientPresets = {
  sunset: ["#ff6b6b", "#feca57", "#ff9ff3"],
  ocean: ["#00b4d8", "#0077b6", "#023e8a"],
  forest: ["#00f260", "#0575e6", "#00c6ff"],
  aurora: ["#a8ff78", "#78ffd6", "#00c6ff"],
  fire: ["#ff416c", "#ff4b2b", "#ff9068"],
  cyber: ["#00f260", "#0575e6", "#8e44ad"],
} as const;

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
export function GradientText({
  children,
  direction = "horizontal",
  animate = "none",
  preset,
  colors,
  className,
}: GradientTextProps) {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if reduced motion preferred
  const actualAnimate = prefersReducedMotion ? "none" : animate;

  // Use preset or custom colors
  const gradientColors = colors || (preset ? gradientPresets[preset] : gradientPresets.sunset);

  // Build gradient style
  const gradientStyle =
    direction === "radial"
      ? `radial-gradient(circle, ${gradientColors.join(", ")})`
      : `linear-gradient(${direction === "horizontal" ? "to right" : direction === "vertical" ? "to bottom" : "135deg"}, ${gradientColors.join(", ")})`;

  return (
    <span
      className={cn(gradientTextVariants({ direction, animate: actualAnimate }), className)}
      style={{
        backgroundImage: gradientStyle,
        backgroundSize: actualAnimate === "none" ? "100% auto" : "200% auto",
      }}
    >
      {children}
    </span>
  );
}

GradientText.displayName = "GradientText";
