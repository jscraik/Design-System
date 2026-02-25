import * as React from "react";
import type { SVGProps } from "react";
const Question = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><g fill="currentColor"><path d="M12 5c-1.58 0-2.836 1.007-3.155 2.162a1.5 1.5 0 1 1-2.891-.8C6.672 3.765 9.224 2 11.999 2c3.338 0 6.1 2.549 6.1 5.85 0 1.218-.24 2.27-.956 3.246-.654.889-1.627 1.598-2.768 2.34-.554.36-.876.952-.876 1.564a1.5 1.5 0 0 1-3 0c0-1.676.877-3.192 2.24-4.08 1.141-.741 1.689-1.196 1.986-1.6.234-.318.374-.688.374-1.47C15.1 6.344 13.824 5 12 5M13.75 20.25a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0" /></g></svg>);
Question.displayName = "Question";
export default Question;