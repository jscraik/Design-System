import * as React from "react";
import type { SVGProps } from "react";
const BadgeFilled = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" ref={ref} {...props}><path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" /></svg>);
BadgeFilled.displayName = "BadgeFilled";
export default BadgeFilled;