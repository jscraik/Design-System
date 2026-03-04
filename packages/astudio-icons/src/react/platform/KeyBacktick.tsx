import * as React from "react";
import type { SVGProps } from "react";
const KeyBacktick = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 9-2 3 2 3M12 9l-2 3 2 3" /></svg>);
KeyBacktick.displayName = "KeyBacktick";
export default KeyBacktick;