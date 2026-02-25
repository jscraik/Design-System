import * as React from "react";
import type { SVGProps } from "react";
const LightBulb = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 3.625c3.326 0 6.031 2.712 6.031 6.067a6.07 6.07 0 0 1-2.698 5.058H8.667A6.07 6.07 0 0 1 5.97 9.692c0-3.355 2.705-6.067 6.031-6.067m2.624 13.125v.813H9.376v-.813zm-1.112 2.813a1.81 1.81 0 0 1-3.024 0zM8.32 19.56a3.814 3.814 0 0 0 7.36 0 1 1 0 0 0 .944-.998v-2.274a8.07 8.07 0 0 0 3.407-6.597c0-4.45-3.59-8.067-8.031-8.067-4.44 0-8.031 3.617-8.031 8.067a8.07 8.07 0 0 0 3.407 6.597v2.273a1 1 0 0 0 .944.999" /></svg>);
LightBulb.displayName = "LightBulb";
export default LightBulb;