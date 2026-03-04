import * as React from "react";
import type { SVGProps } from "react";
const KeyCapsLock = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" ref={ref} {...props}><rect width={32} height={32} fill="#fff" stroke="currentColor" strokeWidth={2} rx={4} /><path fill="currentColor" d="M8 18v-4h2v-2h2v-2h2V8h4v2h2v2h2v2h2v4h-2v-2h-2v-2h-2v-2h-4v2h-2v2h-2v2zm2 2h12v2H10z" /></svg>);
KeyCapsLock.displayName = "KeyCapsLock";
export default KeyCapsLock;