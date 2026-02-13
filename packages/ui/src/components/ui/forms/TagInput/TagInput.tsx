import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
import { IconX } from "../../../../icons";
import { Badge } from "../../base/badge";
import { cn } from "../../utils";

export interface Tag {
  id: string;
  label: string;
}

export interface TagInputProps
  extends StatefulComponentProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onTagAdd?: (tag: Tag) => void;
  onTagRemove?: (tag: Tag) => void;
  maxTags?: number;
  placeholder?: string;
  allowDuplicates?: boolean;
  variant?: "default" | "outline";
}

function TagInput({
  tags,
  onTagsChange,
  onTagAdd,
  onTagRemove,
  maxTags,
  placeholder = "Add tag...",
  allowDuplicates = false,
  variant = "default",
  className,
  disabled = false,
  loading = false,
  error,
  required,
  onStateChange,
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const idCounter = React.useRef(0);

  // Determine effective state (priority: loading > error > disabled > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;

  const createTagId = React.useCallback(() => {
    idCounter.current += 1;
    return `tag-${idCounter.current}`;
  }, []);

  const addTag = React.useCallback(
    (label: string) => {
      if (isDisabled) return;

      const trimmedLabel = label.trim();
      if (!trimmedLabel) return;

      if (!allowDuplicates && tags.some((tag) => tag.label === trimmedLabel)) {
        setInputValue("");
        return;
      }

      if (maxTags && tags.length >= maxTags) return;

      const newTag: Tag = {
        id: createTagId(),
        label: trimmedLabel,
      };

      const newTags = [...tags, newTag];
      onTagsChange(newTags);
      onTagAdd?.(newTag);
      setInputValue("");
    },
    [allowDuplicates, createTagId, isDisabled, maxTags, onTagAdd, onTagsChange, tags],
  );

  const removeTag = React.useCallback(
    (tagToRemove: Tag) => {
      if (isDisabled) return;

      const newTags = tags.filter((tag) => tag.id !== tagToRemove.id);
      onTagsChange(newTags);
      onTagRemove?.(tagToRemove);
    },
    [isDisabled, onTagRemove, onTagsChange, tags],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    if (event.key === "Enter") {
      event.preventDefault();
      addTag(inputValue);
    } else if (event.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div
      data-slot="tag-input"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "flex min-h-10 w-full flex-wrap gap-2 rounded-md border px-3 py-2 transition-colors",
        variant === "default" && "border-border bg-muted/30 focus-within:border-border/70",
        variant === "outline" && "border-border/60 bg-transparent focus-within:border-ring",
        isDisabled && "cursor-not-allowed opacity-50",
        error && "ring-2 ring-status-error/50",
        loading && "animate-pulse",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <Badge key={tag.id} variant="secondary" className="gap-1 pr-1 text-sm">
          {tag.label}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (isDisabled) return;
              removeTag(tag);
            }}
            disabled={isDisabled}
            className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Remove ${tag.label}`}
          >
            <IconX className="size-3" />
          </button>
        </Badge>
      ))}

      {(!maxTags || tags.length < maxTags) && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          disabled={isDisabled}
          className={cn(
            "flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground",
            isDisabled && "cursor-not-allowed",
          )}
          {...props}
        />
      )}
    </div>
  );
}

export { TagInput };
