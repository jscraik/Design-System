import { useCallback, useState } from "react";
import { cn } from "../../../components/ui/utils";
import { IconCheckmark, IconCopy } from "../../../icons/ChatGPTIcons";

interface CodeBlockProps {
  code: string;
  language?: string;
}

/** CodeBlock displays code with copy functionality. */
export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group rounded-lg overflow-hidden">
      <pre className="bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
          {code}
        </code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 p-2 rounded-md transition-all duration-200",
          "opacity-0 group-hover:opacity-100",
          "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2",
          "hover:bg-foundation-bg-light-1 dark:hover:bg-foundation-bg-dark-1",
          "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
        )}
        aria-label={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <IconCheckmark className="size-4 text-foundation-accent-green" />
        ) : (
          <IconCopy className="size-4" />
        )}
      </button>
      <span className="absolute bottom-2 right-2 text-[10px] font-mono text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary uppercase">
        {language}
      </span>
    </div>
  );
}
