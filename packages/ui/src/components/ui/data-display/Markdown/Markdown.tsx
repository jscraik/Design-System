import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
import { TextLink } from "../../base/TextLink";
import { cn } from "../../utils";
import { CodeBlock } from "../CodeBlock";

export interface MarkdownProps
  extends React.HTMLAttributes<HTMLDivElement>,
    StatefulComponentProps {
  content: string;
  components?: Record<string, React.ComponentType<React.ComponentPropsWithoutRef<"span">>>;
}

const parseMarkdown = (content: string): React.ReactNode[] => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let codeLanguage = "";

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || "text";
        codeContent = "";
      } else {
        inCodeBlock = false;
        elements.push(
          <CodeBlock
            key={`code-${index}`}
            code={codeContent.trim()}
            language={codeLanguage}
            className="my-4"
          />,
        );
      }
      return;
    }

    if (inCodeBlock) {
      codeContent += `${line}\n`;
      return;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="mt-6 mb-2 text-lg font-semibold text-foreground">
          {line.slice(4)}
        </h3>,
      );
      return;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="mt-8 mb-3 text-xl font-semibold text-foreground">
          {line.slice(3)}
        </h2>,
      );
      return;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="mt-8 mb-4 text-2xl font-semibold text-foreground">
          {line.slice(2)}
        </h1>,
      );
      return;
    }

    if (line.match(/^[*-] /)) {
      elements.push(
        <li key={index} className="ml-4 text-foreground">
          {parseInline(line.slice(2))}
        </li>,
      );
      return;
    }

    if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={index} className="ml-4 text-foreground">
          {parseInline(line.replace(/^\d+\. /, ""))}
        </li>,
      );
      return;
    }

    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={index}
          className="my-4 border-l-4 border-interactive pl-4 italic text-muted-foreground"
        >
          {parseInline(line.slice(2))}
        </blockquote>,
      );
      return;
    }

    if (line.match(/^---+$/)) {
      elements.push(<hr key={index} className="my-8 border-border" />);
      return;
    }

    if (line.trim()) {
      elements.push(
        <p key={index} className="my-2 leading-relaxed text-foreground">
          {parseInline(line)}
        </p>,
      );
      return;
    }

    elements.push(<div key={index} className="h-2" />);
  });

  return elements;
};

const parseInline = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns = [
    {
      regex: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (match: RegExpMatchArray) => (
        <TextLink key={`link-${key++}`} href={match[2]} variant="default" showExternalIcon>
          {match[1]}
        </TextLink>
      ),
    },
    {
      regex: /\*\*([^*]+)\*\*/,
      render: (match: RegExpMatchArray) => <strong key={`bold-${key++}`}>{match[1]}</strong>,
    },
    {
      regex: /\*([^*]+)\*/,
      render: (match: RegExpMatchArray) => <em key={`italic-${key++}`}>{match[1]}</em>,
    },
    {
      regex: /`([^`]+)`/,
      render: (match: RegExpMatchArray) => (
        <code
          key={`code-${key++}`}
          className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-interactive"
        >
          {match[1]}
        </code>
      ),
    },
  ];

  while (remaining) {
    let matched = false;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index !== undefined) {
        if (match.index > 0) {
          parts.push(remaining.slice(0, match.index));
        }
        parts.push(pattern.render(match));
        remaining = remaining.slice(match.index + match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      parts.push(remaining);
      break;
    }
  }

  return parts.length > 0 ? parts : text;
};

/**
 * Renders markdown content with support for headings, lists, code blocks, and more.
 *
 * Supports stateful props for loading, error, and disabled states.
 * When loading, shows loading state. When error, shows error message.
 *
 * @param props - Markdown props and stateful options.
 * @returns The markdown content element.
 *
 * @example
 * ```tsx
 * <Markdown content="# Hello\n\nThis is **bold** text." />
 * <Markdown content="..." loading />
 * <Markdown content="..." error="Failed to parse" />
 * ```
 */
function Markdown({
  content,
  className,
  components: _components,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: MarkdownProps) {
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

  const elements = React.useMemo(
    () => (loading || error ? [] : parseMarkdown(content)),
    [content, loading, error],
  );

  return (
    <div
      data-slot="markdown"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "max-w-none text-foreground",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        isDisabled && "opacity-50 pointer-events-none",
        loading && "animate-pulse",
        className,
      )}
      {...props}
    >
      {loading && <p className="text-muted-foreground">Loading markdown...</p>}
      {error && <p className="text-status-error">{error}</p>}
      {!loading && !error && elements}
    </div>
  );
}

export { Markdown };
