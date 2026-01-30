/**
 * Scroll-driven animation components based on @jh3yy's patterns
 *
 * Uses animation-timeline with CSS scroll-driven animation
 * Reference: https://x.com/jh3yy/status/2016903936658030967
 */

import { forwardRef, HTMLAttributes, useEffect, useState } from "react";
import { cn } from "../../utils/cn";

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the progress bar
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Whether to use native CSS scroll-driven animations
   * @default true
   */
  native?: boolean;

  /**
   * Target element to track scroll position
   * @default "document"
   */
  target?: "document" | "parent" | string;
}

/**
 * A scroll progress indicator that can use native CSS scroll-driven animations.
 *
 * When `native={true}`, uses `animation-timeline: scroll()` for smooth,
 * GPU-accelerated scroll tracking without JavaScript.
 */
export const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
  (
    {
      orientation = "horizontal",
      native = true,
      target = "document",
      className,
      ...props
    },
    ref
  ) => {
    const [progress, setProgress] = useState(0);

    // Fallback JavaScript-based scroll tracking
    useEffect(() => {
      if (native) return;

      const handleScroll = () => {
        const scrollTarget =
          target === "document"
            ? document.documentElement
            : target === "parent"
            ? ref?.current?.parentElement
            : document.querySelector(target);

        if (!scrollTarget) return;

        const scrollTop = scrollTarget.scrollTop;
        const scrollHeight = scrollTarget.scrollHeight - scrollTarget.clientHeight;
        const percentage = (scrollTop / scrollHeight) * 100;
        setProgress(percentage);
      };

      const scrollTarget =
        target === "document" ? window : ref?.current?.parentElement;
      scrollTarget?.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => {
        scrollTarget?.removeEventListener("scroll", handleScroll);
      };
    }, [native, target, ref]);

    return (
      <div
        ref={ref}
        className={cn(
          "ds-scroll-progress",
          "relative overflow-hidden rounded-full bg-muted",
          orientation === "horizontal" ? "h-1 w-full" : "h-full w-1",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full bg-foreground",
            native && "animate-scroll-progress"
          )}
          style={
            native
              ? {
                  // Native CSS scroll-driven animation
                  animationTimeline: target === "document" ? "scroll(root)" : undefined,
                }
              : {
                  // JavaScript fallback
                  width: orientation === "horizontal" ? `${progress}%` : "100%",
                  height: orientation === "vertical" ? `${progress}%` : "100%",
                  transform: orientation === "vertical" ? "translateY(0)" : undefined,
                }
          }
        />
      </div>
    );
  }
);

ScrollProgress.displayName = "ScrollProgress";
