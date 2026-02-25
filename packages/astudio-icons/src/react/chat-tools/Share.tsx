import * as React from "react";
import type { SVGProps } from "react";
const Share = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M18 18a2 2 0 1 0-4 0 2 2 0 0 0 4 0M8 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0m10-6a2 2 0 1 0-4 0 2 2 0 0 0 4 0m2 0a4 4 0 0 1-6.668 2.98l-3.099 2.067-.088.052a1 1 0 0 1-.229.086 4 4 0 0 1 0 1.63q.117.028.229.086l.088.052 3.099 2.067a4 4 0 1 1-1.11 1.664l-3.099-2.067-.061-.045a4 4 0 1 1 0-5.146q.03-.023.061-.043l3.1-2.068A4 4 0 1 1 20 6" /></svg>);
Share.displayName = "Share";
export default Share;