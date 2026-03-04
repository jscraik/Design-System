import * as React from "react";
import type { SVGProps } from "react";
const KeyShift = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" ref={ref} {...props}><rect width={32} height={32} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path fill="currentColor" d="M9 20v-8l7-6 7 6v8h-3v-5h-8v5z" /></svg>);
KeyShift.displayName = "KeyShift";
export default KeyShift;