import { useEffect, useRef, useState } from "react";

/**
 * Mouse position state returned by useMousePosition hook
 */
export interface MousePosition {
  x: number;
  y: number;
  elementX: number;
  elementY: number;
}

/**
 * Options for useMousePosition hook
 */
export interface UseMousePositionOptions {
  /** Whether to track mouse position relative to element */
  relative?: boolean;
  /** Throttle updates in milliseconds */
  throttle?: number;
}

/**
 * Tracks mouse position for magnetic and hover effects.
 *
 * @example
 * ```tsx
 * const { x, y, elementX, elementY } = useMousePosition({ relative: true });
 * ```
 *
 * @param options - Hook configuration options
 * @returns Mouse position coordinates
 */
export function useMousePosition(options: UseMousePositionOptions = {}) {
  const { relative = true, throttle = 16 } = options;

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
  });

  const elementRef = useRef<HTMLElement | null>(null);
  const lastUpdate = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (throttle && now - lastUpdate.current < throttle) {
        return;
      }
      lastUpdate.current = now;

      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();

      setMousePosition({
        x: event.clientX,
        y: event.clientY,
        elementX: event.clientX - rect.left,
        elementY: event.clientY - rect.top,
      });
    };

    if (relative && elementRef.current) {
      elementRef.current.addEventListener("mousemove", handleMouseMove);
      return () => {
        elementRef.current?.removeEventListener("mousemove", handleMouseMove);
      };
    } else {
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [relative, throttle]);

  return {
    ...mousePosition,
    elementRef,
  };
}

/**
 * Extended return type with element ref
 */
export interface UseMousePositionReturn extends MousePosition {
  elementRef: React.RefObject<HTMLElement>;
}
