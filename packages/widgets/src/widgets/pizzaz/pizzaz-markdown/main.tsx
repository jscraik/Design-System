import { createRoot } from "react-dom/client";
import ReactMarkdown from "react-markdown";

import "../../../styles/widget.css";

import { useWidgetProps } from "../../../shared/use-widget-props";

const fallbackMarkdown = `# Pizzaz Markdown\n\nHere is a safe markdown rendering baseline with **bold**, _italic_, inline \`code\`, and links.\n\n- Use tool output to replace this content.\n- Keep paragraphs short and scannable.\n\n> This blockquote is rendered with safe defaults.\n\n\`\`\`ts\nconst message = "Hello from markdown";\n\`\`\`\n\n[Learn more](https://openai.com)\n`;

type MarkdownPayload = {
  markdown?: string;
};

/**
 * Render the markdown widget with safe element allowlist.
 */
function App() {
  const { markdown } = useWidgetProps<MarkdownPayload>({
    markdown: fallbackMarkdown,
  });
  const content = markdown ?? fallbackMarkdown;

  return (
    <div className="antialiased w-full text-foundation-text-light-primary dark:text-foundation-text-dark-primary px-6 py-5 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-2xl bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
      <h1 className="sr-only">Pizzaz Markdown</h1>
      <div className="sr-only" aria-live="polite">
        Markdown updated.
      </div>
      <article className="space-y-4 text-sm leading-6 text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
        <ReactMarkdown
          allowedElements={[
            "a",
            "blockquote",
            "code",
            "em",
            "h1",
            "h2",
            "h3",
            "li",
            "ol",
            "p",
            "pre",
            "strong",
            "ul",
          ]}
          components={{
            a: ({ href, children, ...props }) => (
              <a
                {...props}
                href={href}
                className="text-foundation-accent-blue underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            h1: ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>,
            h2: ({ children }) => <h3 className="text-base font-semibold">{children}</h3>,
            h3: ({ children }) => <h4 className="text-sm font-semibold">{children}</h4>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 pl-4 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                {children}
              </blockquote>
            ),
            code: ({ inline, children }) =>
              inline ? (
                <code className="rounded bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 px-1 py-0.5 text-[0.9em] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  {children}
                </code>
              ) : (
                <code className="block rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-3 text-xs leading-5 text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  {children}
                </code>
              ),
            ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}

const root = document.getElementById("pizzaz-markdown-root");

if (root) {
  createRoot(root).render(<App />);
}
