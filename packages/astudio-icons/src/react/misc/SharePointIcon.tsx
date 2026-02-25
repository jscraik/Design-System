import * as React from "react";
import type { SVGProps } from "react";
const SharePointIcon = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" style={{
  flex: "none",
  lineHeight: 1
}} viewBox="0 0 24 24" ref={ref} {...props}><title>{"SharePoint"}</title><path fill="#0078D4" d="M21.5 7.5A2.5 2.5 0 0 0 19 5h-4.5A2.5 2.5 0 0 0 12 7.5v9a2.5 2.5 0 0 0 2.5 2.5H19a2.5 2.5 0 0 0 2.5-2.5zM10.5 9.5A2.5 2.5 0 0 0 8 7H3.5A2.5 2.5 0 0 0 1 9.5v5A2.5 2.5 0 0 0 3.5 17H8a2.5 2.5 0 0 0 2.5-2.5z" /><circle cx={17} cy={12} r={2} fill="#fff" /><circle cx={6} cy={12} r={1.5} fill="#fff" /></svg>);
SharePointIcon.displayName = "SharePointIcon";
export default SharePointIcon;