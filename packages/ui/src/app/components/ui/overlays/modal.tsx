import type { ReactNode } from "react";

import { useFocusTrap } from "../../hooks/useFocusTrap";

import { cn } from "../utils";

export interface ModalDialogProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal is closed (via overlay click, Escape, or close button) */
  onClose: () => void;
  /** Modal content */
  children: ReactNode;
  /** Optional title for aria-labelledby */
  title?: string;
  /** Optional title ID for aria-labelledby (overrides title prop) */
  titleId?: string;
  /** Optional description for aria-describedby */
  description?: string;
  /** Maximum width of the modal dialog */
  maxWidth?: string;
  /** Whether to show the overlay */
  showOverlay?: boolean;
  /** Additional CSS classes for the dialog content */
  className?: string;
  /** Additional CSS classes for the overlay */
  overlayClassName?: string;
}

/**
 * ModalDialog - A primitive modal dialog with focus trap
 *
 * Implements the WAI-ARIA dialog pattern:
 * - Focus trap (Tab/Shift+Tab cycle within modal)
 * - Escape key closes the modal
 * - Click outside (overlay) closes the modal
 * - Restores focus to the previously focused element on close
 * - Semantic HTML: role="dialog", aria-modal, aria-labelledby
 *
 * @example
 * ```tsx
 * function MyModal({ isOpen, onClose }) {
 *   return (
 *     <ModalDialog isOpen={isOpen} onClose={onClose} title="My Modal">
 *       <div className="px-6 py-4">
 *         <p>Modal content goes here</p>
 *       </div>
 *     </ModalDialog>
 *   );
 * }
 * ```
 */
export function ModalDialog({
  isOpen,
  onClose,
  children,
  title,
  titleId,
  description,
  maxWidth = "420px",
  showOverlay = true,
  className,
  overlayClassName,
}: ModalDialogProps) {
  const { dialogRef, trapProps } = useFocusTrap({
    isOpen,
    onClose,
    restoreFocus: true,
  });

  if (!isOpen) return null;

  // Generate title ID from title if not provided
  const generatedTitleId = titleId || (title ? `modal-title-${title.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="presentation">
      {/* Overlay */}
      {showOverlay && (
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/60",
            overlayClassName,
          )}
          aria-label="Close dialog"
          onClick={onClose}
        />
      )}

      {/* Dialog */}
      <div
        {...trapProps}
        role="dialog"
        aria-modal="true"
        aria-labelledby={generatedTitleId}
        aria-describedby={description ? `${generatedTitleId}-description` : undefined}
        className={cn(
          "relative z-10 outline-none",
          "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2",
          "border border-foundation-bg-light-3 dark:border-white/10",
          "rounded-xl shadow-2xl",
          "max-h-[90vh] overflow-y-auto",
          className,
        )}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * ModalHeader - Header section for ModalDialog
 *
 * Includes title and optional close button
 */
export interface ModalHeaderProps {
  /** Modal title */
  title: string;
  /** Optional title ID for aria-labelledby */
  titleId?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Whether to show the close button */
  showClose?: boolean;
  /** Close button click handler */
  onClose?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Optional header actions (buttons, etc.) to display before close button */
  actions?: ReactNode;
}

export function ModalHeader({
  title,
  titleId,
  subtitle,
  showClose = true,
  onClose,
  className,
  actions,
}: ModalHeaderProps) {
  const generatedTitleId = titleId || `modal-title-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={cn(
      "flex items-center justify-between px-6 py-4",
      "border-b border-foundation-bg-light-3 dark:border-white/10",
      className,
    )}>
      <div className="flex-1">
        <h2
          id={generatedTitleId}
          className="text-[16px] font-semibold leading-[24px] tracking-[-0.32px] text-foundation-text-light-primary dark:text-white"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-[13px] font-normal leading-[18px] tracking-[-0.32px] text-foundation-text-light-tertiary dark:text-white/60 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
      {showClose && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          title="Close dialog"
          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="size-4 text-foundation-text-light-tertiary dark:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * ModalBody - Body/content section for ModalDialog
 *
 * Scrollable content area with consistent padding
 */
export interface ModalBodyProps {
  /** Modal content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

/**
 * ModalFooter - Footer section for ModalDialog
 *
 * Right-aligned action buttons area
 */
export interface ModalFooterProps {
  /** Footer content (typically buttons) */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn(
      "flex items-center justify-end gap-3 px-6 py-4",
      "border-t border-foundation-bg-light-3 dark:border-white/10",
      className,
    )}>
      {children}
    </div>
  );
}

ModalDialog.displayName = "ModalDialog";
ModalHeader.displayName = "ModalHeader";
ModalBody.displayName = "ModalBody";
ModalFooter.displayName = "ModalFooter";
