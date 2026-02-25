import * as React from "react";
import type { SVGProps } from "react";
const TeamsIcon = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => <svg xmlns="http://www.w3.org/2000/svg" style={{
  flex: "none",
  lineHeight: 1
}} viewBox="0 0 24 24" ref={ref} {...props}><title>{"Microsoft Teams"}</title><path fill="#5B5FC7" d="M21 8.5A2.5 2.5 0 0 0 18.5 6h-4A2.5 2.5 0 0 0 12 8.5v7a2.5 2.5 0 0 0 2.5 2.5h4a2.5 2.5 0 0 0 2.5-2.5zM10.5 10.5A2.5 2.5 0 0 0 8 8H4a2.5 2.5 0 0 0-2.5 2.5v3A2.5 2.5 0 0 0 4 16h4a2.5 2.5 0 0 0 2.5-2.5z" /><circle cx={16.5} cy={12} r={1.5} fill="#fff" /><circle cx={6} cy={12} r={1} fill="#fff" /><path stroke="#fff" strokeLinecap="round" strokeWidth={1.5} d="M9 12h3" /></svg>);
TeamsIcon.displayName = "TeamsIcon";
export default TeamsIcon;