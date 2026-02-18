import * as React from "react";
import type { SVGProps } from "react";
const ArrowUp = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
  </svg>
));
ArrowUp.displayName = "ArrowUp";
export default ArrowUp;
