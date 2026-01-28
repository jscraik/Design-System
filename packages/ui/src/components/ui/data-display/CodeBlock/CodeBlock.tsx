import * as React from "react";

import { IconCheckmark, IconCopy } from "../../../../icons";
import { copyToClipboard } from "../../../../utils/clipboard";
import { cn } from "../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

export interface CodeBlockProps
  extends React.HTMLAttributes<HTMLPreElement>,
    StatefulComponentProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
}

/**
 * Renders a code block with syntax highlighting and copy functionality.
 *
 * Supports stateful props for loading, error, and disabled states.
 * When loading, shows loading state in header. When error, shows error message.
 *
 * @param props - Code block props and stateful options.
 * @returns The code block element.
 *
 * @example
 * ```tsx
 * <CodeBlock code="const x = 1;" language="typescript" />
 * <CodeBlock code="..." loading />
 * <CodeBlock code="..." error="Failed to load code" />
 * ```
 */
function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = false,
  copyable = true,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

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

  const handleCopyToClipboard = React.useCallback(async () => {
    if (isDisabled) return;
    try {
      await copyToClipboard(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [code, isDisabled]);

  const lines = React.useMemo(() => code.split("\n"), [code]);

  return (
    <div
      data-slot="code-block"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "group relative w-full overflow-hidden rounded-lg border border-border bg-muted",
        isDisabled && "opacity-50 pointer-events-none",
        error && "ring-2 ring-foundation-accent-red/50",
        loading && "animate-pulse",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/70 bg-background/60 px-4 py-2">
        <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
          {loading ? "Loading..." : error ? "Error" : language}
        </span>
        {copyable && !loading && !error && (
          <button
            type="button"
            onClick={handleCopyToClipboard}
            disabled={isDisabled}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium",
              "text-muted-foreground transition-colors hover:text-foreground",
              "hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isDisabled && "pointer-events-none opacity-50",
            )}
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <>
                <IconCheckmark className="size-3 text-foundation-accent-green" />
                Copied!
              </>
            ) : (
              <>
                <IconCopy className="size-3" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {loading && (
        <div className="p-4 text-sm text-center text-muted-foreground">Loading code...</div>
      )}

      {error && <div className="p-4 text-sm text-center text-foundation-accent-red">{error}</div>}

      {!loading && !error && (
        <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed" {...props}>
          <code className="text-foreground">
            {showLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={`${index}-${line}`}>
                      <td className="pr-4 text-right text-muted-foreground/70 select-none">
                        {index + 1}
                      </td>
                      <td className="pl-2 whitespace-pre">{line || "\n"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              code
            )}
          </code>
        </pre>
      )}
    </div>
  );
}

export { CodeBlock };
