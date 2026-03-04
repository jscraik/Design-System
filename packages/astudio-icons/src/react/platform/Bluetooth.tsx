import * as React from "react";
import type { SVGProps } from "react";
const Bluetooth = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 2 7 7v3l5-5 5 5V7zM7 14v3l5 5 5-5v-3l-5 5zm5-9-5 5v4l5 5 5-5v-4z" /><path stroke="#fff" strokeLinecap="round" strokeWidth={1.5} d="m7 10 10 4m0-4L7 14" /></svg>);
Bluetooth.displayName = "Bluetooth";
export default Bluetooth;