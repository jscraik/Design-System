import * as React from "react";
import type { SVGProps } from "react";
const EyeOff = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m3 3 18 18M10.477 10.48a3 3 0 0 0 4.243 4.243" /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.228 6.228C4.657 7.45 3.521 9.053 2.457 11.084a1.01 1.01 0 0 0 0 .832C3.423 16.49 7.36 19.5 12 19.5c1.707 0 3.315-.318 4.778-.883M9.88 4.698A9.5 9.5 0 0 1 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639a12 12 0 0 1-2.124 3.399" /></svg>);
EyeOff.displayName = "EyeOff";
export default EyeOff;