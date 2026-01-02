import * as React from "react";

import { cn } from "../../utils";

/**
 * Renders a styled input element.
 *
 * Accessibility contract:
 * - Provide a visible label or `aria-label`/`aria-labelledby`.
 *
 * @param props - Native input props.
 * @returns A styled input element.
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="name@company.com" />
 * ```
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "font-foundation text-body placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary selection:bg-foundation-accent-blue selection:text-foundation-text-light-primary border-foundation-bg-dark-3 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 bg-foundation-bg-dark-1 text-foundation-text-dark-primary transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-body-small file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-foundation-accent-blue focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50",
        "aria-invalid:border-foundation-accent-red aria-invalid:ring-2 aria-invalid:ring-foundation-accent-red/50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
