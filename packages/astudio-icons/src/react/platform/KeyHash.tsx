import * as React from "react";
import type { SVGProps } from "react";
const KeyHash = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M7 8h10M7 12h10M7 16h10M9 7v10m6-10v10" /></svg>);
KeyHash.displayName = "KeyHash";
export default KeyHash;