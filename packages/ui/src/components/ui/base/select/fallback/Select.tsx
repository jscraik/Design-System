// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { IconCheckmark, IconChevronDownMd, IconChevronUpMd } from "../../../../../icons";
import { cn } from "../../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

// Context to pass state down to Select subcomponents
const SelectContext = React.createContext<{
  isCompound: boolean;
  effectiveState: ComponentState;
  error?: string;
  required?: boolean;
}>({
  isCompound: false,
  effectiveState: "default",
});
SelectContext.displayName = "SelectContext";

/**
 * Select root component (Radix Select) with Apps SDK UI tokens.
 *
 * **Hybrid Pattern:**
 * - **Props API (default)**: Use with SelectTrigger, SelectValue, SelectContent
 * - **Compound API (opt-in)**: Use with variant="compound" for advanced composition
 *
 * Supports stateful props for loading, error, disabled, and required states.
 *
 * Accessibility contract:
 * - Ensure a visible label or `aria-label`/`aria-labelledby` on the trigger.
 *
 * **Props API (default):**
 * ```tsx
 * <Select value={value} onValueChange={setValue}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Pick one" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="one">One</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 *
 * **Compound API (opt-in):**
 * ```tsx
 * <Select variant="compound">
 *   <Select.Trigger>
 *     <Select.Value placeholder="Pick one" />
 *   </Select.Trigger>
 *   <Select.Content>
 *     <Select.Item value="one">One</Select.Item>
 *   </Select.Content>
 * </Select>
 * ```
 *
 * @param props - Radix Select root props including stateful options.
 * @param props.variant - "default" for props API or "compound" for advanced composition.
 * @param props.error - Error message, applies error styling when set.
 * @param props.loading - Shows loading state and disables select (default: `false`).
 * @param props.disabled - Disabled state (also set automatically when loading).
 * @param props.required - Required field indicator (default: `false`).
 * @param props.onStateChange - Callback when component state changes.
 * @returns The Select root element.
 */
function Select({
  variant = "default",
  loading = false,
  error,
  disabled = false,
  required = false,
  onStateChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> &
  StatefulComponentProps & {
    variant?: "default" | "compound";
  }) {
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

  // Select is effectively disabled when loading or explicitly disabled
  const isDisabled = disabled || loading;

  const isCompound = variant === "compound";

  const contextValue = React.useMemo(
    () => ({ isCompound, effectiveState, error, required }),
    [isCompound, effectiveState, error, required],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root
        data-slot="select"
        data-state={effectiveState}
        data-error={error ? "true" : undefined}
        data-required={required ? "true" : undefined}
        data-variant={isCompound ? "compound" : "default"}
        disabled={isDisabled}
        {...props}
      />
    </SelectContext.Provider>
  );
}

/**
 * Groups Select items for labeling and structure.
 *
 * @param props - Radix Select group props.
 * @returns A grouping element for Select items.
 */
function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

/**
 * Displays the current selection value inside the trigger.
 *
 * @param props - Radix Select value props.
 * @returns A value display element.
 */
function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

/**
 * Trigger button for opening the Select menu with Apps SDK UI tokens.
 *
 * @param props.size - Size variant for the trigger (default: `default`).
 * @returns The Select trigger element.
 */
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  const { effectiveState, error } = React.useContext(SelectContext);

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-state={effectiveState}
      data-size={size}
      className={cn(
        // Base layout
        "flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none",
        // Border - using Apps SDK UI tokens
        "border-input",
        // Background - using Apps SDK UI tokens
        "bg-input-background",
        // Placeholder text - using Apps SDK UI tokens
        "data-[placeholder]:text-muted-foreground",
        // Icon color - using Apps SDK UI tokens
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        // Focus styles - using Apps SDK UI tokens
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // Error state styling - using Apps SDK UI tokens
        error && "border-destructive focus:border-destructive focus:ring-destructive/50",
        effectiveState === "error" && "ring-destructive/20 dark:ring-destructive/40",
        // Hover - using Apps SDK UI tokens
        "hover:bg-input/50 dark:hover:bg-input/50",
        // Dark mode background - using Apps SDK UI tokens
        "dark:bg-input/30",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Loading state styling
        effectiveState === "loading" && "opacity-70 cursor-wait",
        // Size variants
        "data-[size=default]:min-h-[var(--foundation-size-control-height)] data-[size=sm]:min-h-[var(--foundation-size-control-height)]",
        // Select value styling
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
        // Icon styling
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <IconChevronDownMd className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/**
 * Content wrapper for the Select dropdown with Apps SDK UI tokens.
 *
 * @param props - Radix Select content props.
 * @returns The Select content element rendered in a portal.
 */
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          // Background - using Apps SDK UI tokens
          "bg-popover text-popover-foreground",
          // Animation
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          // Position offset
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

/**
 * Label for a group of Select items with Apps SDK UI tokens.
 *
 * @param props - Radix Select label props.
 * @returns A label element for grouped items.
 */
function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      // Text color - using Apps SDK UI tokens
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

/**
 * Selectable item within the dropdown list with Apps SDK UI tokens.
 *
 * @param props - Radix Select item props.
 * @returns An item element for selection.
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none",
        // Focus background - using Apps SDK UI tokens
        "focus:bg-accent focus:text-accent-foreground",
        // Icon color - using Apps SDK UI tokens
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        // Disabled state
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Icon styling
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size'])]:size-4",
        // Item text/indicator styling
        "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <IconCheckmark className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

/**
 * Visual separator between groups of items with Apps SDK UI tokens.
 *
 * @param props - Radix Select separator props.
 * @returns A separator element.
 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      // Background - using Apps SDK UI tokens
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

/**
 * Scroll-up control for long Select lists.
 *
 * @param props - Radix Select scroll up button props.
 * @returns A scroll-up control element.
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <IconChevronUpMd className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

/**
 * Scroll-down control for long Select lists.
 *
 * @param props - Radix Select scroll down button props.
 * @returns A scroll-down control element.
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <IconChevronDownMd className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

/**
 * Object containing all Select sub-components.
 * Exported as Select.Trigger, Select.Value, Select.Content etc.
 */
const SelectSubComponents = {
  Root: Select,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Label: SelectLabel,
  Item: SelectItem,
  Group: SelectGroup,
  Separator: SelectSeparator,
  ScrollUpButton: SelectScrollUpButton,
  ScrollDownButton: SelectScrollDownButton,
};

// Assign sub-components as properties
Select.Trigger = SelectSubComponents.Trigger;
Select.Value = SelectSubComponents.Value;
Select.Content = SelectSubComponents.Content;
Select.Label = SelectSubComponents.Label;
Select.Item = SelectSubComponents.Item;
Select.Group = SelectSubComponents.Group;
Select.Separator = SelectSubComponents.Separator;

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectGroup,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
