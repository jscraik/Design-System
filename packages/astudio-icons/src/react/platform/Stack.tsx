import * as React from "react";
import type { SVGProps } from "react";
const Stack = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M4.949 4.683A2 2 0 0 1 6.454 4h11.092a2 2 0 0 1 1.505.683l3.5 4C23.683 9.976 22.765 12 21.046 12H2.954C1.235 12 .317 9.976 1.449 8.683zM17.546 6H6.454l-3.5 4h18.092zM2 15a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1m1 4a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1" /></svg>);
Stack.displayName = "Stack";
export default Stack;