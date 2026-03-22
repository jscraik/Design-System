import * as React from "react";

import { Stack, type StackProps } from "../Stack/Stack";

interface FlexProps extends Omit<StackProps, "direction"> {
  /** Flex direction. Defaults to "row". */
  direction?: StackProps["direction"];
}

/**
 * Flex — horizontal flex layout primitive. Shorthand for Stack with direction="row".
 *
 * @example
 * ```tsx
 * <Flex gap="2" align="center" justify="between">
 *   <Icon />
 *   <Label>Settings</Label>
 * </Flex>
 * ```
 */
function Flex({ direction = "row", ...props }: FlexProps) {
  return <Stack data-slot="flex" direction={direction} {...props} />;
}

export { Flex };
export type { FlexProps };
