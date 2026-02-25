import * as React from "react";
import type { SVGProps } from "react";
const Play = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><g fill="currentColor"><path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12" /><path d="M9.5 14.668V9.332a1 1 0 0 1 1.54-.842l4.152 2.669a1 1 0 0 1 0 1.682L11.04 15.51a1 1 0 0 1-1.541-.842" /></g></svg>);
Play.displayName = "Play";
export default Play;