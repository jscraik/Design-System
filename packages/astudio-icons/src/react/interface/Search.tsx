import * as React from "react";
import type { SVGProps } from "react";
const Search = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" fillRule="evenodd" d="M10.875 4.5a6.375 6.375 0 1 0 0 12.75 6.375 6.375 0 0 0 0-12.75M2.5 10.875a8.375 8.375 0 1 1 14.962 5.173l3.745 3.745a1 1 0 0 1-1.414 1.414l-3.745-3.745A8.375 8.375 0 0 1 2.5 10.875" clipRule="evenodd" /></svg>);
Search.displayName = "Search";
export default Search;