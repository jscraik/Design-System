import * as React from "react";
import type { SVGProps } from "react";
const Close = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 6 6 18M6 6l12 12" /></svg>);
Close.displayName = "Close";
export default Close;