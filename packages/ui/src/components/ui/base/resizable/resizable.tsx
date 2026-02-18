import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { IconDotsVertical } from "../../../../icons";
import { cn } from "../../utils";

/**
 * Renders a resizable panel group.
 *
 * Supports stateful props for loading, error, and disabled states.
 *
 * Use `direction="horizontal" | "vertical"` to control layout direction.
 *
 * @param props - Resizable panel group props and stateful options.
 * @returns A resizable panel group element.
 */
function ResizablePanelGroup({
  className,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: React.ComponentProps<typeof Group> & StatefulComponentProps) {
  // Determine effective state
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

  return (
    <Group
      data-slot="resizable-panel-group"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        // Disabled state styling
        disabled && "opacity-50 pointer-events-none",
        // Error state styling
        error && "ring-2 ring-status-error/50",
        className,
      )}
      aria-disabled={disabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      {...props}
    />
  );
}

/**
 * Renders a resizable panel.
 *
 * @param props - Resizable panel props.
 * @returns A resizable panel element.
 */
function ResizablePanel({ ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

/**
 * Renders a resize handle between panels.
 *
 * Set `withHandle` to render the visual grip element.
 *
 * @param props - Resize handle props.
 * @returns A resize handle element.
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean;
}) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <IconDotsVertical className="size-2.5" />
        </div>
      )}
    </Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
