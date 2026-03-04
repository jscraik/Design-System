import * as React from "react";
import type { SVGProps } from "react";
const KeyBackspace = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" ref={ref} {...props}><rect width={32} height={32} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path fill="currentColor" d="M22 10h-8l-4 4-3 2 3 2h12zM9 16l2-1.5L9 13z" /></svg>);
KeyBackspace.displayName = "KeyBackspace";
export default KeyBackspace;