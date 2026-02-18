import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
import { type ReactNode, useId } from "react";
import { useFocusTrap } from "../../../../hooks/useFocusTrap";
import { cn } from "../../utils";

/**
 * Props for the modal dialog component.
 */
export interface ModalDialogProps extends StatefulComponentProps {
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
 * Renders a primitive modal dialog with focus trap.
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
 *
 * @param props - Modal dialog props.
 * @returns A modal dialog element, or `null` when closed.
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
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
}: ModalDialogProps) {
  const baseId = useId();
  const { trapProps } = useFocusTrap({
    isOpen,
    onClose,
    restoreFocus: true,
  });

  // Determine effective state (priority: loading > error > disabled > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;

  if (!isOpen) return null;

  // Generate unique IDs using useId() for guaranteed uniqueness
  const generatedTitleId = titleId || (title ? `modal-title-${baseId}` : undefined);
  const descriptionId = description ? `modal-description-${baseId}` : undefined;

  return (
    <div
      data-slot="modal"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
    >
      {/* Overlay */}
      {showOverlay && (
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-overlay/60",
            isDisabled && "opacity-50 pointer-events-none",
            error && "bg-status-error/30",
            overlayClassName,
          )}
          aria-hidden="true"
          tabIndex={-1}
          onClick={onClose}
        />
      )}

      {/* Dialog */}
      <div
        {...trapProps}
        role="dialog"
        aria-modal="true"
        aria-labelledby={generatedTitleId}
        aria-describedby={descriptionId}
        className={cn(
          "relative z-10 outline-none",
          "bg-card",
          "border border-border",
          "rounded-xl shadow-2xl",
          "max-h-[90vh] overflow-y-auto",
          isDisabled && "opacity-50 pointer-events-none",
          error && "ring-2 ring-status-error/50",
          loading && "animate-pulse",
          className,
        )}
        style={{ maxWidth }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-20 rounded-xl">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-20 rounded-xl">
            <div className="text-status-error">{error}</div>
          </div>
        )}
        {title && !titleId ? (
          <span id={generatedTitleId} className="sr-only">
            {title}
          </span>
        ) : null}
        {description ? (
          <p id={descriptionId} className="sr-only">
            {description}
          </p>
        ) : null}
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

/**
 * Renders the modal header section.
 *
 * @param props - Modal header props.
 * @returns A header element for the modal dialog.
 */
export function ModalHeader({
  title,
  titleId,
  subtitle,
  showClose = true,
  onClose,
  className,
  actions,
}: ModalHeaderProps) {
  const baseId = useId();
  const generatedTitleId = titleId || `modal-title-${baseId}`;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4",
        "border-b border-border",
        className,
      )}
    >
      <div className="flex-1">
        <h2 id={generatedTitleId} className="text-body-small font-semibold text-foreground">
          {title}
        </h2>
        {subtitle && <p className="text-caption text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
      {showClose && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          title="Close dialog"
          className="p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <svg
            className="size-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
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

/**
 * Renders the modal body section.
 *
 * @param props - Modal body props.
 * @returns A body element for the modal dialog.
 */
export function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cn("p-6", className)}>{children}</div>;
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

/**
 * Renders the modal footer section.
 *
 * @param props - Modal footer props.
 * @returns A footer element for the modal dialog.
 */
export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 px-6 py-4",
        "border-t border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

ModalDialog.displayName = "ModalDialog";
ModalHeader.displayName = "ModalHeader";
ModalBody.displayName = "ModalBody";
ModalFooter.displayName = "ModalFooter";
