/**
 * Scroll-driven animation components based on @jh3yy's patterns
 *
 * Uses animation-timeline with CSS scroll-driven animation
 * Reference: https://x.com/jh3yy/status/2016903936658030967
 */

import { forwardRef, type HTMLAttributes, useCallback, useEffect, useRef, useState } from "react";
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

function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/**
 * A scroll progress indicator that can use native CSS scroll-driven animations.
 *
 * When `native={true}`, uses `animation-timeline: scroll()` for smooth,
 * GPU-accelerated scroll tracking without JavaScript.
 */
export const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
  (
    { orientation = "horizontal", native = true, target = "document", className, ...props },
    ref,
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    // Fallback JavaScript-based scroll tracking
    useEffect(() => {
      if (native) return;

      const getScrollTarget = () => {
        if (target === "document") return document.documentElement;
        if (target === "parent") return localRef.current?.parentElement ?? null;
        try {
          return document.querySelector(target);
        } catch (error) {
          console.warn("[ScrollProgress] Invalid target selector.", { target, error });
          return null;
        }
      };

      const handleScroll = () => {
        const scrollTarget = getScrollTarget();

        if (!scrollTarget) {
          setProgress(0);
          return;
        }

        const scrollTop = scrollTarget.scrollTop;
        const scrollHeight = scrollTarget.scrollHeight - scrollTarget.clientHeight;
        const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        setProgress(clampProgress(percentage));
      };

      const scrollEventTarget = target === "document" ? window : getScrollTarget();
      scrollEventTarget?.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => {
        scrollEventTarget?.removeEventListener("scroll", handleScroll);
      };
    }, [native, target]);

    return (
      <div
        ref={setRefs}
        className={cn(
          "ds-scroll-progress",
          "relative overflow-hidden rounded-full bg-muted",
          orientation === "horizontal" ? "h-1 w-full" : "h-full w-1",
          className,
        )}
        {...props}
      >
        <div
          className={cn("h-full bg-foreground", native && "animate-scroll-progress")}
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
  },
);

ScrollProgress.displayName = "ScrollProgress";
