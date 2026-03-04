import * as React from "react";
import type { SVGProps } from "react";
const Mic = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><g fill="currentColor"><path d="M18.995 11.542a1 1 0 0 1 .674 1.243A8.01 8.01 0 0 1 13 18.438V19.5h1.5a1 1 0 1 1 0 2h-5a1 1 0 1 1 0-2H11v-1.062a8.01 8.01 0 0 1-6.669-5.653 1 1 0 1 1 1.917-.57 6.003 6.003 0 0 0 11.504 0 1 1 0 0 1 1.243-.674" /><path fillRule="evenodd" d="M14.5 10.5V7a2.5 2.5 0 0 0-5 0v3.5a2.5 2.5 0 0 0 5 0m-2.5-8A4.5 4.5 0 0 0 7.5 7v3.5a4.5 4.5 0 1 0 9 0V7A4.5 4.5 0 0 0 12 2.5" clipRule="evenodd" /></g></svg>);
Mic.displayName = "Mic";
export default Mic;