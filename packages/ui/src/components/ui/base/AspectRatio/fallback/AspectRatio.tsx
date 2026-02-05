// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import type * as React from "react";

/**
 * Renders an aspect ratio container (Radix Aspect Ratio).
 *
 * @param props - Radix aspect ratio root props.
 * @returns An aspect ratio element.
 */
function AspectRatio({ ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
