import { cva } from "class-variance-authority";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useReducedMotion } from "../../hooks";
import { cn } from "../../utils";

/**
 * Holographic card variants
 */
const holoCardVariants = cva("relative rounded-xl border backdrop-blur-sm overflow-hidden", {
  variants: {
    variant: {
      default: "border-foundation-border-light bg-white/10 dark:bg-black/10",
      gradient: "border-transparent",
      glass: "border-white/20 bg-white/5 dark:bg-black/5",
    },
    size: {
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

/**
 * Holographic color presets
 */
export const holoColors = {
  neon: {
    color1: "#ff0080",
    color2: "#7928ca",
    color3: "#ff0080",
    color4: "#7928ca",
  },
  ocean: {
    color1: "#00b4d8",
    color2: "#0077b6",
    color3: "#00b4d8",
    color4: "#023e8a",
  },
  sunset: {
    color1: "#ff6b6b",
    color2: "#feca57",
    color3: "#ff9ff3",
    color4: "#54a0ff",
  },
  aurora: {
    color1: "#00f260",
    color2: "#0575e6",
    color3: "#00f260",
    color4: "#0575e6",
  },
} as const;

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
export function HoloCard({
  children,
  variant = "default",
  size = "default",
  colors = "neon",
  customColors,
  _tiltIntensity = 0.15,
  hoverScale = 1.02,
  disableTilt = false,
  disableShimmer = false,
  className,
  onClick,
}: HoloCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInteractive = Boolean(onClick);

  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position to rotation values
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disableTilt || prefersReducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized mouse position (-0.5 to 0.5)
    const normalizedX = (event.clientX - centerX) / rect.width;
    const normalizedY = (event.clientY - centerY) / rect.height;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  // Get color scheme
  const colorScheme = customColors || holoColors[colors];

  return (
    <motion.div
      ref={ref}
      data-slot="holo-card"
      className={cn(
        holoCardVariants({ variant, size }),
        isInteractive && "cursor-pointer effects-component-interactive",
        className,
      )}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      style={
        {
          rotateX: disableTilt || prefersReducedMotion ? 0 : rotateX,
          rotateY: disableTilt || prefersReducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        } as React.CSSProperties
      }
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              scale: hoverScale,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }
      }
      animate={
        isHovered && !disableShimmer && !prefersReducedMotion
          ? {
              backgroundPosition: ["-200% center", "200% center"],
            }
          : {}
      }
      transition={
        isHovered && !disableShimmer && !prefersReducedMotion
          ? {
              backgroundPosition: {
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              },
            }
          : {
              type: "spring",
              stiffness: 300,
              damping: 20,
            }
      }
    >
      {/* Holographic gradient overlay */}
      {!disableShimmer && !prefersReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
          style={{
            background: `linear-gradient(
              135deg,
              ${colorScheme.color1} 0%,
              ${colorScheme.color2} 25%,
              ${colorScheme.color3} 50%,
              ${colorScheme.color4} 75%,
              ${colorScheme.color1} 100%
            )`,
            backgroundSize: "200% auto",
          }}
          aria-hidden="true"
        />
      )}

      {/* Noise texture overlay */}
      {variant === "glass" && !prefersReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content with 3D depth */}
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>

      {/* Glossy shine effect on hover */}
      {isHovered && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}

HoloCard.displayName = "HoloCard";
