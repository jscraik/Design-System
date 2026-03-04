import * as React from "react";
import type { SVGProps } from "react";
const Clock = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m10-6a1 1 0 0 1 1 1v5a1 1 0 0 1-.293.707l-2.5 2.5a1 1 0 0 1-1.414-1.414L11 11.586V7a1 1 0 0 1 1-1" /></svg>);
Clock.displayName = "Clock";
export default Clock;