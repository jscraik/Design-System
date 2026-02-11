import * as React from "react";
import type { SVGProps } from "react";
const KeyEnd = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}>
    <path fill="currentColor" d="m8 12 4-4h-2V4H6v4H4z" />
  </svg>
));
KeyEnd.displayName = "KeyEnd";
export default KeyEnd;
