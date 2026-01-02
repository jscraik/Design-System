import { useEffect, useRef } from "react";

/**
 * Focus trap options for configuring the hook behavior.
 */
export interface UseFocusTrapOptions {
  /** Whether the focus trap is active. */
  isOpen: boolean;
  /** Callback invoked when the Escape key is pressed. */
  onClose?: () => void;
  /** Whether to restore focus to the previously focused element on close. */
  restoreFocus?: boolean;
}

/**
 * Helper to get all focusable elements within a container
 * Filters out elements with aria-hidden="true"
 */
const getFocusable = (container: HTMLElement) => {
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => el.getAttribute("aria-hidden") !== "true",
  );
};

/**
 * Traps keyboard focus within a container when open.
 *
 * Accessibility contract:
 * - `Tab`/`Shift+Tab` cycles through focusable elements inside the container.
 * - `Escape` invokes `onClose` when provided.
 * - Focus is restored to the previously focused element when the trap closes.
 *
 * Notes:
 * - This hook touches `window`/`document`, so it should only run in the browser.
 *
 * @param options - Focus trap configuration.
 * @param options.isOpen - Whether the trap is active.
 * @param options.onClose - Callback invoked on Escape.
 * @param options.restoreFocus - Restores focus on close (default: `true`).
 * @returns An object with `dialogRef` and `trapProps` to spread onto the container.
 *
 * @example
 * ```tsx
 * function MyModal({ isOpen, onClose }) {
 *   const { trapProps } = useFocusTrap({ isOpen, onClose });
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div {...trapProps} role="dialog" aria-modal="true">
 *       <button>Close</button>
 *       <button>Save</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap({ isOpen, onClose, restoreFocus = true }: UseFocusTrapOptions) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the currently focused element before opening the modal
    if (restoreFocus) {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
    }

    // Focus the first focusable element when it opens (or the dialog itself)
    const t = window.setTimeout(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = getFocusable(dialog);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        dialog.focus();
      }
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap for Tab key
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = getFocusable(dialogRef.current);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);

      // Restore focus to the previously focused element
      if (restoreFocus && lastActiveRef.current) {
        lastActiveRef.current.focus();
        lastActiveRef.current = null;
      }
    };
  }, [isOpen, onClose, restoreFocus]);

  return {
    dialogRef,
    trapProps: {
      ref: dialogRef,
      tabIndex: -1 as const,
    },
  };
}
