import * as React from "react";
import type { SVGProps } from "react";
const KeyReturn = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" ref={ref} {...props}><rect width={32} height={32} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path fill="currentColor" d="M8 10v6a4 4 0 0 0 4 4h10v-2H12a2 2 0 0 1-2-2v-6zm14 0v4h2v-4zm-3 2 3-2-3-2z" /></svg>);
KeyReturn.displayName = "KeyReturn";
export default KeyReturn;