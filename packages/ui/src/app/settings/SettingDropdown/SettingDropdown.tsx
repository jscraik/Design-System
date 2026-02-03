import { IconCheckmark, IconChevronDownMd } from "../../../icons/ChatGPTIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../components/ui/overlays/DropdownMenu";

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
      <div className="flex items-center justify-between px-3 py-2.5 hover:bg-secondary dark:hover:bg-secondary rounded-lg transition-colors">
        <span className="text-body-small font-normal   text-foreground">{label}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-muted rounded-md transition-colors"
            >
              <span className="text-body-small font-normal   text-text-secondary">
                {selectedOption?.label || value}
              </span>
              <IconChevronDownMd className="size-3.5 text-text-secondary dark:text-text-secondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="min-w-[270px]">
            <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
              {options.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="text-body-small font-normal   text-foreground">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-caption  tracking-[-0.24px] text-text-secondary mt-0.5">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {value === option.value && (
                      <IconCheckmark className="size-4 text-foreground dark:text-foreground ml-2 flex-shrink-0" />
                    )}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {description && (
        <p className="text-caption   text-muted-foreground px-3 mt-2">{description}</p>
      )}
    </div>
  );
}
