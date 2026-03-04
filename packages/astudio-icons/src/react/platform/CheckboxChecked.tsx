import * as React from "react";
import type { SVGProps } from "react";
const CheckboxChecked = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={18} height={18} x={3} y={3} fill="currentColor" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 12 3 3 5-6" /></svg>);
CheckboxChecked.displayName = "CheckboxChecked";
export default CheckboxChecked;