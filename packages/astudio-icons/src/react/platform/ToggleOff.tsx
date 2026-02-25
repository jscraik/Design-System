import * as React from "react";
import type { SVGProps } from "react";
const ToggleOff = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 44 24" ref={ref} {...props}><rect width={40} height={20} x={2} y={2} stroke="currentColor" strokeWidth={2} rx={10} /><circle cx={12} cy={12} r={8} fill="currentColor" /></svg>);
ToggleOff.displayName = "ToggleOff";
export default ToggleOff;