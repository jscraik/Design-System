import React, { useState, useCallback } from "react";

import { copyToClipboard as copyToClipboardUtil } from "../utils/clipboard";
import { typography } from "../design-tokens";

import { cn } from "./ui/utils";

type ViewMode = "preview" | "specs" | "code";

interface TypeStyle {
  name: string;
  displayName: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  className: string;
  description: string;
}

function IconCopy({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconType({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );
}

function IconCode({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}

function IconEye({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function IconSpecs({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}

function IconFont({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 21h10M12 21V3m3 6H9"
      />
    </svg>
  );
}

function Toast({ message, value, visible }: { message: string; value: string; visible: boolean }) {
  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
        "px-5 py-3.5 rounded-xl shadow-2xl",
        "bg-foundation-bg-dark-2/95 backdrop-blur-xl",
        "border border-foundation-bg-dark-3",
        "flex items-center gap-3",
        "transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="size-9 rounded-full bg-foundation-accent-success/10 flex items-center justify-center shrink-0 border border-foundation-accent-success/20">
        <IconCheck className="size-5 text-foundation-accent-success" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foundation-text-dark-primary leading-tight">{message}</p>
        <p className="text-xs font-mono text-foundation-text-dark-secondary mt-0.5 truncate leading-tight max-w-[200px]">
          {value}
        </p>
      </div>
    </div>
  );
}

function SpecBadge({
  label,
  value,
  onCopy,
  isCopied,
}: {
  label: string;
  value: string;
  onCopy: (v: string) => void;
  isCopied: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      aria-label={`Copy ${label}: ${value}`}
      className={cn(
        "group flex flex-col gap-1 rounded-lg px-3 py-2",
        "transition-all duration-200",
        "bg-foundation-bg-dark-3/50 hover:bg-foundation-bg-dark-3 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
        "text-left min-w-[80px]",
        "active:scale-[0.98]",
      )}
    >
      <span className="text-[10px] text-foundation-text-dark-tertiary uppercase tracking-wider font-semibold">
        {label}
      </span>
      <span className="text-sm font-semibold text-foundation-text-dark-primary group-hover:text-foundation-accent-blue transition-colors flex items-center gap-1.5 leading-tight">
        {value}
        {isCopied ? (
          <IconCheck className="size-3 text-foundation-accent-success" />
        ) : (
          <IconCopy className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    </button>
  );
}

function TypeStyleCard({
  style,
  onCopy,
  copiedValue,
  viewMode,
}: {
  style: TypeStyle;
  onCopy: (v: string) => void;
  copiedValue: string | null;
  viewMode: ViewMode;
}) {
  const cssCode = `.${style.name} {\n  font-size: ${style.size};\n  font-weight: ${style.weight};\n  line-height: ${style.lineHeight};\n  letter-spacing: ${style.letterSpacing};\n}`;
  const tailwindCode = `className="${style.className}"`;

  return (
    <div className="rounded-2xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-foundation-accent-blue/20">
      <div className="px-6 py-4 border-b border-foundation-bg-dark-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-foundation-bg-dark-3 shadow-sm">
            <IconType className="size-4 text-foundation-icon-dark-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foundation-text-dark-primary">
              {style.displayName}
            </h3>
            <p className="text-xs text-foundation-text-dark-tertiary mt-0.5">{style.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <SpecBadge
            label="Size"
            value={style.size}
            onCopy={onCopy}
            isCopied={copiedValue === style.size}
          />
          <SpecBadge
            label="Weight"
            value={style.weight}
            onCopy={onCopy}
            isCopied={copiedValue === style.weight}
          />
          <SpecBadge
            label="Line"
            value={style.lineHeight}
            onCopy={onCopy}
            isCopied={copiedValue === style.lineHeight}
          />
          <SpecBadge
            label="Track"
            value={style.letterSpacing}
            onCopy={onCopy}
            isCopied={copiedValue === style.letterSpacing}
          />
        </div>
      </div>
      <div className="p-6">
        {viewMode === "preview" && (
          <div className={cn(style.className, "text-foundation-text-dark-primary leading-relaxed")}>
            The quick brown fox jumps over the lazy dog
          </div>
        )}
        {viewMode === "specs" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs text-foundation-text-dark-tertiary font-medium">Font Size</span>
              <p className="text-xl font-semibold text-foundation-text-dark-primary tabular-nums">
                {style.size}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs text-foundation-text-dark-tertiary font-medium">Font Weight</span>
              <p className="text-xl font-semibold text-foundation-text-dark-primary tabular-nums">
                {style.weight}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs text-foundation-text-dark-tertiary font-medium">Line Height</span>
              <p className="text-xl font-semibold text-foundation-text-dark-primary tabular-nums">
                {style.lineHeight}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs text-foundation-text-dark-tertiary font-medium">Letter Spacing</span>
              <p className="text-xl font-semibold text-foundation-text-dark-primary tabular-nums">
                {style.letterSpacing}
              </p>
            </div>
          </div>
        )}
        {viewMode === "code" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-foundation-text-dark-secondary font-semibold">Tailwind CSS</span>
                <button
                  type="button"
                  onClick={() => onCopy(tailwindCode)}
                  aria-label="Copy Tailwind code"
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-md",
                    "transition-colors duration-200",
                    "hover:bg-foundation-bg-dark-3",
                    "text-foundation-text-dark-tertiary hover:text-foundation-accent-blue",
                    "flex items-center gap-1.5",
                  )}
                >
                  {copiedValue === tailwindCode ? (
                    <>
                      <IconCheck className="size-3 text-foundation-accent-success" /> Copied
                    </>
                  ) : (
                    <>
                      <IconCopy className="size-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-foundation-bg-dark-3 text-xs font-mono text-foundation-text-dark-primary overflow-x-auto border border-foundation-bg-dark-4">
                {tailwindCode}
              </pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-foundation-text-dark-secondary font-semibold">CSS</span>
                <button
                  type="button"
                  onClick={() => onCopy(cssCode)}
                  aria-label="Copy CSS code"
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-md",
                    "transition-colors duration-200",
                    "hover:bg-foundation-bg-dark-3",
                    "text-foundation-text-dark-tertiary hover:text-foundation-accent-blue",
                    "flex items-center gap-1.5",
                  )}
                >
                  {copiedValue === cssCode ? (
                    <>
                      <IconCheck className="size-3 text-foundation-accent-success" /> Copied
                    </>
                  ) : (
                    <>
                      <IconCopy className="size-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-foundation-bg-dark-3 text-xs font-mono text-foundation-text-dark-primary overflow-x-auto whitespace-pre border border-foundation-bg-dark-4">
                {cssCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FontFamilyCard({
  name,
  family,
  weights,
  sample,
  onCopy,
  copiedValue,
}: {
  name: string;
  family: string;
  weights: string[];
  sample: string;
  onCopy: (v: string) => void;
  copiedValue: string | null;
}) {
  const fontValue = `font-family: ${family};`;
  return (
    <div className="rounded-2xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 p-6 transition-all duration-200 hover:shadow-lg hover:border-foundation-accent-blue/20">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foundation-text-dark-primary">{name}</h3>
          <p className="text-xs text-foundation-text-dark-tertiary font-mono mt-1">{family}</p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(fontValue)}
          aria-label={`Copy ${name} font family`}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "hover:bg-foundation-bg-dark-3 hover:scale-105 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
          )}
        >
          {copiedValue === fontValue ? (
            <IconCheck className="size-4 text-foundation-accent-success" />
          ) : (
            <IconCopy className="size-4 text-foundation-icon-dark-tertiary hover:text-foundation-icon-dark-primary transition-colors" />
          )}
        </button>
      </div>
      <div className="mb-5 p-5 rounded-xl bg-foundation-bg-dark-3/50 border border-foundation-bg-dark-3">
        <div
          className="text-6xl text-foundation-text-dark-primary mb-3 font-semibold"
          style={{ fontFamily: family }}
        >
          {sample}
        </div>
        <div className="flex gap-2 flex-wrap">
          {weights.map((w) => (
            <span
              key={w}
              className="text-xs px-2.5 py-1 rounded-full bg-foundation-bg-dark-3 text-foundation-text-dark-secondary font-medium border border-foundation-bg-dark-4"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
      <div className="text-xs text-foundation-text-dark-tertiary font-mono leading-relaxed space-y-1">
        <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
        <div>abcdefghijklmnopqrstuvwxyz</div>
        <div>0123456789 !@#$%^&*()</div>
      </div>
    </div>
  );
}

// Stat Card
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-5 bg-foundation-bg-dark-2 border border-foundation-bg-dark-3 shadow-sm hover:shadow-md transition-all duration-200 hover:border-foundation-accent-blue/30">
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-lg bg-foundation-accent-blue/10 flex items-center justify-center shrink-0 border border-foundation-accent-blue/20">
          <div className="text-foundation-accent-blue">{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-semibold text-foundation-text-dark-primary tabular-nums">
            {value}
          </div>
          <div className="text-sm text-foundation-text-dark-secondary mt-1 leading-tight">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

/** TypographyShowcase displays all typography tokens with preview, specs, and code views. */
export function TypographyShowcase() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [toastVisible, setToastVisible] = useState(false);

  const copyToClipboard = useCallback(async (value: string) => {
    try {
      await copyToClipboardUtil(value);
      setCopiedValue(value);
      setToastVisible(true);
      setTimeout(() => {
        setCopiedValue(null);
        setToastVisible(false);
      }, 2000);
    } catch {
      /* ignore */
    }
  }, []);

  const typeStyles: TypeStyle[] = [
    {
      name: "heading-1",
      displayName: "Heading 1",
      size: `${typography.web.heading1.size}px`,
      weight: `${typography.web.heading1.weight}`,
      lineHeight: `${typography.web.heading1.lineHeight}px`,
      letterSpacing: `${typography.web.heading1.tracking}px`,
      className: "text-heading-1",
      description: "Page titles, hero sections",
    },
    {
      name: "heading-2",
      displayName: "Heading 2",
      size: `${typography.web.heading2.size}px`,
      weight: `${typography.web.heading2.weight}`,
      lineHeight: `${typography.web.heading2.lineHeight}px`,
      letterSpacing: `${typography.web.heading2.tracking}px`,
      className: "text-heading-2",
      description: "Section headers",
    },
    {
      name: "heading-3",
      displayName: "Heading 3",
      size: `${typography.web.heading3.size}px`,
      weight: `${typography.web.heading3.weight}`,
      lineHeight: `${typography.web.heading3.lineHeight}px`,
      letterSpacing: `${typography.web.heading3.tracking}px`,
      className: "text-heading-3",
      description: "Subsection headers, card titles",
    },
    {
      name: "body",
      displayName: "Body",
      size: `${typography.web.body.size}px`,
      weight: `${typography.web.body.weight}`,
      lineHeight: `${typography.web.body.lineHeight}px`,
      letterSpacing: `${typography.web.body.tracking}px`,
      className: "text-body",
      description: "Primary content, paragraphs",
    },
    {
      name: "body-small",
      displayName: "Body Small",
      size: `${typography.web.bodySmall.size}px`,
      weight: `${typography.web.bodySmall.weight}`,
      lineHeight: `${typography.web.bodySmall.lineHeight}px`,
      letterSpacing: `${typography.web.bodySmall.tracking}px`,
      className: "text-body-small",
      description: "Secondary content, descriptions",
    },
    {
      name: "caption",
      displayName: "Caption",
      size: `${typography.web.caption.size}px`,
      weight: `${typography.web.caption.weight}`,
      lineHeight: `${typography.web.caption.lineHeight}px`,
      letterSpacing: `${typography.web.caption.tracking}px`,
      className: "text-caption",
      description: "Labels, metadata, timestamps",
    },
  ];

  const fontFamilies = [
    {
      name: "SF Pro (Sans-serif)",
      family: typography.fontFamily,
      weights: ["400 Regular", "600 Semibold"],
      sample: "Aa Gg",
    },
    {
      name: "SF Mono (Monospace)",
      family: "SF Mono, Consolas, monospace",
      weights: ["400 Regular", "600 Semibold"],
      sample: "Aa Gg",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-foundation-accent-blue to-foundation-accent-purple flex items-center justify-center shadow-lg">
                <IconType className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foundation-text-dark-primary">
                  Typography System
                </h2>
                <p className="text-sm text-foundation-text-dark-secondary mt-0.5">
                  Complete type scale with {typeStyles.length} text styles
                </p>
              </div>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex gap-1.5 p-1.5 rounded-xl bg-foundation-bg-dark-2 border border-foundation-bg-dark-3 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                viewMode === "preview"
                  ? "bg-foundation-bg-dark-3 text-foundation-text-dark-primary shadow-sm scale-[1.02]"
                  : "text-foundation-text-dark-tertiary hover:text-foundation-text-dark-secondary hover:bg-foundation-bg-dark-3/50",
              )}
            >
              <IconEye className={cn("size-4", viewMode === "preview" && "text-foundation-accent-blue")} />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("specs")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                viewMode === "specs"
                  ? "bg-foundation-bg-dark-3 text-foundation-text-dark-primary shadow-sm scale-[1.02]"
                  : "text-foundation-text-dark-tertiary hover:text-foundation-text-dark-secondary hover:bg-foundation-bg-dark-3/50",
              )}
            >
              <IconSpecs className={cn("size-4", viewMode === "specs" && "text-foundation-accent-blue")} />
              <span>Specs</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("code")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                viewMode === "code"
                  ? "bg-foundation-bg-dark-3 text-foundation-text-dark-primary shadow-sm scale-[1.02]"
                  : "text-foundation-text-dark-tertiary hover:text-foundation-text-dark-secondary hover:bg-foundation-bg-dark-3/50",
              )}
            >
              <IconCode className={cn("size-4", viewMode === "code" && "text-foundation-accent-blue")} />
              <span>Code</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Text Styles"
            value={typeStyles.length}
            icon={<IconType className="size-5" />}
          />
          <StatCard
            label="Font Families"
            value={fontFamilies.length}
            icon={<IconFont className="size-5" />}
          />
          <StatCard
            label="Font Weights"
            value={2}
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10M12 21V3m3 6H9" />
              </svg>
            }
          />
          <StatCard
            label="View Modes"
            value={3}
            icon={<IconEye className="size-5" />}
          />
        </div>
      </div>

      {/* Font Families Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-foundation-bg-dark-3" />
          <h3 className="text-lg font-semibold text-foundation-text-dark-primary flex items-center gap-2">
            <IconFont className="size-5 text-foundation-accent-blue" />
            Font Families
          </h3>
          <div className="h-px flex-1 bg-foundation-bg-dark-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fontFamilies.map((f) => (
            <FontFamilyCard
              key={f.name}
              {...f}
              onCopy={copyToClipboard}
              copiedValue={copiedValue}
            />
          ))}
        </div>
      </section>

      {/* Headings Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-foundation-bg-dark-3" />
          <h3 className="text-lg font-semibold text-foundation-text-dark-primary">Headings</h3>
          <div className="h-px flex-1 bg-foundation-bg-dark-3" />
        </div>
        <div className="space-y-4">
          {typeStyles
            .filter((s) => s.name.startsWith("heading"))
            .map((style) => (
              <TypeStyleCard
                key={style.name}
                style={style}
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
                viewMode={viewMode}
              />
            ))}
        </div>
      </section>

      {/* Body Text Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-foundation-bg-dark-3" />
          <h3 className="text-lg font-semibold text-foundation-text-dark-primary">Body Text</h3>
          <div className="h-px flex-1 bg-foundation-bg-dark-3" />
        </div>
        <div className="space-y-4">
          {typeStyles
            .filter((s) => s.name.startsWith("body") || s.name === "caption")
            .map((style) => (
              <TypeStyleCard
                key={style.name}
                style={style}
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
                viewMode={viewMode}
              />
            ))}
        </div>
      </section>

      {/* Usage Examples Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-foundation-bg-dark-3" />
          <h3 className="text-lg font-semibold text-foundation-text-dark-primary flex items-center gap-2">
            <svg className="size-5 text-foundation-accent-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Usage Examples
          </h3>
          <div className="h-px flex-1 bg-foundation-bg-dark-3" />
        </div>
        <div className="rounded-2xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 p-6 space-y-6">
          <div>
            <h4 className="text-heading-3 text-foundation-text-dark-primary mb-3">Section Title</h4>
            <p className="text-body text-foundation-text-dark-secondary leading-relaxed">
              This is a typical section with a heading and body text. The heading uses heading-3
              style while the body uses regular body text for optimal readability.
            </p>
          </div>
          <div className="h-px bg-foundation-bg-dark-3" />
          <div className="flex items-center gap-4">
            <span className="text-body-small text-foundation-text-dark-tertiary font-medium">Label:</span>
            <span className="text-body text-foundation-text-dark-primary">Value text</span>
          </div>
          <div className="h-px bg-foundation-bg-dark-3" />
          <div>
            <p className="text-caption text-foundation-text-dark-tertiary mb-2 font-medium uppercase tracking-wider">
              Caption or metadata
            </p>
            <p className="text-body-small text-foundation-text-dark-primary">
              Supporting information with smaller text
            </p>
          </div>
        </div>
      </section>

      <Toast message="Copied to clipboard!" value={copiedValue ?? ""} visible={toastVisible} />
    </div>
  );
}