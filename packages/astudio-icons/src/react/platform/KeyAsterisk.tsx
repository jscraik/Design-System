import * as React from "react";
import type { SVGProps } from "react";
const KeyAsterisk = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M12 7v10M8 9l8 6m0-6-8 6" /></svg>);
KeyAsterisk.displayName = "KeyAsterisk";
export default KeyAsterisk;