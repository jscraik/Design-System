import * as React from "react";
import type { SVGProps } from "react";
const KeyQuote = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10v4l1-1m6-3v4l1-1" /></svg>);
KeyQuote.displayName = "KeyQuote";
export default KeyQuote;