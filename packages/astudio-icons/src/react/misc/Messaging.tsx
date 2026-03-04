import * as React from "react";
import type { SVGProps } from "react";
const Messaging = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M4.023 12.17c-2.323-1.084-2.129-4.449.303-5.26l13.968-4.656c2.217-.739 4.326 1.37 3.588 3.588L17.225 19.81c-.81 2.432-4.176 2.626-5.26.303l-2.528-5.415zm9.656 7.143c.361.774 1.482.71 1.752-.1l4.587-13.758-8.732 8.732zM4.923 8.705c-.81.27-.874 1.39-.1 1.752L9.95 12.85l8.732-8.732z" /></svg>);
Messaging.displayName = "Messaging";
export default Messaging;