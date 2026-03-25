import { useId } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../components/ui/overlays/DropdownMenu";
import { cn } from "../../../components/ui/utils";
import { IconCheckmark, IconChevronDownMd } from "../../../icons/ChatGPTIcons";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

export interface SettingDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onValueChange: (value: string) => void;
  description?: string;
  align?: "start" | "end" | "center";
  className?: string;
}

/**
 * Reusable Radix-based dropdown component for settings
 * Supports options with descriptions
 */
export function SettingDropdown({
  label,
  value,
  options,
  onValueChange,
  description,
  align = "end",
  className = "",
}: SettingDropdownProps) {
  const descriptionId = useId();
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className}>
      <div className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary">
        <span className="text-body-small text-foreground">{label}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-describedby={description ? descriptionId : undefined}
            >
              <span className="text-body-small text-text-secondary">
                {selectedOption?.label || value}
              </span>
              <IconChevronDownMd className="size-3.5 text-text-secondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="min-w-72">
            <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
              {options.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex-1">
                      <div className="text-body-small text-foreground">{option.label}</div>
                      {option.description && (
                        <div className="mt-0.5 text-caption text-text-secondary">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {value === option.value && (
                      <IconCheckmark className="ml-2 size-4 shrink-0 text-foreground" />
                    )}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {description ? (
        <p id={descriptionId} className={cn("mt-2 px-3 text-caption text-muted-foreground")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
