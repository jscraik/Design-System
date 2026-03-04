import * as React from "react";
import type { SVGProps } from "react";
const Sad = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m10 3.5c-.886 0-1.835.319-2.933 1.074a1 1 0 0 1-1.134-1.648C9.258 14.015 10.597 13.5 12 13.5s2.742.515 4.067 1.426a1 1 0 0 1-1.134 1.648C13.835 15.819 12.886 15.5 12 15.5" /></svg>);
Sad.displayName = "Sad";
export default Sad;