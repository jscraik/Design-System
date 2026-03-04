import * as React from "react";
import type { SVGProps } from "react";
const ArrowLeft = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7 7-7-7 7-7" /></svg>);
ArrowLeft.displayName = "ArrowLeft";
export default ArrowLeft;