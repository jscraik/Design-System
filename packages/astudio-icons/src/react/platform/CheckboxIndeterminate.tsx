import * as React from "react";
import type { SVGProps } from "react";
const CheckboxIndeterminate = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={18} height={18} x={3} y={3} fill="currentColor" stroke="currentColor" strokeWidth={2} rx={4} /><path fill="#fff" d="M7 11h10v2H7z" /></svg>);
CheckboxIndeterminate.displayName = "CheckboxIndeterminate";
export default CheckboxIndeterminate;