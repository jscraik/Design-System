import * as React from "react";
import { IconChat } from "../../../../icons";
import { Sparkles } from "../../../../integrations/apps-sdk";
import { cn } from "../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Supported view modes for the toggle.
 */
export type ViewMode = "chat" | "compose";

/**
 * Props for the view mode toggle component.
 */
export interface ViewModeToggleProps extends StatefulComponentProps {
  /** Current view mode */
  value?: ViewMode;
  /** Callback when mode changes */
  onChange?: (mode: ViewMode) => void;
  /** Additional CSS classes */
  className?: string;
  /** Disable the toggle */
  disabled?: boolean;
  /** Custom labels */
  labels?: {
    chat?: string;
    compose?: string;
  };
}

/**
 * Renders a toggle between chat and compose modes.
 *
 * Supports stateful props for loading, error, and disabled states.
 *
 * @example
 * ```tsx
 * <ViewModeToggle
 *   value={viewMode}
 *   onChange={setViewMode}
 * />
 * ```
 *
 * @param props - View mode toggle props.
 * @returns A view mode toggle element.
 */
export function ViewModeToggle({
  value = "chat",
  onChange,
  className,
  disabled = false,
  loading = false,
  error,
  required,
  onStateChange,
  labels = { chat: "Chat", compose: "Compose" },
}: ViewModeToggleProps) {
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

  const handleToggle = () => {
    if (isDisabled) return;
    onChange?.(value === "compose" ? "chat" : "compose");
  };

  return (
    <button
      type="button"
      data-slot="view-mode-toggle"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      className={cn(
        "flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-secondary transition-colors",
        isDisabled && "opacity-50 cursor-not-allowed",
        error && "border-status-error ring-2 ring-status-error/50",
        loading && "animate-pulse",
        className,
      )}
      onClick={handleToggle}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span className="text-body-small text-muted-foreground">Loading...</span>
      ) : error ? (
        <span className="text-body-small text-status-error">{error}</span>
      ) : value === "compose" ? (
        <>
          <div className="size-4 text-text-secondary">
            <IconChat />
          </div>
          <span className="text-body-small text-text-secondary">{labels.chat}</span>
        </>
      ) : (
        <>
          <Sparkles className="size-4 text-interactive" />
          <span className="text-body-small text-interactive">{labels.compose}</span>
        </>
      )}
    </button>
  );
}

ViewModeToggle.displayName = "ViewModeToggle";
