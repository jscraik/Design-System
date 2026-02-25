import * as React from "react";
import type { SVGProps } from "react";
const ChevronDownUp = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><g fill="currentColor"><path d="M8.659 5.747A1 1 0 1 0 7.34 7.253l4 3.5a1 1 0 0 0 1.318 0l4-3.5a1 1 0 0 0-1.317-1.506L12 8.671zM12.659 13.247a1 1 0 0 0-1.318 0l-4 3.5a1 1 0 0 0 1.318 1.506L12 15.329l3.342 2.924a1 1 0 0 0 1.316-1.506z" /></g></svg>);
ChevronDownUp.displayName = "ChevronDownUp";
export default ChevronDownUp;