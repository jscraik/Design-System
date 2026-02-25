import * as React from "react";
import type { SVGProps } from "react";
const KeyControl = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" ref={ref} {...props}><rect width={32} height={32} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path fill="currentColor" d="M8 12h16v2h-6v2h6v2h-6v2h6v2H8v-2h6v-2H8v-2h6v-2H8z" /></svg>);
KeyControl.displayName = "KeyControl";
export default KeyControl;