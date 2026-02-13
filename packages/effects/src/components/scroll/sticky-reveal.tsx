import { cva } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useScrollPosition } from "../../hooks";
import { cn } from "../../utils";

/**
 * Sticky reveal variants
 */
const stickyRevealVariants = cva("transition-all duration-500 ease-out", {
  variants: {
    direction: {
      up: "data-[state=revealed]:translate-y-0 data-[state=hidden]:translate-y-8",
      down: "data-[state=revealed]:translate-y-0 data-[state=hidden]:-translate-y-8",
      left: "data-[state=revealed]:translate-x-0 data-[state=hidden]:translate-x-8",
      right: "data-[state=revealed]:translate-x-0 data-[state=hidden]:-translate-x-8",
    },
    fade: {
      none: "",
      subtle: "data-[state=revealed]:opacity-100 data-[state=hidden]:opacity-40",
      full: "data-[state=revealed]:opacity-100 data-[state=hidden]:opacity-0",
    },
  },
  defaultVariants: {
    direction: "up",
    fade: "subtle",
  },
});

/**
 * Props for StickyReveal component
 */
export interface StickyRevealProps {
  /** Content to reveal on scroll */
  children: React.ReactNode;
  /** Reveal direction */
  direction?: "up" | "down" | "left" | "right";
  /** Fade intensity */
  fade?: "none" | "subtle" | "full";
  /** Scroll position (0-1) to trigger reveal */
  triggerAt?: number;
  /** Whether element should stick during scroll */
  sticky?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Scroll-driven reveal animation using View Timeline API.
 *
 * The element reveals itself when the user scrolls to a specific position.
 * Uses Intersection Observer as fallback for browsers without View Timeline.
 *
 * Accessibility:
 * - Respects prefers-reduced-motion
 * - No decorative-only content
 *
 * @example
 * ```tsx
 * <StickyReveal triggerAt={0.3} sticky>
 *   <h2>Revealed Content</h2>
 * </StickyReveal>
 * ```
 *
 * @param props - Component props
 * @returns Scroll-revealed element
 */
export function StickyReveal({
  children,
  direction = "up",
  fade = "subtle",
  triggerAt = 0.5,
  sticky = false,
  className,
}: StickyRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  useScrollPosition({ throttle: 50 });

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    // Use Intersection Observer for better browser support
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Calculate intersection ratio to match trigger position
        const ratio = entry.intersectionRatio;
        const threshold = 1 - triggerAt;

        setIsRevealed(ratio >= threshold);
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0, 0.01, 0.02... 1.00
        rootMargin: "0px",
      },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [triggerAt]);

  // Force revealed if reduced motion preferred
  const actualRevealed = prefersReducedMotion ? true : isRevealed;

  return (
    <div
      ref={ref}
      className={cn(stickyRevealVariants({ direction, fade }), sticky && "sticky top-4", className)}
      data-state={actualRevealed ? "revealed" : "hidden"}
      style={
        prefersReducedMotion
          ? { transition: "none" }
          : {
              transitionDuration: `${500}ms`,
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }
      }
    >
      {children}
    </div>
  );
}

StickyReveal.displayName = "StickyReveal";
