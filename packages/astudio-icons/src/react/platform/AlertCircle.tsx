import * as React from "react";
import type { SVGProps } from "react";
const AlertCircle = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2} /><path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M12 8v4m0 3v1" /></svg>);
AlertCircle.displayName = "AlertCircle";
export default AlertCircle;