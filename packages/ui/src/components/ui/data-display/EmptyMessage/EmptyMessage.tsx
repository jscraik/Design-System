import * as React from "react";

import { IconArchive, IconQuestion, IconSearch, IconWarning } from "../../../../icons";
import { cn } from "../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

export interface EmptyMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    StatefulComponentProps {
  icon?: React.ReactNode | React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "search" | "error" | "inbox";
}

const defaultIcons = {
  default: IconQuestion,
  search: IconSearch,
  error: IconWarning,
  inbox: IconArchive,
} as const;

/**
 * Renders an empty state message with icon, title, and optional description.
 *
 * Supports stateful props for loading, error, and disabled states.
 * When loading, shows a loading indicator instead of the icon.
 * When error, uses error variant icon.
 *
 * @param props - Empty message props and stateful options.
 * @returns The empty message element.
 *
 * @example
 * ```tsx
 * <EmptyMessage title="No results found" description="Try adjusting your search" />
 * <EmptyMessage title="Loading..." loading />
 * <EmptyMessage title="Failed to load" error="Network error" />
 * ```
 */
function EmptyMessage({
  icon,
  title,
  description,
  action,
  variant = "default",
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  className,
  ...props
}: EmptyMessageProps) {
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

  // In error state, force error variant unless icon is explicitly provided
  const effectiveVariant = error && !icon ? "error" : variant;
  const Icon = icon || defaultIcons[effectiveVariant];
  const iconNode = React.isValidElement(Icon) ? (
    Icon
  ) : typeof Icon === "function" ? (
    <Icon className="size-8 text-muted-foreground" />
  ) : null;

  return (
    <div
      data-slot="empty-message"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        isDisabled && "opacity-50 pointer-events-none",
        className,
      )}
      {...props}
    >
      <div className="rounded-full bg-muted p-6">
        {loading ? (
          <div className="size-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          iconNode
        )}
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="font-semibold text-foreground">
          {loading ? "Loading..." : error ? "Error" : title}
        </h3>
        {description && !loading && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && <p className="text-sm text-status-error">{error}</p>}
      </div>

      {action && !loading && !error && !isDisabled && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { EmptyMessage };
