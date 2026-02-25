import * as React from "react";
import type { SVGProps } from "react";
const ExpandMd = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M13 5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V7.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L16.586 6H14a1 1 0 0 1-1-1m-8 8a1 1 0 0 1 1 1v2.586l3.293-3.293a1 1 0 0 1 1.414 1.414L7.414 18H10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1" /></svg>);
ExpandMd.displayName = "ExpandMd";
export default ExpandMd;