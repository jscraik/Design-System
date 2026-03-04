import * as React from "react";
import type { SVGProps } from "react";
const Avatar = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 4a8 8 0 0 0-5.562 13.75A6.99 6.99 0 0 1 12 15a6.99 6.99 0 0 1 5.562 2.75A8 8 0 0 0 12 4m3.963 14.95A5 5 0 0 0 12 17a5 5 0 0 0-3.963 1.95A7.96 7.96 0 0 0 12 20a7.96 7.96 0 0 0 3.963-1.05M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m10-4a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0" /></svg>);
Avatar.displayName = "Avatar";
export default Avatar;