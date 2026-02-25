import * as React from "react";
import type { SVGProps } from "react";
const MicrosoftIcon = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" style={{
  flex: "none",
  lineHeight: 1
}} viewBox="0 0 24 24" ref={ref} {...props}><title>{"Microsoft"}</title><path fill="#F25022" d="M11.49 2H2v9.492h9.492V2z" /><path fill="#7FBA00" d="M22 2h-9.492v9.492H22z" /><path fill="#00A4EF" d="M11.49 12.508H2V22h9.492v-9.492z" /><path fill="#FFB900" d="M22 12.508h-9.492V22H22z" /></svg>);
MicrosoftIcon.displayName = "MicrosoftIcon";
export default MicrosoftIcon;