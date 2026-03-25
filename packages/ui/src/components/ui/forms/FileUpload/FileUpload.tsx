import * as React from "react";

import { cn } from "../../utils";

interface FileUploadProps {
  /** Accepted file types (MIME or extension). e.g. "image/*,.pdf" */
  accept?: string;
  /** Allow selecting multiple files. */
  multiple?: boolean;
  /** Maximum file size in bytes. */
  maxSize?: number;
  /** Callback when valid files are selected or dropped. */
  onFiles?: (files: File[]) => void;
  /** Callback when a file exceeds maxSize. Receives the rejected file. */
  onReject?: (file: File, reason: "size" | "type") => void;
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Custom drop zone label. */
  label?: React.ReactNode;
  /** Custom drag-active label. */
  dragActiveLabel?: React.ReactNode;
  /** Additional className for the drop zone. */
  className?: string;
  /** Id forwarded to the native input (for external labels). */
  id?: string;
}

/**
 * FileUpload — accessible drag-and-drop file input.
 *
 * Wraps a visually-hidden native `<input type="file">` with a styled drop zone.
 * The native input remains keyboard and screen-reader accessible.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   accept="image/*"
 *   multiple
 *   maxSize={5 * 1024 * 1024}
 *   onFiles={(files) => console.log(files)}
 *   onReject={(file, reason) => toast.error(`${file.name}: ${reason}`)}
 * />
 * ```
 */
function FileUpload({
  accept,
  multiple = false,
  maxSize,
  onFiles,
  onReject,
  disabled = false,
  label,
  dragActiveLabel,
  className,
  id,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");

  function validate(files: FileList | null): void {
    if (!files || files.length === 0) return;
    const valid: File[] = [];
    const rejected: string[] = [];
    for (const file of Array.from(files)) {
      if (maxSize !== undefined && file.size > maxSize) {
        onReject?.(file, "size");
        rejected.push(`${file.name} exceeds maximum size`);
        continue;
      }
      valid.push(file);
    }
    if (valid.length > 0) {
      onFiles?.(valid);
      setStatusMessage(
        valid.length === 1 ? `${valid[0]!.name} selected` : `${valid.length} files selected`,
      );
    }
    if (rejected.length > 0) {
      setStatusMessage(rejected.join(". "));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    validate(e.target.files);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (!disabled) validate(e.dataTransfer.files);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  const inputId = id ?? "file-upload-input";

  return (
    <div data-slot="file-upload-region" role="region" aria-label="File upload">
      {/* Visually-hidden live region — announces file selection and errors to screen readers */}
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </span>
      <div
        data-slot="file-upload"
        data-drag-active={isDragActive || undefined}
        className={cn(
          "group relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-10 text-center transition-colors",
          isDragActive && "border-interactive bg-interactive/5",
          !disabled && "cursor-pointer hover:border-interactive hover:bg-muted/30",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload area. Press Enter or Space to browse files."
        aria-disabled={disabled || undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleChange}
        />

        {/* Upload icon */}
        <svg
          aria-hidden="true"
          className="size-8 text-muted-foreground transition-colors group-hover:text-interactive"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>

        <p className="text-sm text-foreground">
          {isDragActive
            ? (dragActiveLabel ?? "Drop files here")
            : (label ?? (
                <>
                  <span className="font-medium text-interactive">Click to upload</span>
                  {" or drag and drop"}
                </>
              ))}
        </p>

        {maxSize !== undefined && (
          <p className="text-xs text-muted-foreground">
            Max size: {(maxSize / 1024 / 1024).toFixed(0)} MB
          </p>
        )}

        {accept && <p className="text-xs text-muted-foreground">Accepted: {accept}</p>}
      </div>
    </div>
  );
}

export { FileUpload };
export type { FileUploadProps };
