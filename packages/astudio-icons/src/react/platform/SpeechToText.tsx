import * as React from "react";
import type { SVGProps } from "react";
const SpeechToText = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M6.5 3a1 1 0 0 1 1 1v12a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1m7.001 1a1 1 0 0 1 1 1v3.5a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1m-3.5 2a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V7a1 1 0 0 1 1-1M3 8a1 1 0 0 1 1 1v2A1 1 0 0 1 2 11V9a1 1 0 0 1 1-1m9.5 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1.556a1 1 0 0 1-2 0V13h-2v6h.5a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2h.5v-6h-2v.556a1 1 0 0 1-2 0z" /></svg>);
SpeechToText.displayName = "SpeechToText";
export default SpeechToText;