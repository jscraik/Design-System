import * as React from "react";
import type { SVGProps } from "react";
const Compass = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m14.207-4.207a1 1 0 0 1 .258.97l-1.5 5.5a1 1 0 0 1-.702.702l-5.5 1.5a1 1 0 0 1-1.228-1.228l1.5-5.5a1 1 0 0 1 .702-.702l5.5-1.5a1 1 0 0 1 .97.258m-5.393 3.021-.889 3.26 3.26-.888.89-3.26z" /></svg>);
Compass.displayName = "Compass";
export default Compass;