import * as React from "react";
import type { SVGProps } from "react";
const KeyDollar = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M12 6v12M9 9s0-2 3-2 3 2 3 2c0 2-6 2-6 4s6 2 6 0c0 0 0 4-3 4s-3-2-3-2" /></svg>);
KeyDollar.displayName = "KeyDollar";
export default KeyDollar;