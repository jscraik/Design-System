import * as React from "react";
import type { SVGProps } from "react";
const KeyAmpersand = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 16c-2 0-3-2-3-3 0-2 2-4 3-4l4 6 2 1" /><circle cx={10} cy={10} r={2} stroke="currentColor" strokeWidth={1.5} /><circle cx={14} cy={15} r={2} stroke="currentColor" strokeWidth={1.5} /></svg>);
KeyAmpersand.displayName = "KeyAmpersand";
export default KeyAmpersand;