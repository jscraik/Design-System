import * as React from "react";
import type { SVGProps } from "react";
const RefreshCw = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path stroke="currentColor" strokeWidth={2} d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M16 12a4 4 0 1 1-4-4c1.657 0 3.069.863 3.857 2.171" /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7v3h-3" /></svg>);
RefreshCw.displayName = "RefreshCw";
export default RefreshCw;