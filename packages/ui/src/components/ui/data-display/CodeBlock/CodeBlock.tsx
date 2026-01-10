"use client";

import * as React from "react";

import { IconCheckmark, IconCopy } from "../../../../icons";
import { copyToClipboard } from "../../../../utils/clipboard";
import { cn } from "../../utils";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
}

function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = false,
  copyable = true,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyToClipboard = React.useCallback(async () => {
    try {
      await copyToClipboard(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [code]);

  const lines = React.useMemo(() => code.split("\n"), [code]);

  return (
    <div
      data-slot="code-block"
      className={cn(
        "group relative w-full overflow-hidden rounded-lg border border-border bg-muted",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/70 bg-background/60 px-4 py-2">
        <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
          {language}
        </span>
        {copyable && (
          <button
            type="button"
            onClick={handleCopyToClipboard}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium",
              "text-muted-foreground transition-colors hover:text-foreground",
              "hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
    </div>
  );
}

export { CodeBlock };
