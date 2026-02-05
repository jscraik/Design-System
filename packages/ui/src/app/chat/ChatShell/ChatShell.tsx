import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";

import type { ReactNode } from "react";
import * as React from "react";
import { cn } from "../../../components/ui/utils";

/**
 * Slot content regions for the chat shell layout.
 */
export type ChatShellSlots = {
  sidebar?: ReactNode;
  header?: ReactNode;
  messages?: ReactNode;
  composer?: ReactNode;
  contextPanel?: ReactNode;
};

/**
 * Props for the chat shell layout.
 */
export interface ChatShellProps extends StatefulComponentProps {
  slots: ChatShellSlots;
  className?: string;
  contentClassName?: string;
}

/**
 * Renders the chat shell layout with named slots.
 *
 * Supports stateful props for loading, error, and disabled states.
 * Can show loading overlay or error message for the entire chat shell.
 *
 * @param props - Chat shell props and stateful options.
 * @returns A layout container that arranges slot regions.
 *
 * @example
 * ```tsx
 * <ChatShell slots={{ sidebar, header, messages, composer }} />
 * <ChatShell slots={slots} loading />
 * <ChatShell slots={slots} error="Failed to load chat" />
 * ```
 */
export function ChatShell({
  slots,
  className,
  contentClassName,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
}: ChatShellProps) {
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

  return (
    <div
      data-testid="chat-shell"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "size-full flex bg-background dark:bg-background text-foreground dark:text-foreground overflow-hidden relative",
        isDisabled && "opacity-50 pointer-events-none",
        error && "ring-2 ring-status-error/50",
        loading && "animate-pulse",
        className,
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 dark:bg-background/80 z-10">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 dark:bg-background/80 z-10">
          <div className="text-status-error">{error}</div>
        </div>
      )}
      {slots.sidebar}
      <div className={cn("flex min-h-0 min-w-0 flex-1 flex-col", contentClassName)}>
        {slots.header}
        <div className="flex min-h-0 min-w-0 flex-1">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {slots.messages}
            {slots.composer}
          </div>
          {slots.contextPanel}
        </div>
      </div>
    </div>
  );
}
