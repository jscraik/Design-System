import * as React from "react";
import type { SVGProps } from "react";
const PlusComposer = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 3.6c.59 0 1.067.478 1.067 1.067v6.266h6.266a1.067 1.067 0 0 1 0 2.134h-6.266v6.266a1.067 1.067 0 0 1-2.134 0v-6.266H4.667a1.067 1.067 0 0 1 0-2.134h6.266V4.667c0-.59.478-1.067 1.067-1.067" /></svg>);
PlusComposer.displayName = "PlusComposer";
export default PlusComposer;