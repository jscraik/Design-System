/**
 * Scroll-driven TOC marker based on @jh3yy's CSS anchor positioning pattern
 *
 * Uses modern CSS features:
 * - scroll-target-group: Auto-activates target states based on scroll position
 * - anchor-name: Named anchor for positioning
 * - position-anchor: Links element to anchor position
 *
 * Reference: https://x.com/jh3yy/status/2002945849509494936
 */

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface TocMarkerProps extends HTMLAttributes<HTMLElement> {
  /**
   * The position of the marker relative to the active item
   * @default "left"
   */
  position?: "left" | "right" | "top" | "bottom";

  /**
   * Whether the marker should animate smoothly
   * @default true
   */
  animate?: boolean;

  /**
   * Size of the marker
   * @default "2px"
   */
  size?: string;

  /**
   * Color of the marker
   * @default "currentColor"
   */
  color?: string;
}

/**
 * A TOC marker that highlights the active section based on scroll position.
 *
 * The parent TOC container needs `scroll-target-group: auto` and each link
 * needs `anchor-name: --active` when in `:target-current` state.
 */
export const TocMarker = forwardRef<HTMLDivElement, TocMarkerProps>(
  (
    {
      position = "left",
      animate = true,
      size = "2px",
      color = "currentColor",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "ds-toc-marker",
          "absolute transition-transform",
          position === "left" && "left-0 top-0 h-full w-[var(--marker-size,2px)]",
          position === "right" && "right-0 top-0 h-full w-[var(--marker-size,2px)]",
          position === "top" && "top-0 left-0 w-full h-[var(--marker-size,2px)]",
          position === "bottom" && "bottom-0 left-0 w-full h-[var(--marker-size,2px)]",
          animate && "duration-300 ease-out",
          !animate && "duration-0",
          className,
        )}
        style={{
          "--marker-size": size,
          "--marker-color": color,
          backgroundColor: "var(--marker-color)",
          positionAnchor: "--active",
          ...style,
        }}
        {...props}
      />
    );
  },
);

TocMarker.displayName = "TocMarker";
