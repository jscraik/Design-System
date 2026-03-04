import * as React from "react";
import type { SVGProps } from "react";
const Notification = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path stroke="currentColor" strokeLinejoin="round" strokeWidth={2} d="M12 2c-1.1 0-2 .9-2 2v.3c-1.5.6-2.5 2-2.9 3.7l-.6 3c-.3 1.5-1.5 2.7-3 3v2h17v-2c-1.5-.3-2.7-1.5-3-3l-.6-3c-.4-1.7-1.4-3.1-2.9-3.7V4c0-1.1-.9-2-2-2Z" /><path stroke="currentColor" strokeWidth={2} d="M9 16c0 1.7 1.3 3 3 3s3-1.3 3-3" /></svg>);
Notification.displayName = "Notification";
export default Notification;