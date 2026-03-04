import * as React from "react";
import type { SVGProps } from "react";
const KeyQuestion = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><rect width={24} height={24} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M9 10q0-3 3-3t3 3q0 1.5-3 3v1m0 2v1" /></svg>);
KeyQuestion.displayName = "KeyQuestion";
export default KeyQuestion;