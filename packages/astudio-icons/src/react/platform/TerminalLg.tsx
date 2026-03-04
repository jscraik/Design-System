import * as React from "react";
import type { SVGProps } from "react";
const TerminalLg = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M2.293 4.293a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414-1.414L8.586 12 2.293 5.707a1 1 0 0 1 0-1.414M12 19a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2h-8a1 1 0 0 1-1-1" /></svg>);
TerminalLg.displayName = "TerminalLg";
export default TerminalLg;