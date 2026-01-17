"use client";

import * as React from "react";

import { IconX } from "../../../../icons";
import { Badge } from "../../base/Badge";
import { cn } from "../../utils";

export interface Tag {
  id: string;
  label: string;
}

export interface TagInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
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
  disabled,
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const idCounter = React.useRef(0);

  const createTagId = React.useCallback(() => {
    idCounter.current += 1;
    return `tag-${idCounter.current}`;
  }, []);

  const addTag = React.useCallback(
    (label: string) => {
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
    [allowDuplicates, createTagId, maxTags, onTagAdd, onTagsChange, tags],
  );

  const removeTag = React.useCallback(
    (tagToRemove: Tag) => {
      const newTags = tags.filter((tag) => tag.id !== tagToRemove.id);
      onTagsChange(newTags);
      onTagRemove?.(tagToRemove);
    },
    [onTagRemove, onTagsChange, tags],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
      className={cn(
        "flex min-h-10 w-full flex-wrap gap-2 rounded-md border px-3 py-2 transition-colors",
        variant === "default" && "border-border bg-muted/30 focus-within:border-border/70",
        variant === "outline" && "border-border/60 bg-transparent focus-within:border-ring",
        disabled && "cursor-not-allowed opacity-50",
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
              removeTag(tag);
            }}
            disabled={disabled}
            className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
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
          disabled={disabled}
          className={cn(
            "flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground",
            disabled && "cursor-not-allowed",
          )}
          {...props}
        />
      )}
    </div>
  );
}

export { TagInput };
