import type { ComponentType, SVGProps } from "react";
import { iconRegistry } from "./registry";
import type { IconName } from "./types";

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  className,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: IconProps) {
  const IconComponent = iconRegistry[name] as ComponentType<SVGProps<SVGSVGElement>> | undefined;

  if (!IconComponent) {
    return null;
  }

  const resolvedAriaHidden = ariaHidden ?? !ariaLabel;

  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      style={{ color }}
      aria-label={ariaLabel}
      aria-hidden={resolvedAriaHidden}
      role={ariaLabel ? "img" : undefined}
    />
  );
}
