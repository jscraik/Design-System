import * as React from "react";
import { X } from "lucide-react";

import { cn } from "./utils";
import { Badge } from "./badge";

export interface Tag {
  id: string;
  label: string;
}

export interface TagInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onTagAdd?: (tag: Tag) => void;
  onTagRemove?: (tag: Tag) => void;
  maxTags?: number;
  placeholder?: string;
  allowDuplicates?: boolean;
  variant?: "default" | "outline";
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
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
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const addTag = (label: string) => {
      const trimmedLabel = label.trim();
      if (!trimmedLabel) return;

      // Check for duplicates
      if (!allowDuplicates && tags.some((tag) => tag.label === trimmedLabel)) {
        setInputValue("");
        return;
      }

      // Check max tags
      if (maxTags && tags.length >= maxTags) {
        return;
      }

      const newTag: Tag = {
        id: `tag-${Date.now()}-${Math.random()}`,
        label: trimmedLabel,
      };

      const newTags = [...tags, newTag];
      onTagsChange(newTags);
      onTagAdd?.(newTag);
      setInputValue("");
    };

    const removeTag = (tagToRemove: Tag) => {
      const newTags = tags.filter((tag) => tag.id !== tagToRemove.id);
      onTagsChange(newTags);
      onTagRemove?.(tagToRemove);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
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
        className={cn(
          "flex min-h-10 w-full flex-wrap gap-2 rounded-md border px-3 py-2 transition-colors",
          variant === "default" &&
            "border-foundation-text-dark-primary/10 bg-foundation-bg-dark-2 focus-within:border-foundation-text-dark-primary/20",
          variant === "outline" &&
            "border-foundation-text-dark-primary/20 bg-transparent focus-within:border-foundation-accent-blue",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Display tags */}
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="gap-1 pr-1 text-sm"
          >
            {tag.label}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              disabled={disabled}
              className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-label={`Remove ${tag.label}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}

        {/* Input field */}
        {(!maxTags || tags.length < maxTags) && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent text-sm outline-none placeholder:text-foundation-text-dark-tertiary min-w-[120px]",
              disabled && "cursor-not-allowed"
            )}
            {...props}
          />
        )}
      </div>
    );
  }
);
TagInput.displayName = "TagInput";

export { TagInput };
