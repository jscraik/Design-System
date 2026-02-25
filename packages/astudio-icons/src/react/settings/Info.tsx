import * as React from "react";
import type { SVGProps } from "react";
const Info = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><g fill="currentColor"><path d="M13 12a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0z" /><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0" /><path d="M12 9.3A1.15 1.15 0 1 0 12 7a1.15 1.15 0 0 0 0 2.3" /></g></svg>);
Info.displayName = "Info";
export default Info;