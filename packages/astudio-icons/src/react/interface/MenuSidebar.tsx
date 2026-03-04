import * as React from "react";
import type { SVGProps } from "react";
const MenuSidebar = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M4 4a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1m11.707 2.293a1 1 0 0 1 0 1.414L12.414 11H20a1 1 0 1 1 0 2h-7.586l3.293 3.293a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0" /></svg>);
MenuSidebar.displayName = "MenuSidebar";
export default MenuSidebar;