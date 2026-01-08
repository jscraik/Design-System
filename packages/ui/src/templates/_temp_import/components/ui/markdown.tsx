import * as React from "react";

import { cn } from "./utils";
import { CodeBlock } from "./code-block";
import { TextLink } from "./text-link";

export interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  components?: {
    [key: string]: React.ComponentType<any>;
  };
}

// Simple markdown parser (you can replace with react-markdown or marked)
const parseMarkdown = (content: string) => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let codeLanguage = "";

  lines.forEach((line, index) => {
    // Code block
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
          />
        );
      }
      return;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      return;
    }

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="mt-6 mb-2 text-lg font-semibold">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="mt-8 mb-3 text-xl font-semibold">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="mt-8 mb-4 text-2xl font-semibold">
          {line.slice(2)}
        </h1>
      );
    }
    // Unordered list
    else if (line.match(/^[\*\-] /)) {
      elements.push(
        <li key={index} className="ml-4">
          {parseInline(line.slice(2))}
        </li>
      );
    }
    // Ordered list
    else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={index} className="ml-4">
          {parseInline(line.replace(/^\d+\. /, ""))}
        </li>
      );
    }
    // Blockquote
    else if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={index}
          className="border-l-4 border-foundation-accent-blue pl-4 italic text-foundation-text-dark-secondary my-4"
        >
          {parseInline(line.slice(2))}
        </blockquote>
      );
    }
    // Horizontal rule
    else if (line.match(/^---+$/)) {
      elements.push(
        <hr
          key={index}
          className="my-8 border-foundation-text-dark-primary/10"
        />
      );
    }
    // Paragraph
    else if (line.trim()) {
      elements.push(
        <p key={index} className="my-2 leading-relaxed">
          {parseInline(line)}
        </p>
      );
    }
    // Empty line
    else {
      elements.push(<div key={index} className="h-2" />);
    }
  });

  return elements;
};

// Parse inline markdown (bold, italic, code, links)
const parseInline = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns = [
    // Links [text](url)
    {
      regex: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (match: RegExpMatchArray) => (
        <TextLink
          key={`link-${key++}`}
          href={match[2]}
          variant="default"
          showExternalIcon
        >
          {match[1]}
        </TextLink>
      ),
    },
    // Bold **text**
    {
      regex: /\*\*([^*]+)\*\*/,
      render: (match: RegExpMatchArray) => (
        <strong key={`bold-${key++}`}>{match[1]}</strong>
      ),
    },
    // Italic *text*
    {
      regex: /\*([^*]+)\*/,
      render: (match: RegExpMatchArray) => (
        <em key={`italic-${key++}`}>{match[1]}</em>
      ),
    },
    // Inline code `code`
    {
      regex: /`([^`]+)`/,
      render: (match: RegExpMatchArray) => (
        <code
          key={`code-${key++}`}
          className="rounded bg-foundation-bg-dark-2 px-1.5 py-0.5 text-sm font-mono text-foundation-accent-blue"
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
        // Add text before match
        if (match.index > 0) {
          parts.push(remaining.slice(0, match.index));
        }
        // Add rendered element
        parts.push(pattern.render(match));
        // Update remaining text
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

const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  ({ content, className, components, ...props }, ref) => {
    const elements = React.useMemo(() => parseMarkdown(content), [content]);

    return (
      <div
        ref={ref}
        className={cn(
          "prose prose-invert max-w-none",
          "text-foundation-text-dark-primary",
          "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          className
        )}
        {...props}
      >
        {elements}
      </div>
    );
  }
);
Markdown.displayName = "Markdown";

export { Markdown };
