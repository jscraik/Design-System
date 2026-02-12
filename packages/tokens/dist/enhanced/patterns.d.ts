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
export type ComponentState = "default" | "hover" | "active" | "focus" | "disabled" | "error" | "loading" | "checked" | "unchecked" | "indeterminate";
/**
 * Helper to build component class name with state
 *
 * Usage: withState("input", "error") => "input input--error"
 */
export declare function withState(baseClass: string, state: ComponentState): string;
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
export declare const formStateStyles: {
    readonly error: "border-status-error focus:border-status-error focus:ring-status-error";
    readonly loading: "opacity-70 cursor-wait";
    readonly disabled: "opacity-50 cursor-not-allowed";
    readonly required: "after:content-['*'] after:ml-1 after:text-status-error";
};
/**
 * Error state styles
 */
export declare const errorStyles: {
    readonly border: "border-status-error";
    readonly text: "text-status-error";
    readonly bg: "bg-status-error-muted/10 dark:bg-status-error-muted/20";
};
/**
 * Loading state styles
 */
export declare const loadingStyles: {
    readonly spinner: "animate-spin";
    readonly skeleton: "animate-pulse";
    readonly overlay: "bg-black/50 backdrop-blur-sm";
};
/**
 * State transitions for smooth state changes
 */
export declare const stateTransitions: {
    readonly hover: "transition-colors duration-150 ease-out";
    readonly focus: "transition-shadow duration-150 ease-out";
    readonly enter: "transition-all duration-200 ease-out";
    readonly exit: "transition-all duration-150 ease-in";
};
/**
 * Helper to get state styles for a component
 */
export declare function getStateStyles(state: ComponentState): string;
//# sourceMappingURL=patterns.d.ts.map