import * as React from "react";
import type { SVGProps } from "react";
const KeyAt = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><circle cx={10} cy={13} r={3} stroke="currentColor" strokeWidth={1.5} /><path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M16 10v3c0 1 .5 2 1.5 2s1.5-1 1.5-2v-3M13 10v6" /></svg>);
KeyAt.displayName = "KeyAt";
export default KeyAt;