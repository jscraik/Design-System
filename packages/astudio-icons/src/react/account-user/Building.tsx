import * as React from "react";
import type { SVGProps } from "react";
const Building = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M3 6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h3a3 3 0 0 1 3 3v9h1a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2h1zm2 13h3v-2a1 1 0 1 1 2 0v2h3V6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1zm10 0h4v-9a1 1 0 0 0-1-1h-3z" /></svg>);
Building.displayName = "Building";
export default Building;