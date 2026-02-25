import * as React from "react";
import type { SVGProps } from "react";
const ChevronDown = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" /></svg>);
ChevronDown.displayName = "ChevronDown";
export default ChevronDown;