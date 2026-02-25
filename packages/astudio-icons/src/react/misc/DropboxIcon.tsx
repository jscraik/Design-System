import * as React from "react";
import type { SVGProps } from "react";
const DropboxIcon = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" style={{
  flex: "none",
  lineHeight: 1
}} viewBox="0 0 24 24" ref={ref} {...props}><title>{"Dropbox"}</title><path fill="#0061FF" d="M6 1.807 0 5.629l6 3.822 6-3.822zm12 0-6 3.822 6 3.822 6-3.822zM0 13.274l6 3.822 6-3.822-6-3.822zm18 0-6 3.822 6 3.822 6-3.822zM6 18.371l6 3.822 6-3.822-6-3.822z" /></svg>);
DropboxIcon.displayName = "DropboxIcon";
export default DropboxIcon;