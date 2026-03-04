import * as React from "react";
import type { SVGProps } from "react";
const User = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6M7 7a5 5 0 1 1 10 0A5 5 0 0 1 7 7m5 8c-3.656 0-6.5 2.75-6.5 6a1 1 0 1 1-2 0c0-4.482 3.872-8 8.5-8s8.5 3.518 8.5 8a1 1 0 1 1-2 0c0-3.25-2.844-6-6.5-6" /></svg>);
User.displayName = "User";
export default User;