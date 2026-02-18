import * as React from "react";
import type { SVGProps } from "react";
const Wifi = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}>
    <path
      fill="currentColor"
      d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-4c2.8 0 5.3 1.2 7.1 3.1l-1.4 1.4c-1.4-1.4-3.4-2.3-5.7-2.3s-4.3.9-5.7 2.3l-1.4-1.4C6.7 15.2 9.2 14 12 14m0-4c3.7 0 7.1 1.3 9.8 3.6L20.4 15c-2.3-2-5.2-3.1-8.4-3.1S5.9 13 3.6 15l-1.4-1.4C4.9 11.3 8.3 10 12 10m0-4c4.6 0 8.9 1.5 12.5 4.1l-1.4 1.4c-3.2-2.3-7-3.6-11.1-3.6S4.1 9.2.9 11.5l-1.4-1.4C3.1 7.5 7.4 6 12 6"
    />
  </svg>
));
Wifi.displayName = "Wifi";
export default Wifi;
