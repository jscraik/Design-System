import type { ReactNode } from "react";
import { cn } from "@astudio/ui";

type CodeBlockProps = {
  children: ReactNode;
  className?: string;
  language?: string;
  showLineNumbers?: boolean;
  wrapLongLines?: boolean;
};

/**
 * Render a styled code block with optional wrapping.
 * @param props - Code block props.
 * @returns A preformatted code block element.
 */
export function CodeBlock({ children, className, wrapLongLines }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "rounded-lg border border-default bg-surface-secondary p-3 text-xs font-mono text-primary overflow-x-auto",
        wrapLongLines && "whitespace-pre-wrap break-words",
        className,
      )}
    >
      <code>{children}</code>
    </pre>
  );
}
