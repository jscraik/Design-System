import * as React from "react";
import type { SVGProps } from "react";
const Code = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m8 9-3 3 3 3M16 9l3 3-3 3M12 7l-2 10" /></svg>);
Code.displayName = "Code";
export default Code;