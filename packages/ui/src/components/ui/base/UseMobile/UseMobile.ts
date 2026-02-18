import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Returns whether the current viewport is considered mobile.
 *
 * Uses a max-width media query with a `768px` breakpoint and updates on resize.
 * Client-only hook; avoid calling during SSR.
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * return <div>{isMobile ? "Mobile" : "Desktop"}</div>;
 * ```
 *
 * @returns `true` when the viewport is narrower than the breakpoint.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
