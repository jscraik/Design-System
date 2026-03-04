import * as React from "react";
import type { SVGProps } from "react";
const Reply = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M5.333 5.667a1 1 0 0 1 1 1c0 .945 0 1.604.036 2.12.035.507.1.802.193 1.028a3 3 0 0 0 1.623 1.623c.226.094.52.158 1.028.193.516.035 1.175.036 2.12.036h4.92L13.96 9.374a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414l2.293-2.293h-4.955c-.902 0-1.63 0-2.221-.04-.61-.042-1.147-.13-1.657-.34a5 5 0 0 1-2.706-2.707c-.211-.51-.299-1.048-.34-1.657-.04-.592-.04-1.32-.04-2.22v-.036a1 1 0 0 1 1-1" /></svg>);
Reply.displayName = "Reply";
export default Reply;