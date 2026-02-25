import * as React from "react";
import type { SVGProps } from "react";
const Undo = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M8.707 2.293a1 1 0 0 1 0 1.414L6.414 6H14a7 7 0 1 1 0 14h-4a1 1 0 1 1 0-2h4a5 5 0 0 0 0-10H6.414l2.293 2.293a1 1 0 1 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0" /></svg>);
Undo.displayName = "Undo";
export default Undo;