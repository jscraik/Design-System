import * as React from "react";
import type { SVGProps } from "react";
const Profile = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" ref={ref} {...props}><path fill="currentColor" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m9.6-4.8a1 1 0 0 1 .2 1.4l-2.013 2.684 1.377.23a1 1 0 1 1-.328 1.972l-1.378-.23c-1.48-.246-2.17-1.972-1.271-3.172L10.2 7.4a1 1 0 0 1 1.4-.2m4.643 4.83a1 1 0 0 1 .727 1.213C16.33 15.805 13.826 17 12 17a1 1 0 1 1 0-2c1.174 0 2.67-.805 3.03-2.242a1 1 0 0 1 1.213-.728" /></svg>);
Profile.displayName = "Profile";
export default Profile;