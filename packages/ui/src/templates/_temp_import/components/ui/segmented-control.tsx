import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const segmentedControlVariants = cva(
  "inline-flex items-center gap-1 rounded-lg bg-foundation-bg-dark-2 p-1",
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const segmentVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-8 px-3 text-sm",
        lg: "h-10 px-4 text-base",
      },
      selected: {
        true: "bg-foundation-bg-dark-3 text-foundation-text-dark-primary shadow-sm",
        false: "text-foundation-text-dark-tertiary hover:text-foundation-text-dark-secondary",
      },
    },
    defaultVariants: {
      size: "md",
      selected: false,
    },
  }
);

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof segmentedControlVariants> {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value,
      onChange,
      size,
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          segmentedControlVariants({ size }),
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              role="tab"
              aria-selected={isSelected}
              type="button"
              disabled={option.disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                segmentVariants({ size, selected: isSelected }),
                fullWidth && "flex-1",
                "gap-2"
              )}
            >
              {option.icon && (
                <span className="inline-flex">{option.icon}</span>
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl };
