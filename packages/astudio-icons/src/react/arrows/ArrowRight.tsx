import * as React from "react";
import type { SVGProps } from "react";
const ArrowRight = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7 7 7-7 7" /></svg>);
ArrowRight.displayName = "ArrowRight";
export default ArrowRight;