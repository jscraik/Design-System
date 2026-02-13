import { useCallback, useState } from "react";

/**
 * Describes inputs for a controlled/uncontrolled state hook.
 */
export interface ControllableStateOptions<T> {
  /**
   * Controlled value. When provided, the hook mirrors this value and does not
   * update internal state.
   */
  value?: T;
  /**
   * Initial value used only when `value` is undefined.
   */
  defaultValue: T;
  /**
   * Callback invoked whenever the next value is resolved.
   */
  onChange?: (next: T) => void;
}

/**
 * Sets the next value for controllable state.
 */
export type SetControllableState<T> = (next: T | ((prev: T) => T)) => void;

/**
 * Manages controlled or uncontrolled state and exposes a unified setter.
 *
 * @param options - Configuration for controlled vs uncontrolled usage.
 * @param options.value - Controlled value (optional).
 * @param options.defaultValue - Initial value for uncontrolled usage.
 * @param options.onChange - Called with the resolved next value.
 * @returns A tuple of `[value, setValue]`.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useControllableState({
 *   value: props.open,
 *   defaultValue: false,
 *   onChange: props.onOpenChange,
 * });
 * ```
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, SetControllableState<T>] {
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as T) : uncontrolledValue;

  const setValue = useCallback<SetControllableState<T>>(
    (next) => {
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(currentValue) : next;

      if (!isControlled) {
        setUncontrolledValue(resolved);
      }

      onChange?.(resolved);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue];
}
