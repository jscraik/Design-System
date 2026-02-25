import * as React from "react";
import type { SVGProps } from "react";
const UserAdd = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6M7 7a5 5 0 1 1 10 0A5 5 0 0 1 7 7m5 8a6.5 6.5 0 0 0-6.486 6.066 1 1 0 1 1-1.995-.132 8.5 8.5 0 0 1 9.613-7.86 1 1 0 0 1-.264 1.983A7 7 0 0 0 12 15m6-1a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1" /></svg>);
UserAdd.displayName = "UserAdd";
export default UserAdd;