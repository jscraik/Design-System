import * as React from "react";
import type { SVGProps } from "react";
const Redo = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M15.293 2.293a1 1 0 0 0 0 1.414L17.586 6H10a7 7 0 0 0 0 14h4a1 1 0 1 0 0-2h-4a5 5 0 0 1 0-10h7.586l-2.293 2.293a1 1 0 0 0 1.414 1.414l4-4a1 1 0 0 0 0-1.414l-4-4a1 1 0 0 0-1.414 0" /></svg>);
Redo.displayName = "Redo";
export default Redo;