import { useEffect, useState } from "react";

/**
 * Detects if the user prefers reduced motion.
 *
 * Respects the `prefers-reduced-motion` media query and provides
 * a boolean value for disabling animations for accessibility.
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * return (
 *   <div style={{
 *     transition: prefersReducedMotion ? 'none' : 'transform 0.3s'
 *   }}>
 *     Content
 *   </div>
 * );
 * ```
 *
 * @returns Whether the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
