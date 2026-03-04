import * as React from "react";
import type { SVGProps } from "react";
const GptPlaceholder = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12.5 3.444a1 1 0 0 0-1 0l-6.253 3.61 6.768 3.807 6.955-3.682zm7.16 5.632L13 12.602v7.666l6.16-3.556a1 1 0 0 0 .5-.867zM11 20.268v-7.683L4.34 8.839v7.006a1 1 0 0 0 .5.867zm-.5-18.557a3 3 0 0 1 3 0l6.66 3.846a3 3 0 0 1 1.5 2.598v7.69a3 3 0 0 1-1.5 2.598L13.5 22.29a3 3 0 0 1-3 0l-6.66-3.846a3 3 0 0 1-1.5-2.598v-7.69a3 3 0 0 1 1.5-2.598z" /></svg>);
GptPlaceholder.displayName = "GptPlaceholder";
export default GptPlaceholder;