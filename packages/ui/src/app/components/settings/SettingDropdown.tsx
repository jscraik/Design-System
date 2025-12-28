import { IconCheckmark, IconChevronDownMd } from "../icons/ChatGPTIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/overlays/dropdown-menu";

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
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className}>
      <div className="flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors">
        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
          {label}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-foundation-bg-dark-3 rounded-md transition-colors">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
                {selectedOption?.label || value}
              </span>
              <IconChevronDownMd className="size-3.5 text-foundation-icon-dark-secondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="min-w-[270px]">
            <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
              {options.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-[12px] leading-[16px] tracking-[-0.24px] text-foundation-text-dark-secondary mt-0.5">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {value === option.value && (
                      <IconCheckmark className="size-4 text-foundation-icon-dark-primary ml-2 flex-shrink-0" />
                    )}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {description && (
        <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-foundation-text-dark-tertiary px-3 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}
