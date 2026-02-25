import * as React from "react";
import type { SVGProps } from "react";
const KeyFn = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><text x={12} y={17} fill="currentColor" fontSize={12} fontWeight="bold" textAnchor="middle">{"fn"}</text></svg>);
KeyFn.displayName = "KeyFn";
export default KeyFn;