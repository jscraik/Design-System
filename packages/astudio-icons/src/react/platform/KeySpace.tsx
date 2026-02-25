import * as React from "react";
import type { SVGProps } from "react";
const KeySpace = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" ref={ref} {...props}><rect width={32} height={32} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><rect width={24} height={8} x={4} y={12} fill="currentColor" rx={2} /></svg>);
KeySpace.displayName = "KeySpace";
export default KeySpace;