import * as React from "react";
import type { SVGProps } from "react";
const RadioChecked = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><circle cx={12} cy={12} r={9} fill="currentColor" stroke="currentColor" strokeWidth={2} /><circle cx={12} cy={12} r={4} fill="#fff" /></svg>);
RadioChecked.displayName = "RadioChecked";
export default RadioChecked;