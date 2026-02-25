import * as React from "react";
import type { SVGProps } from "react";
const ShieldChecked = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth={2} d="M12 2 3 5v6c0 5.5 3.8 10.5 9 12 5.2-1.5 9-6.5 9-12V5z" /><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 12 3 3 5-6" /></svg>);
ShieldChecked.displayName = "ShieldChecked";
export default ShieldChecked;