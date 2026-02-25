import * as React from "react";
import type { SVGProps } from "react";
const Smile = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m5.4 2.201a1 1 0 0 1 1.4.199c1.57 2.09 4.83 2.09 6.4 0a1 1 0 0 1 1.6 1.201c-2.371 3.155-7.229 3.155-9.6 0a1 1 0 0 1 .2-1.4" /></svg>);
Smile.displayName = "Smile";
export default Smile;