import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { useReducedMotion } from "../../hooks";
import { cn } from "../../utils";

/**
 * Liquid toggle variants
 */
const liquidToggleVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-foundation-bg-light-3 text-foundation-text-light-primary hover:bg-foundation-bg-light-4 data-[state=on]:bg-foundation-accent-green data-[state=on]:text-foundation-text-light-primary",
        outline:
          "border border-foundation-border-light bg-transparent hover:bg-foundation-bg-light-2 data-[state=on]:bg-foundation-accent-green data-[state=on]:text-foundation-text-light-primary data-[state=on]:border-transparent",
        ghost:
          "bg-transparent hover:bg-foundation-bg-light-2 data-[state=on]:bg-foundation-bg-light-3",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4",
        lg: "h-11 px-6",
      },
      liquid: {
        none: "",
        subtle: "liquid-filter-active",
        full: "liquid-filter-active",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      liquid: "subtle",
    },
  },
);

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
export function LiquidToggle({
  pressed = false,
  onPressedChange,
  variant = "default",
  size = "default",
  liquid = "subtle",
  disabled = false,
  className,
  children,
  ariaLabel,
}: LiquidToggleProps) {
  const [filterId] = useState(() => `liquid-filter-${Math.random().toString(36).substring(2, 9)}`);
  const prefersReducedMotion = useReducedMotion();

  // Skip liquid effect if reduced motion preferred
  const shouldApplyLiquid = liquid !== "none" && !prefersReducedMotion;

  return (
    <>
      {shouldApplyLiquid && (
        <svg
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
          aria-hidden="true"
        >
          <defs>
            <filter id={filterId}>
              <feMorphology operator="dilate" radius="2" in="SourceGraphic" result="DILATED" />
              <feGaussianBlur stdDeviation="3" in="DILATED" result="BLURRED" />
              <feColorMatrix
                in="BLURRED"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="LIQUID"
              />
              <feBlend in="SourceGraphic" in2="LIQUID" mode="normal" />
            </filter>
          </defs>
        </svg>
      )}

      <TogglePrimitive.Root
        pressed={pressed}
        onPressedChange={onPressedChange}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          liquidToggleVariants({ variant, size, liquid }),
          shouldApplyLiquid && "liquid-effect",
          className,
        )}
        style={
          shouldApplyLiquid && liquid === "full"
            ? {
                filter: `url(#${filterId})`,
                transition: prefersReducedMotion ? "none" : undefined,
              }
            : {
                transition: prefersReducedMotion ? "none" : undefined,
              }
        }
      >
        <span className="relative z-10">{children}</span>

        {/* Liquid blob background */}
        {shouldApplyLiquid && (
          <span
            className={cn(
              "absolute inset-0 rounded-md opacity-0 transition-opacity duration-300",
              pressed && "opacity-100",
            )}
            style={{
              background: "var(--foundation-accent-green)",
              animation:
                pressed && !prefersReducedMotion
                  ? "liquid-morph 3s ease-in-out infinite"
                  : undefined,
            }}
            aria-hidden="true"
          />
        )}
      </TogglePrimitive.Root>
    </>
  );
}

LiquidToggle.displayName = "LiquidToggle";
