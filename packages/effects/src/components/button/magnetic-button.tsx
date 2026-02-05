import { cva } from "class-variance-authority";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { useReducedMotion } from "../../hooks";
import { cn } from "../../utils";

/**
 * Magnetic button variants
 */
const magneticButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-foundation-accent-green text-white hover:bg-foundation-accent-green/90 shadow-sm",
        outline:
          "border border-foundation-border-light bg-transparent hover:bg-foundation-bg-light-2",
        ghost: "hover:bg-foundation-bg-light-2",
        link: "text-foundation-accent-green underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

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
export function MagneticButton({
  children,
  variant = "default",
  size = "default",
  magneticStrength = 0.3,
  stiffness = 300,
  damping = 20,
  disableMagnetic = false,
  disabled = false,
  className,
  ariaLabel,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Motion values for magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth return to center
  const springX = useSpring(x, { stiffness, damping });
  const springY = useSpring(y, { stiffness, damping });

  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking relative to button
  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disableMagnetic || prefersReducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from cursor to button center
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    // Apply magnetic effect with strength multiplier
    x.set(deltaX * magneticStrength);
    y.set(deltaY * magneticStrength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Return to center
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: prefersReducedMotion || disableMagnetic ? 0 : springX,
        y: prefersReducedMotion || disableMagnetic ? 0 : springY,
      }}
      whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      className={cn(magneticButtonVariants({ variant, size }), "cursor-pointer", className)}
    >
      {children}

      {/* Magnetic field indicator (visual only) */}
      {!prefersReducedMotion && !disableMagnetic && isHovered && (
        <motion.span
          className="absolute inset-0 rounded-md bg-current opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
}

MagneticButton.displayName = "MagneticButton";
