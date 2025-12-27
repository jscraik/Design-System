import { createRoot } from "react-dom/client";
import ReactMarkdown from "react-markdown";

import "../styles/widget.css";

import { useWidgetProps } from "../shared/use-widget-props";

const fallbackMarkdown = `# Pizzaz Markdown\n\nHere is a safe markdown rendering baseline with **bold**, _italic_, inline \`code\`, and links.\n\n- Use tool output to replace this content.\n- Keep paragraphs short and scannable.\n\n> This blockquote is rendered with safe defaults.\n\n\`\`\`ts\nconst message = \"Hello from markdown\";\n\`\`\`\n\n[Learn more](https://openai.com)\n`;

type MarkdownPayload = {
  markdown?: string;
};

function App() {
  const { markdown } = useWidgetProps<MarkdownPayload>({
    markdown: fallbackMarkdown,
  });
  const content = markdown ?? fallbackMarkdown;

  return (
    <div className="antialiased w-full text-black px-6 py-5 border border-black/10 rounded-2xl bg-white">
      <h1 className="sr-only">Pizzaz Markdown</h1>
      <div className="sr-only" aria-live="polite">
        Markdown updated.
      </div>
      <article className="space-y-4 text-sm leading-6">
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
                className="text-black underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                {children}
              </a>
            ),
            h1: ({ children }) => (
              <h2 className="text-lg font-semibold">{children}</h2>
            ),
            h2: ({ children }) => (
              <h3 className="text-base font-semibold">{children}</h3>
            ),
            h3: ({ children }) => (
              <h4 className="text-sm font-semibold">{children}</h4>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-black/20 pl-4 text-black/70">
                {children}
              </blockquote>
            ),
            code: ({ inline, children }) =>
              inline ? (
                <code className="rounded bg-black/5 px-1 py-0.5 text-[0.9em]">
                  {children}
                </code>
              ) : (
                <code className="block rounded-lg bg-black/5 p-3 text-xs leading-5">
                  {children}
                </code>
              ),
            ul: ({ children }) => (
              <ul className="list-disc space-y-1 pl-5">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal space-y-1 pl-5">{children}</ol>
            ),
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
