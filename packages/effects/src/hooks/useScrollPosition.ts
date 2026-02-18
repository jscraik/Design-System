import { useEffect, useState } from "react";

/**
 * Scroll position state returned by useScrollPosition hook
 */
export interface ScrollPosition {
  scrollY: number;
  scrollX: number;
  scrollProgress: number;
  direction: "up" | "down" | null;
}

/**
 * Options for useScrollPosition hook
 */
export interface UseScrollPositionOptions {
  /** Throttle updates in milliseconds */
  throttle?: number;
  /** Element to track (defaults to window) */
  element?: HTMLElement | Window;
}

/**
 * Tracks scroll position and direction for scroll-driven animations.
 *
 * @example
 * ```tsx
 * const { scrollProgress, direction } = useScrollPosition();
 * ```
 *
 * @param options - Hook configuration options
 * @returns Scroll position data
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}) {
  const { throttle = 16, element: targetElement = window } = options;
  const isWindow = targetElement === window;

  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: isWindow ? window.scrollY : 0,
    scrollX: isWindow ? window.scrollX : 0,
    scrollProgress: 0,
    direction: null,
  });

  useEffect(() => {
    let lastScrollY = isWindow ? window.scrollY : 0;
    let lastUpdate = 0;

    const handleScroll = () => {
      const now = Date.now();
      if (throttle && now - lastUpdate < throttle) {
        return;
      }
      lastUpdate = now;

      const scrollY = isWindow ? window.scrollY : (targetElement as HTMLElement).scrollTop;
      const scrollX = isWindow ? window.scrollX : (targetElement as HTMLElement).scrollLeft;

      const scrollTop = scrollY;
      const scrollHeight = isWindow
        ? document.documentElement.scrollHeight - window.innerHeight
        : (targetElement as HTMLElement).scrollHeight - (targetElement as HTMLElement).clientHeight;

      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      setScrollPosition({
        scrollY,
        scrollX,
        scrollProgress: Math.min(1, Math.max(0, progress)),
        direction: scrollY > lastScrollY ? "down" : scrollY < lastScrollY ? "up" : null,
      });

      lastScrollY = scrollY;
    };

    targetElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      targetElement.removeEventListener("scroll", handleScroll);
    };
  }, [throttle, targetElement, isWindow]);

  return scrollPosition;
}
