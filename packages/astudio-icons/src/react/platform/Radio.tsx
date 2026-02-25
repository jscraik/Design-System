import * as React from "react";
import type { SVGProps } from "react";
const Radio = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2} /></svg>);
Radio.displayName = "Radio";
export default Radio;