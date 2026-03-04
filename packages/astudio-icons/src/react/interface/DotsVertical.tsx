import * as React from "react";
import type { SVGProps } from "react";
const DotsVertical = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 21a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0-7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0-7a2 2 0 1 1 0-4 2 2 0 0 1 0 4" /></svg>);
DotsVertical.displayName = "DotsVertical";
export default DotsVertical;