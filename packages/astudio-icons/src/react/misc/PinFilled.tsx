import * as React from "react";
import type { SVGProps } from "react";
const PinFilled = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12.864 3.26a3.01 3.01 0 0 1 4.576-.378l3.678 3.678a3.01 3.01 0 0 1-.378 4.576l-4.261 3.044c-.315.225-.479.55-.479.82v2.5c0 1.407-.96 2.451-2.024 2.91-1.071.462-2.497.437-3.52-.586l-2.433-2.433-4.316 4.316a1 1 0 1 1-1.414-1.414l4.316-4.316-2.433-2.434c-1.023-1.022-1.048-2.447-.586-3.519C4.049 8.959 5.093 8 6.5 8H9c.27 0 .595-.164.82-.479z" /></svg>);
PinFilled.displayName = "PinFilled";
export default PinFilled;