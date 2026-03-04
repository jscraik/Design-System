import * as React from "react";
import type { SVGProps } from "react";
const Lock = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={18} height={11} x={3} y={11} stroke="currentColor" strokeWidth={2} rx={2} /><path stroke="currentColor" strokeWidth={2} d="M7 11V7a5 5 0 1 1 10 0v4" /></svg>);
Lock.displayName = "Lock";
export default Lock;