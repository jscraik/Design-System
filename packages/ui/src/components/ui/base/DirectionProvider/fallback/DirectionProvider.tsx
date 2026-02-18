// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

import { DirectionProvider as RadixDirectionProvider } from "@radix-ui/react-direction";
import * as React from "react";

import { getDirection } from "../../../../../utils/rtl";

/**
 * Props for the direction provider.
 */
export interface DirectionProviderProps {
  /** The direction to use */
  dir?: "ltr" | "rtl";
  /** Locale to derive direction from (overridden by dir) */
  locale?: string;
  /** Children */
  children: React.ReactNode;
}

const DirectionContext = React.createContext<{
  dir: "ltr" | "rtl";
  isRTL: boolean;
}>({
  dir: "ltr",
  isRTL: false,
});
DirectionContext.displayName = "DirectionContext";

/**
 * Provides RTL/LTR direction context to components.
 *
 * `dir` takes precedence over `locale` when both are provided.
 *
 * @example
 * ```tsx
 * <DirectionProvider locale="ar-SA">
 *   <App />
 * </DirectionProvider>
 * ```
 *
 * @param props - Direction provider props.
 * @returns A direction provider element.
 */
function DirectionProvider({ dir, locale, children }: DirectionProviderProps) {
  const direction = dir ?? (locale ? getDirection(locale) : "ltr");
  const rtl = direction === "rtl";

  return (
    <DirectionContext.Provider value={{ dir: direction, isRTL: rtl }}>
      <RadixDirectionProvider dir={direction}>
        <div dir={direction} className="contents">
          {children}
        </div>
      </RadixDirectionProvider>
    </DirectionContext.Provider>
  );
}

/**
 * Returns the current direction context.
 *
 * @returns Direction and RTL boolean.
 */
function useDirection() {
  const context = React.useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }
  return context;
}

DirectionProvider.displayName = "DirectionProvider";

export { DirectionProvider, useDirection };
