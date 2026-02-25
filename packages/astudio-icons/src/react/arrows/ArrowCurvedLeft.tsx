import * as React from "react";
import type { SVGProps } from "react";
const ArrowCurvedLeft = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" style={{
  transform: "rotate(180deg) scaleY(-1)"
}} viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M5 6a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h9.586l-2.293-2.293a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 14H7a3 3 0 0 1-3-3V7a1 1 0 0 1 1-1" /></svg>);
ArrowCurvedLeft.displayName = "ArrowCurvedLeft";
export default ArrowCurvedLeft;