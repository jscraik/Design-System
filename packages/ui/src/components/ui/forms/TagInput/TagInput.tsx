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
  "aria-label": ariaLabel,
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [announcement, setAnnouncement] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const idCounter = React.useRef(0);
  const inputId = React.useId();
  const errorId = `${inputId}-error`;

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
      setAnnouncement(`${trimmedLabel} added`);
    },
    [allowDuplicates, createTagId, isDisabled, maxTags, onTagAdd, onTagsChange, tags],
  );

  const removeTag = React.useCallback(
    (tagToRemove: Tag) => {
      if (isDisabled) return;

      const newTags = tags.filter((tag) => tag.id !== tagToRemove.id);
      onTagsChange(newTags);
      onTagRemove?.(tagToRemove);
      setAnnouncement(`${tagToRemove.label} removed`);
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

  const groupLabel = ariaLabel ?? "Tag input";

  return (
    <div
      role="group"
      aria-label={groupLabel}
      data-slot="tag-input"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      aria-invalid={error ? "true" : undefined}
      aria-required={required || undefined}
      className={cn(
        error && "ring-2 ring-status-error/50 rounded-md",
        loading && "animate-pulse motion-reduce:animate-none",
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Live region announces add/remove to screen readers */}
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap gap-2 rounded-md border px-3 py-2 transition-colors",
          variant === "default" && "border-border bg-muted/30 focus-within:border-border/70",
          variant === "outline" && "border-border/60 bg-transparent focus-within:border-ring",
          isDisabled && "cursor-not-allowed opacity-50",
          className,
        )}
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
              <IconX className="size-3" aria-hidden="true" />
            </button>
          </Badge>
        ))}

        {(!maxTags || tags.length < maxTags) && (
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={isDisabled}
            aria-label={groupLabel}
            aria-invalid={error ? "true" : undefined}
            aria-required={required || undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "flex-1 min-w-30 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
              isDisabled && "cursor-not-allowed",
            )}
            {...props}
          />
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-status-error mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export { TagInput };
