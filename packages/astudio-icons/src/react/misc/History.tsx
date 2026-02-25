import * as React from "react";
import type { SVGProps } from "react";
const History = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" fillRule="evenodd" d="M4 6V4.5a1 1 0 0 0-2 0V9a1 1 0 0 0 1 1h4a1 1 0 0 0 0-2H5.07a8 8 0 1 1-.872 5.779 1 1 0 0 0-1.95.442C3.258 18.675 7.24 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2a9.99 9.99 0 0 0-8 4m8 0a1 1 0 0 1 1 1v5a1 1 0 0 1-.293.707l-2.5 2.5a1 1 0 0 1-1.414-1.414L11 11.586V7a1 1 0 0 1 1-1" clipRule="evenodd" /></svg>);
History.displayName = "History";
export default History;