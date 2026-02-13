import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import { IconSearch } from "../../../../icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../feedback/Dialog";
import { cn } from "../../utils";

/**
 * Renders the command palette container (cmdk).
 *
 * Supports stateful props for loading, error, and disabled states.
 *
 * @param props - Cmdk root props and stateful options.
 * @returns The command palette root element.
 */
function Command({
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive> & StatefulComponentProps) {
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
    <CommandPrimitive
      data-slot="command"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        isDisabled && "opacity-50 pointer-events-none",
        error && "ring-2 ring-status-error/50 rounded-md",
        loading && "animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the command palette inside a dialog.
 *
 * @param props - Dialog props plus title/description.
 * @returns A dialog-wrapped command palette.
 *
 * @example
 * ```tsx
 * <CommandDialog open>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandItem>Open Settings</CommandItem>
 *   </CommandList>
 * </CommandDialog>
 * ```
 */
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
}) {
  type CommandChildren = React.ComponentProps<typeof CommandPrimitive>["children"];
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children as CommandChildren}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Renders the command input field with search icon.
 *
 * @param props - Cmdk input props.
 * @returns A command input element.
 */
function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">
      <IconSearch className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/**
 * Renders a scrollable list container for command items.
 *
 * @param props - Cmdk list props.
 * @returns A command list element.
 */
function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)}
      {...props}
    />
  );
}

/**
 * Renders an empty state when no command results match.
 *
 * @param props - Cmdk empty props.
 * @returns An empty state element.
 */
function CommandEmpty({ ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

/**
 * Renders a group container for command items.
 *
 * @param props - Cmdk group props.
 * @returns A command group element.
 */
function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a separator line between command groups.
 *
 * @param props - Cmdk separator props.
 * @returns A separator element.
 */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}

/**
 * Renders a command item element.
 *
 * @param props - Cmdk item props.
 * @returns A command item element.
 */
function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-interactive data-[selected=true]:text-text-body-on-color [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a right-aligned keyboard shortcut label.
 *
 * @param props - Span props for shortcut text.
 * @returns A shortcut label element.
 */
function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
