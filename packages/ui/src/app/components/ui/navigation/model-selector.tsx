import { useState } from "react";

import { IconCheckmark, IconChevronDownMd, IconChevronRightMd } from "../../../../icons";
import { Popover } from "../../../../vendor/appsSdkUi";
import { cn } from "../utils";

export interface ModelConfig {
  /** Unique identifier or full name */
  name: string;
  /** Short display name */
  shortName: string;
  /** Description of the model */
  description: string;
  /** Whether this is a legacy/deprecated model */
  isLegacy?: boolean;
  /** Optional grouping category */
  category?: string;
}

export interface ModelSelectorProps {
  /** Currently selected model */
  value?: string | ModelConfig;
  /** Callback when model changes */
  onChange?: (model: string | ModelConfig) => void;
  /** Available models to choose from */
  models: ModelConfig[];
  /** Legacy models (shown in submenu) */
  legacyModels?: ModelConfig[];
  /** Label shown before model name */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Disable the selector */
  disabled?: boolean;
}

/**
 * ModelSelector - A dropdown for selecting AI models
 *
 * @example
 * ```tsx
 * <ModelSelector
 *   value={selectedModel}
 *   onChange={setSelectedModel}
 *   models={[
 *     { name: "GPT-4o", shortName: "4o", description: "Fast and efficient" },
 *     { name: "GPT-4", shortName: "4", description: "Most capable" },
 *   ]}
 *   label="ChatGPT"
 * />
 * ```
 */
export function ModelSelector({
  value,
  onChange,
  models,
  legacyModels,
  label = "ChatGPT",
  className,
  disabled = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLegacyOpen, setIsLegacyOpen] = useState(false);

  const modelName = typeof value === "string" ? value : (value?.shortName ?? models[0]?.shortName);

  const handleSelect = (model: ModelConfig) => {
    onChange?.(model.name);
    setIsOpen(false);
    setIsLegacyOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={disabled ? undefined : setIsOpen}>
      <Popover.Trigger>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-lg transition-colors",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          disabled={disabled}
        >
          {label && (
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              {label}
            </span>
          )}
          <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            {modelName}
          </span>
          <IconChevronDownMd className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
        </button>
      </Popover.Trigger>

      <Popover.Content
        side="bottom"
        align="start"
        sideOffset={8}
        className="z-50 w-[340px] rounded-2xl border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-2xl outline-none"
      >
        <div className="p-3">
          <div className="mb-2">
            {models.map((model) => (
              <ModelOption
                key={model.name}
                model={model}
                isSelected={modelName === model.name || modelName === model.shortName}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {legacyModels && legacyModels.length > 0 && (
            <Popover open={isLegacyOpen} onOpenChange={setIsLegacyOpen}>
              <Popover.Trigger>
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-lg transition-colors text-left"
                >
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                    Legacy models
                  </span>
                  <IconChevronRightMd
                    className={cn(
                      "size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary transition-transform",
                      isLegacyOpen && "rotate-90",
                    )}
                  />
                </button>
              </Popover.Trigger>

              <Popover.Content
                side="right"
                align="start"
                sideOffset={8}
                className="z-50 w-[340px] rounded-2xl border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-2xl outline-none"
              >
                <div className="p-3 max-h-[400px] overflow-y-auto">
                  {legacyModels.map((model) => (
                    <ModelOption
                      key={model.name}
                      model={model}
                      isSelected={modelName === model.name || modelName === model.shortName}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </Popover.Content>
            </Popover>
          )}
        </div>
      </Popover.Content>
    </Popover>
  );
}

interface ModelOptionProps {
  model: ModelConfig;
  isSelected: boolean;
  onSelect: (model: ModelConfig) => void;
}

function ModelOption({ model, isSelected, onSelect }: ModelOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(model)}
      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-lg transition-colors text-left group"
    >
      <div className="flex-1">
        <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
          {model.name}
        </div>
        <div className="text-[12px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary leading-[16px] tracking-[-0.3px]">
          {model.description}
        </div>
      </div>
      {isSelected && (
        <IconCheckmark className="size-4 text-foundation-text-light-primary dark:text-foundation-text-dark-primary flex-shrink-0 ml-2" />
      )}
    </button>
  );
}

ModelSelector.displayName = "ModelSelector";
