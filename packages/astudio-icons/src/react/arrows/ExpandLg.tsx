import * as React from "react";
import type { SVGProps } from "react";
const ExpandLg = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M13 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6.414l-3.793 3.793a1 1 0 0 1-1.414-1.414L17.586 5H14a1 1 0 0 1-1-1m-9 9a1 1 0 0 1 1 1v3.586l3.793-3.793a1 1 0 0 1 1.414 1.414L6.414 19H10a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1" /></svg>);
ExpandLg.displayName = "ExpandLg";
export default ExpandLg;