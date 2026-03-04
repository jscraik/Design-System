import * as React from "react";
import type { SVGProps } from "react";
const KeyEnter = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 16h8l3-3m-3 3 3-3m0 0V9" /></svg>);
KeyEnter.displayName = "KeyEnter";
export default KeyEnter;