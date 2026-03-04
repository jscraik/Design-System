import * as React from "react";
import type { SVGProps } from "react";
const Operator = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m0 2.004c-1.475 0-2.853.4-4.036 1.095q.511-.077 1.045-.078a6.99 6.99 0 0 1 6.987 6.988.99.99 0 1 1-1.98 0 5.009 5.009 0 0 0-9.986-.545q-.02.276-.021.557A7.96 7.96 0 0 0 12 19.998c1.468 0 2.84-.394 4.02-1.08A6.989 6.989 0 0 1 8 12.005a.99.99 0 0 1 1.98 0 5.009 5.009 0 0 0 10.014.104q.001-.054.003-.109A7.98 7.98 0 0 0 12 4.004" /></svg>);
Operator.displayName = "Operator";
export default Operator;