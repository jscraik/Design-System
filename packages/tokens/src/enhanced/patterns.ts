/**
 * @design-studio/tokens - Component State Patterns
 *
 * Consistent state interface for all form and interactive components.
 * Inspired by Geist design system's state management approach.
 *
 * States:
 * - default: Normal state
 * - hover: Mouse hover
 * - active: Mouse button down
 * - focus: Keyboard focus
 * - disabled: Disabled state
 * - error: Error state
 * - loading: Loading state
 * - checked: Checked state (for Checkbox, RadioGroup, Switch)
 * - unchecked: Unchecked state (for Checkbox, RadioGroup, Switch)
 *
 * NOTE: State styles are implemented inline in components using Apps SDK UI tokens.
 * This file only exports the type definitions and StatefulComponentProps interface.
 */

/**
 * State type
 */
export type ComponentState =
  | "default"
  | "hover"
  | "active"
  | "focus"
  | "disabled"
  | "error"
  | "loading"
  | "checked"
  | "unchecked"
  | "indeterminate";

/**
 * Helper to build component class name with state
 *
 * Usage: withState("input", "error") => "input input--error"
 */
export function withState(baseClass: string, state: ComponentState): string {
  return `${baseClass} ${baseClass}--${state}`;
}

/**
 * Props interface for components with state
 *
 * Based on user's Radix UI analysis, all form components should support:
 * - error: Error state with message
 * - loading: Loading state
 * - disabled: Disabled state
 * - required: Required field indicator (from user analysis)
 */
export interface StatefulComponentProps {
  /**
   * Error state
   */
  error?: string;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Required field indicator
   * Shows an asterisk or other visual indicator that the field is required
   */
  required?: boolean;
  /**
   * State change callback
   */
  onStateChange?: (state: ComponentState) => void;
}

/**
 * Form state styles for common states
 */
export const formStateStyles = {
  error: "border-status-error focus:border-status-error focus:ring-status-error",
  loading: "opacity-70 cursor-wait",
  disabled: "opacity-50 cursor-not-allowed",
  required: "after:content-['*'] after:ml-1 after:text-status-error",
} as const;

/**
 * Error state styles
 */
export const errorStyles = {
  border: "border-status-error",
  text: "text-status-error",
  bg: "bg-status-error-muted/10 dark:bg-status-error-muted/20",
} as const;

/**
 * Loading state styles
 */
export const loadingStyles = {
  spinner: "animate-spin",
  skeleton: "animate-pulse",
  overlay: "bg-black/50 backdrop-blur-sm",
} as const;

/**
 * State transitions for smooth state changes
 */
export const stateTransitions = {
  hover: "transition-colors duration-150 ease-out",
  focus: "transition-shadow duration-150 ease-out",
  enter: "transition-all duration-200 ease-out",
  exit: "transition-all duration-150 ease-in",
} as const;

/**
 * Helper to get state styles for a component
 */
export function getStateStyles(state: ComponentState): string {
  switch (state) {
    case "error":
      return formStateStyles.error;
    case "loading":
      return formStateStyles.loading;
    case "disabled":
      return formStateStyles.disabled;
    default:
      return "";
  }
}
