import * as React from "react";
import type { SVGProps } from "react";
const Chat = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 4.5c-4.473 0-8 3.41-8 7.5 0 1.696.6 3.263 1.62 4.525a1 1 0 0 1 .206.814 15 15 0 0 1-.37 1.501 15 15 0 0 0 1.842-.4 1 1 0 0 1 .745.08A8.4 8.4 0 0 0 12 19.5c4.473 0 8-3.41 8-7.5s-3.527-7.5-8-7.5M2 12c0-5.3 4.532-9.5 10-9.5S22 6.7 22 12s-4.532 9.5-10 9.5c-1.63 0-3.174-.371-4.539-1.032a18 18 0 0 1-3.4.53 1 1 0 0 1-.995-1.357c.29-.755.534-1.496.704-2.242A9.14 9.14 0 0 1 2 12" /></svg>);
Chat.displayName = "Chat";
export default Chat;