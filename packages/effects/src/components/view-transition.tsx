/**
 * View Transitions API wrapper based on @jh3yy's patterns
 *
 * Provides a React-friendly interface to the native View Transitions API
 * for smooth page transitions and SPA navigation effects.
 *
 * Reference: https://x.com/jh3yy/status/2016902094305755339
 */

import { useCallback, useRef } from "react";

export interface ViewTransitionOptions {
  /**
   * Name of the transition for grouping
   */
  name?: string;

  /**
   * Update callback that runs during the transition
   */
  update: () => void | Promise<void>;

  /**
   * Duration of the transition in milliseconds
   * @default 300
   */
  duration?: number;

  /**
   * Easing function for the transition
   * @default "ease"
   */
  easing?: string;
}

/**
 * Hook for using the View Transitions API
 *
 * @example
 * ```tsx
 * const startTransition = useViewTransition();
 *
 * const navigate = async (path: string) => {
 *   await startTransition({
 *     name: "page-transition",
 *     update: async () => {
 *       await router.push(path);
 *     },
 *     duration: 300,
 *   });
 * };
 * ```
 */
export function useViewTransition() {
  const transitionRef = useRef<ViewTransition | null>(null);

  const startTransition = useCallback(async (options: ViewTransitionOptions) => {
    const { update, duration = 300, easing = "ease" } = options;

    // Check if View Transitions API is supported
    if (!("startViewTransition" in document)) {
      // Fallback: just run the update without transition
      await update();
      return;
    }

    try {
      // Start the view transition
      transitionRef.current = document.startViewTransition({
        update: async () => {
          await update();
        },
      });

      // Apply custom duration and easing if supported
      if (transitionRef.current) {
        const documentStyles = document.documentElement.style;

        if (duration) {
          documentStyles.setProperty("--view-transition-duration", `${duration}ms`);
        }

        if (easing) {
          documentStyles.setProperty("--view-transition-easing", easing);
        }

        // Wait for transition to complete
        await transitionRef.current.finished;

        // Clean up custom properties
        documentStyles.removeProperty("--view-transition-duration");
        documentStyles.removeProperty("--view-transition-easing");
      }
    } catch (error) {
      // If transition fails, still run the update
      console.warn("View transition failed, falling back to direct update:", error);
      await update();
    } finally {
      transitionRef.current = null;
    }
  }, []);

  return { startTransition };
}

/**
 * Component wrapper for view transitions
 *
 * @example
 * ```tsx
 * <ViewTransition name="my-transition">
 *   <PageContent />
 * </ViewTransition>
 * ```
 */
export interface ViewTransitionWrapperProps {
  children: React.ReactNode;
  name?: string;
  className?: string;
}

export function ViewTransitionWrapper({ children, name, className }: ViewTransitionWrapperProps) {
  return (
    <div
      className={className}
      style={{
        viewTransitionName: name,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Pre-defined transition types
 */
export const viewTransitions = {
  fade: "fade",
  slide: "slide",
  scale: "scale",
  flip: "flip",
} as const;

export type ViewTransitionType = (typeof viewTransitions)[keyof typeof viewTransitions];
