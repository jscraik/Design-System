import * as React from "react";
import type { SVGProps } from "react";
const KeyCommand = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" ref={ref} {...props}><rect width={32} height={32} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path fill="currentColor" d="M7 13a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2h2v-2a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-2h-2a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2v-3a1 1 0 0 0-1-1zm10 1v3h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1zv3h-1v2h-2v-2h1v-3h1a1 1 0 0 1 1-1Zm-6 7a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2h-4z" /></svg>);
KeyCommand.displayName = "KeyCommand";
export default KeyCommand;