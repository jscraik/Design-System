import * as React from "react";
import type { SVGProps } from "react";
const AvatarFilled = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m3 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-3 5c2.282 0 4.333.991 5.745 2.567A7.98 7.98 0 0 1 12 20a7.98 7.98 0 0 1-5.746-2.434A7.7 7.7 0 0 1 11.999 15" /></svg>);
AvatarFilled.displayName = "AvatarFilled";
export default AvatarFilled;