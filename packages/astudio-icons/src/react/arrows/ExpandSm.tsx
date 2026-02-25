import * as React from "react";
import type { SVGProps } from "react";
const ExpandSm = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8h-3a1 1 0 0 1-1-1m-5 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1" /></svg>);
ExpandSm.displayName = "ExpandSm";
export default ExpandSm;