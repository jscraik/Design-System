import * as React from "react";
import { Check, Copy } from "lucide-react";

import { copyToClipboard as copyToClipboardUtil } from "../../utils/clipboard";

import { cn } from "./utils";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (
    {
      code,
      language = "typescript",
      showLineNumbers = false,
      copyable = true,
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopyToClipboard = async () => {
      const success = await copyToClipboardUtil(code);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const lines = code.split("\n");

    return (
      <div className="group relative w-full overflow-hidden rounded-lg border border-foundation-text-dark-primary/10 bg-foundation-bg-dark-1">
        {/* Header with language badge and copy button */}
        <div className="flex items-center justify-between border-b border-foundation-text-dark-primary/10 bg-foundation-bg-dark-2 px-4 py-2">
          <span className="text-xs font-mono text-foundation-text-dark-tertiary uppercase tracking-wide">
            {language}
          </span>
          {copyable && (
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-foundation-text-dark-secondary transition-colors hover:bg-foundation-bg-dark-3 hover:text-foundation-text-dark-primary"
              aria-label={copied ? "Copied!" : "Copy code"}
            >
              {copied ? (
                <>
                  <Check className="size-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        {/* Code content */}
        <pre
          ref={ref}
          className={cn(
            "overflow-x-auto p-4 text-sm font-mono leading-relaxed",
            className
          )}
          {...props}
        >
          <code className="text-foundation-text-dark-primary">
            {showLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="pr-4 text-right text-foundation-text-dark-tertiary select-none">
                        {index + 1}
                      </td>
                      <td className="pl-2">{line || "\n"}</td>
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
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock };