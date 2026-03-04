import * as React from "react";
import type { SVGProps } from "react";
const CollapseSm = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><g fill="currentColor"><path d="M5 14a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-3H6a1 1 0 0 1-1-1M14 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1" /></g></svg>);
CollapseSm.displayName = "CollapseSm";
export default CollapseSm;