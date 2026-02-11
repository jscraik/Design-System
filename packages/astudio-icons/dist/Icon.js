import { jsx as _jsx } from "react/jsx-runtime";
import { iconRegistry } from "./registry";
export function Icon({ name, size = 24, color = "currentColor", className, "aria-label": ariaLabel, "aria-hidden": ariaHidden }) {
    const IconComponent = iconRegistry[name];
    if (!IconComponent) {
        return null;
    }
    const resolvedAriaHidden = ariaHidden ?? !ariaLabel;
    return (_jsx(IconComponent, { width: size, height: size, className: className, style: { color }, "aria-label": ariaLabel, "aria-hidden": resolvedAriaHidden, role: ariaLabel ? "img" : undefined }));
}
