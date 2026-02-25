import * as React from "react";
import type { SVGProps } from "react";
const KeyCaret = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 10 5 5 5-5" /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 14 5 5 5-5" /></svg>);
KeyCaret.displayName = "KeyCaret";
export default KeyCaret;