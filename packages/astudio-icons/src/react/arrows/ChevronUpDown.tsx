import * as React from "react";
import type { SVGProps } from "react";
const ChevronUpDown = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M11.342 4.747a1 1 0 0 1 1.316 0l4 3.5a1 1 0 0 1-1.317 1.506L12 6.829 8.658 9.753a1 1 0 1 1-1.317-1.506zm-4.096 9.61a1 1 0 0 1 1.41-.096L12 17.174l3.343-2.913a1 1 0 1 1 1.314 1.508l-4 3.485a1 1 0 0 1-1.314 0l-4-3.485a1 1 0 0 1-.097-1.411" /></svg>);
ChevronUpDown.displayName = "ChevronUpDown";
export default ChevronUpDown;