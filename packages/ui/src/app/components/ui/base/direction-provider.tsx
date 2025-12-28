"use client";

import { DirectionProvider as RadixDirectionProvider } from "@radix-ui/react-direction";
import * as React from "react";

import { getDirection } from "../../../utils/rtl";

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

/**
 * DirectionProvider - Provides RTL/LTR direction context to components
 *
 * @example
 * ```tsx
 * <DirectionProvider locale="ar-SA">
 *   <App />
 * </DirectionProvider>
 * ```
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
 * Hook to access direction context
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
