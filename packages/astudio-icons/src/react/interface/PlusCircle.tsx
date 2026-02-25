import * as React from "react";
import type { SVGProps } from "react";
const PlusCircle = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.5} /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v8m-4-4h8" /></svg>);
PlusCircle.displayName = "PlusCircle";
export default PlusCircle;