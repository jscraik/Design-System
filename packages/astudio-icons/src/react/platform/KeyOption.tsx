import * as React from "react";
import type { SVGProps } from "react";
const KeyOption = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" ref={ref} {...props}><rect width={32} height={32} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path fill="currentColor" d="M16 8s-4 4-4 8 4 8 4 8 4-4 4-8-4-8-4-8m0 2s-2 3-2 6 2 6 2 6 2-3 2-6-2-6-2-6" /></svg>);
KeyOption.displayName = "KeyOption";
export default KeyOption;