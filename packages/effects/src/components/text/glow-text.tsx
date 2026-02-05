import { cva } from "class-variance-authority";
import { useReducedMotion } from "../../hooks";
import { cn } from "../../utils";

/**
 * Glow text variants
 */
const glowTextVariants = cva("inline-block", {
  variants: {
    intensity: {
      subtle: "glow-layer-1",
      medium: "glow-layer-2",
      intense: "glow-layer-3",
    },
    animate: {
      none: "",
      pulse: "animate-glow-pulse",
      breathe: "animate-glow-breathe",
    },
  },
  defaultVariants: {
    intensity: "medium",
    animate: "none",
  },
});

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
export function GlowText({
  children,
  color = "var(--foundation-accent-green)",
  intensity = "medium",
  animate = "none",
  className,
}: GlowTextProps) {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if reduced motion preferred
  const actualAnimate = prefersReducedMotion ? "none" : animate;

  return (
    <span
      className={cn(glowTextVariants({ intensity, animate: actualAnimate }), className)}
      style={
        {
          "--glow-color": color,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}

GlowText.displayName = "GlowText";
