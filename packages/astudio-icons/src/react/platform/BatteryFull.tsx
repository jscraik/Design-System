import * as React from "react";
import type { SVGProps } from "react";
const BatteryFull = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={18} height={10} x={2} y={7} fill="currentColor" stroke="currentColor" strokeWidth={2} rx={2} /><rect width={2} height={4} x={22} y={10} fill="currentColor" rx={1} /></svg>);
BatteryFull.displayName = "BatteryFull";
export default BatteryFull;