/**
 * Development utilities for debugging and testing components.
 */

/**
 * Logs component props in development mode.
 *
 * @param componentName - Human-readable component label for the log group.
 * @param props - Props object to log.
 * @returns The original props, to enable inline usage.
 *
 * @example
 * ```ts
 * const loggedProps = logProps("Button", props);
 * ```
 */
export function logProps<T extends Record<string, unknown>>(componentName: string, props: T): T {
  if (process.env.NODE_ENV === "development") {
    console.group(`🔍 ${componentName} Props`);
    console.table(props);
    console.groupEnd();
  }
  return props;
}

/**
 * Measures render function timing in development mode.
 *
 * @param componentName - Human-readable label for timing output.
 * @param renderFn - Function to wrap and measure.
 * @returns The wrapped function in development, otherwise the original.
 *
 * @example
 * ```ts
 * const render = measureRender("Card", () => <Card />);
 * ```
 */
export function measureRender<T extends (...args: unknown[]) => unknown>(
  componentName: string,
  renderFn: T,
): T {
  if (process.env.NODE_ENV === "development") {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = renderFn(...args);
      const end = performance.now();
      console.log(`⏱️ ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
      return result;
    }) as T;
  }
  return renderFn;
}

/**
 * Logs mount/unmount events in development mode.
 *
 * @param componentName - Human-readable label for logs.
 * @param props - Optional props to log on mount.
 * @returns A cleanup function to call on unmount, or `undefined` in production.
 *
 * @example
 * ```ts
 * useEffect(() => useDebugLifecycle("Sidebar", props), [props]);
 * ```
 */
export function useDebugLifecycle(componentName: string, props?: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log(`🔄 ${componentName} mounted`, props);

    return () => {
      console.log(`🔄 ${componentName} unmounted`);
    };
  }
}

/**
 * Validates required props in development mode.
 *
 * @param componentName - Component label for error messages.
 * @param props - Props object to validate.
 * @param required - Keys that must be defined.
 *
 * @example
 * ```ts
 * validateProps("Badge", props, ["label"]);
 * ```
 */
export function validateProps<T extends Record<string, unknown>>(
  componentName: string,
  props: T,
  required: (keyof T)[],
): void {
  if (process.env.NODE_ENV === "development") {
    const missing = required.filter((key) => props[key] === undefined);
    if (missing.length > 0) {
      console.error(`❌ ${componentName}: Missing required props: ${missing.join(", ")}`);
    }
  }
}
