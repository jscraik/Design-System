import * as React from "react";
import type { SVGProps } from "react";
const CanvaIcon = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" style={{
  flex: "none",
  lineHeight: 1
}} viewBox="0 0 24 24" ref={ref} {...props}><title>{"Canva"}</title><path fill="#00C4CC" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.568 14.794c-.478 1.196-1.315 2.157-2.4 2.757A3.6 3.6 0 0 1 13.44 18a3.6 3.6 0 0 1-1.728-.449c-1.085-.6-1.922-1.561-2.4-2.757q-.359-.897-.359-1.914c0-1.017.12-1.316.359-1.914.478-1.196 1.315-2.157 2.4-2.757a3.6 3.6 0 0 1 1.728-.449 3.6 3.6 0 0 1 1.728.449c1.085.6 1.922 1.561 2.4 2.757q.359.897.359 1.914c0 1.017-.12 1.316-.359 1.914" /><path fill="#7B68EE" d="M15.84 12.88c0 .8-.32 1.52-.88 2.08s-1.28.88-2.08.88-1.52-.32-2.08-.88-.88-1.28-.88-2.08.32-1.52.88-2.08 1.28-.88 2.08-.88 1.52.32 2.08.88.88 1.28.88 2.08" /></svg>);
CanvaIcon.displayName = "CanvaIcon";
export default CanvaIcon;