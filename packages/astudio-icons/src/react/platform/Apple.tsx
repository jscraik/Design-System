import * as React from "react";
import type { SVGProps } from "react";
const Apple = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" ref={ref} {...props}><path d="M15.5 13.5s.3 2.2 2 2.5c0 0-1.7 5-4 5-1 0-1.5-.5-2.3-.5-.9 0-1.7.5-2.4.5-2.6 0-5.3-4.8-5.3-8.5C3.5 9.5 5.3 8 7 8c1 0 2 .5 2.7.5.6 0 1.8-.5 3.1-.5.9 0 3.5.2 4.7 3 0 0-2 .8-2 2.5m-2.7-7.7s.5-1.5 1.7-2.3c1-.7 2.3-.5 2.5-.5 0 0 0 1.3-1 2.5s-2.2 1-2.5 1c-.2 0-.7-.3-.7-.7" /></svg>);
Apple.displayName = "Apple";
export default Apple;