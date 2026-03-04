import * as React from "react";
import type { SVGProps } from "react";
const KeyPercent = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><circle cx={9} cy={9} r={1.5} fill="currentColor" /><circle cx={15} cy={15} r={1.5} fill="currentColor" /><path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="m15 9-6 6" /></svg>);
KeyPercent.displayName = "KeyPercent";
export default KeyPercent;