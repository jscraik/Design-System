import * as React from "react";
import type { SVGProps } from "react";
const Error = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M9.441 4.271c1.17-1.914 3.95-1.914 5.12 0l7.434 12.165c1.221 1.999-.217 4.564-2.56 4.564H4.567c-2.343 0-3.781-2.565-2.56-4.564zM13 10a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0zm-.998 5.35a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3" /></svg>);
Error.displayName = "Error";
export default Error;