import { typographyTokens } from "@design-studio/tokens";
import { useCallback, useState } from "react";

import { cn } from "../../components/ui/utils";

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
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );
}

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
  onCopy: (value: string) => void;
  copiedValue: string | null;
}) {
  const isCopied = copiedValue === family;
  return (
    <div className="rounded-xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold text-foundation-text-dark-primary">{name}</h4>
          <p className="text-sm text-foundation-text-dark-tertiary mt-1">{family}</p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(family)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            "border",
            isCopied
              ? "bg-foundation-accent-success/10 border-foundation-accent-success/30 text-foundation-accent-success"
              : "bg-foundation-bg-dark-3 border-foundation-bg-dark-3 text-foundation-text-dark-secondary hover:text-foundation-text-dark-primary",
          )}
        >
          {isCopied ? <IconCheck className="size-3" /> : <IconCopy className="size-3" />}
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
      <div
        className="mt-4 text-4xl text-foundation-text-dark-primary"
        style={{ fontFamily: family }}
      >
        {sample}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {weights.map((weight) => (
          <span
            key={weight}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-foundation-bg-dark-3 text-foundation-text-dark-secondary"
          >
            {weight}
          </span>
        ))}
      </div>
    </div>
  );
}

function TypeStyleCard({
  style,
  onCopy,
  copiedValue,
  viewMode,
}: {
  style: TypeStyle;
  onCopy: (value: string) => void;
  copiedValue: string | null;
  viewMode: ViewMode;
}) {
  const isCopied = copiedValue === style.className;

  return (
    <div className="rounded-xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foundation-text-dark-primary">
              {style.displayName}
            </span>
            <span className="text-xs text-foundation-text-dark-tertiary">{style.name}</span>
          </div>
          <p className="text-sm text-foundation-text-dark-secondary mt-1">{style.description}</p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(style.className)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            "border",
            isCopied
              ? "bg-foundation-accent-success/10 border-foundation-accent-success/30 text-foundation-accent-success"
              : "bg-foundation-bg-dark-3 border-foundation-bg-dark-3 text-foundation-text-dark-secondary hover:text-foundation-text-dark-primary",
          )}
        >
          {isCopied ? <IconCheck className="size-3" /> : <IconCopy className="size-3" />}
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4">
        {viewMode === "preview" && (
          <div className={cn(style.className, "text-foundation-text-dark-primary")}>
            The quick brown fox jumps over the lazy dog
          </div>
        )}
        {viewMode === "specs" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div>
              <div className="text-xs text-foundation-text-dark-tertiary">Size</div>
              <div className="text-sm font-mono text-foundation-text-dark-primary">
                {style.size}
              </div>
            </div>
            <div>
              <div className="text-xs text-foundation-text-dark-tertiary">Weight</div>
              <div className="text-sm font-mono text-foundation-text-dark-primary">
                {style.weight}
              </div>
            </div>
            <div>
              <div className="text-xs text-foundation-text-dark-tertiary">Line Height</div>
              <div className="text-sm font-mono text-foundation-text-dark-primary">
                {style.lineHeight}
              </div>
            </div>
            <div>
              <div className="text-xs text-foundation-text-dark-tertiary">Tracking</div>
              <div className="text-sm font-mono text-foundation-text-dark-primary">
                {style.letterSpacing}
              </div>
            </div>
          </div>
        )}
        {viewMode === "code" && (
          <div className="mt-2 rounded-lg bg-foundation-bg-dark-1 p-4 border border-foundation-bg-dark-3">
            <code className="text-sm font-mono text-foundation-text-dark-primary">
              className="{style.className}"
            </code>
          </div>
        )}
      </div>
    </div>
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
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95 pointer-events-none",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="size-9 rounded-full bg-foundation-accent-success/10 flex items-center justify-center shrink-0 border border-foundation-accent-success/20">
        <IconCheck className="size-5 text-foundation-accent-success" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foundation-text-dark-primary leading-tight">
          {message}
        </p>
        <p className="text-xs font-mono text-foundation-text-dark-secondary mt-0.5 truncate leading-tight max-w-[200px]">
          {value}
        </p>
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
      await navigator.clipboard.writeText(value);
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
      name: "hero",
      displayName: "Hero",
      size: `${typographyTokens.hero.size}px`,
      weight: `${typographyTokens.hero.weight}`,
      lineHeight: `${typographyTokens.hero.lineHeight}px`,
      letterSpacing: `${typographyTokens.hero.tracking}px`,
      className: "text-hero",
      description: "Hero headlines, landing intros",
    },
    {
      name: "h1",
      displayName: "H1",
      size: `${typographyTokens.h1.size}px`,
      weight: `${typographyTokens.h1.weight}`,
      lineHeight: `${typographyTokens.h1.lineHeight}px`,
      letterSpacing: `${typographyTokens.h1.tracking}px`,
      className: "text-h1",
      description: "Primary page titles",
    },
    {
      name: "h2",
      displayName: "H2",
      size: `${typographyTokens.h2.size}px`,
      weight: `${typographyTokens.h2.weight}`,
      lineHeight: `${typographyTokens.h2.lineHeight}px`,
      letterSpacing: `${typographyTokens.h2.tracking}px`,
      className: "text-h2",
      description: "Section headers",
    },
    {
      name: "h3",
      displayName: "H3",
      size: `${typographyTokens.h3.size}px`,
      weight: `${typographyTokens.h3.weight}`,
      lineHeight: `${typographyTokens.h3.lineHeight}px`,
      letterSpacing: `${typographyTokens.h3.tracking}px`,
      className: "text-h3",
      description: "Subsection headers",
    },
    {
      name: "h4",
      displayName: "H4",
      size: `${typographyTokens.h4.size}px`,
      weight: `${typographyTokens.h4.weight}`,
      lineHeight: `${typographyTokens.h4.lineHeight}px`,
      letterSpacing: `${typographyTokens.h4.tracking}px`,
      className: "text-h4",
      description: "Minor headings, labels",
    },
    {
      name: "h5",
      displayName: "H5",
      size: `${typographyTokens.h5.size}px`,
      weight: `${typographyTokens.h5.weight}`,
      lineHeight: `${typographyTokens.h5.lineHeight}px`,
      letterSpacing: `${typographyTokens.h5.tracking}px`,
      className: "text-h5",
      description: "Eyebrows, metadata headings",
    },
    {
      name: "h6",
      displayName: "H6",
      size: `${typographyTokens.h6.size}px`,
      weight: `${typographyTokens.h6.weight}`,
      lineHeight: `${typographyTokens.h6.lineHeight}px`,
      letterSpacing: `${typographyTokens.h6.tracking}px`,
      className: "text-h6",
      description: "Micro headings, overlines",
    },
    {
      name: "paragraph-lg",
      displayName: "Paragraph Lg",
      size: `${typographyTokens.paragraphLg.size}px`,
      weight: `${typographyTokens.paragraphLg.weight}`,
      lineHeight: `${typographyTokens.paragraphLg.lineHeight}px`,
      letterSpacing: `${typographyTokens.paragraphLg.tracking}px`,
      className: "text-paragraph-lg",
      description: "Intro body copy, longform emphasis",
    },
    {
      name: "paragraph-md",
      displayName: "Paragraph Md",
      size: `${typographyTokens.paragraphMd.size}px`,
      weight: `${typographyTokens.paragraphMd.weight}`,
      lineHeight: `${typographyTokens.paragraphMd.lineHeight}px`,
      letterSpacing: `${typographyTokens.paragraphMd.tracking}px`,
      className: "text-paragraph-md",
      description: "Default body copy",
    },
    {
      name: "paragraph-sm",
      displayName: "Paragraph Sm",
      size: `${typographyTokens.paragraphSm.size}px`,
      weight: `${typographyTokens.paragraphSm.weight}`,
      lineHeight: `${typographyTokens.paragraphSm.lineHeight}px`,
      letterSpacing: `${typographyTokens.paragraphSm.tracking}px`,
      className: "text-paragraph-sm",
      description: "Secondary body copy",
    },
    {
      name: "caption",
      displayName: "Caption",
      size: `${typographyTokens.caption.size}px`,
      weight: `${typographyTokens.caption.weight}`,
      lineHeight: `${typographyTokens.caption.lineHeight}px`,
      letterSpacing: `${typographyTokens.caption.tracking}px`,
      className: "text-caption",
      description: "Labels, metadata, timestamps",
    },
    {
      name: "heading-1",
      displayName: "Heading 1 (Legacy)",
      size: `${typographyTokens.heading1.size}px`,
      weight: `${typographyTokens.heading1.weight}`,
      lineHeight: `${typographyTokens.heading1.lineHeight}px`,
      letterSpacing: `${typographyTokens.heading1.tracking}px`,
      className: "text-heading-1",
      description: "Legacy heading token (use H1)",
    },
    {
      name: "heading-2",
      displayName: "Heading 2 (Legacy)",
      size: `${typographyTokens.heading2.size}px`,
      weight: `${typographyTokens.heading2.weight}`,
      lineHeight: `${typographyTokens.heading2.lineHeight}px`,
      letterSpacing: `${typographyTokens.heading2.tracking}px`,
      className: "text-heading-2",
      description: "Legacy heading token (use H2)",
    },
    {
      name: "heading-3",
      displayName: "Heading 3 (Legacy)",
      size: `${typographyTokens.heading3.size}px`,
      weight: `${typographyTokens.heading3.weight}`,
      lineHeight: `${typographyTokens.heading3.lineHeight}px`,
      letterSpacing: `${typographyTokens.heading3.tracking}px`,
      className: "text-heading-3",
      description: "Legacy heading token (use H3)",
    },
    {
      name: "body",
      displayName: "Body (Legacy)",
      size: `${typographyTokens.body.size}px`,
      weight: `${typographyTokens.body.weight}`,
      lineHeight: `${typographyTokens.body.lineHeight}px`,
      letterSpacing: `${typographyTokens.body.tracking}px`,
      className: "text-body",
      description: "Legacy body token (use Paragraph Md)",
    },
    {
      name: "body-small",
      displayName: "Body Small (Legacy)",
      size: `${typographyTokens.bodySmall.size}px`,
      weight: `${typographyTokens.bodySmall.weight}`,
      lineHeight: `${typographyTokens.bodySmall.lineHeight}px`,
      letterSpacing: `${typographyTokens.bodySmall.tracking}px`,
      className: "text-body-small",
      description: "Legacy body token (use Paragraph Sm)",
    },
  ];

  const fontFamilies = [
    {
      name: "SF Pro (Sans-serif)",
      family: typographyTokens.fontFamily,
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
                <IconType className="size-6 text-text-body-on-color" />
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
              <IconEye
                className={cn("size-4", viewMode === "preview" && "text-foundation-accent-blue")}
              />
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
              <IconSpecs
                className={cn("size-4", viewMode === "specs" && "text-foundation-accent-blue")}
              />
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
              <IconCode
                className={cn("size-4", viewMode === "code" && "text-foundation-accent-blue")}
              />
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
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10M12 21V3m3 6H9" />
              </svg>
            }
          />
          <StatCard
            label="Platform"
            value="Web"
            icon={
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 17L8.5 21m6-4l1.25 4m-4.75-4h5.5a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v9a2 2 0 002 2h5.5z"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Font Families */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foundation-text-dark-primary">Font Families</h3>
          <p className="text-sm text-foundation-text-dark-secondary mt-1">
            Primary typefaces used across the ChatGPT interface
          </p>
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

      {/* Type Styles */}
      <section className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foundation-text-dark-primary">Type Styles</h3>
          <p className="text-sm text-foundation-text-dark-secondary mt-1">
            Core typography scale for headings, body text, and captions
          </p>
        </div>

        {/* Headings */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foundation-text-dark-tertiary uppercase tracking-wider">
            Headings
          </h4>
          <div className="space-y-4">
            {typeStyles
              .filter((s) =>
                [
                  "hero",
                  "h1",
                  "h2",
                  "h3",
                  "h4",
                  "h5",
                  "h6",
                  "heading-1",
                  "heading-2",
                  "heading-3",
                ].includes(s.name),
              )
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
        </div>

        {/* Body Text */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foundation-text-dark-tertiary uppercase tracking-wider">
            Body Text
          </h4>
          <div className="space-y-4">
            {typeStyles
              .filter(
                (s) =>
                  s.name.startsWith("paragraph") ||
                  s.name.startsWith("body") ||
                  s.name === "caption",
              )
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
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foundation-text-dark-primary">
            Usage Examples
          </h3>
          <p className="text-sm text-foundation-text-dark-secondary mt-1">
            Typography applied in common interface patterns
          </p>
        </div>

        <div className="rounded-2xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 p-6 space-y-6">
          <div>
            <h4 className="text-h3 text-foundation-text-dark-primary mb-2">Section Title</h4>
            <p className="text-paragraph-md text-foundation-text-dark-secondary">
              This is a typical section with a heading and body text. The heading uses H3 while the
              body uses paragraph-md for optimal readability.
            </p>
          </div>
          <div className="h-px bg-foundation-bg-dark-3" />
          <div className="flex items-center gap-3">
            <span className="text-paragraph-sm text-foundation-text-dark-tertiary">Label:</span>
            <span className="text-paragraph-md text-foundation-text-dark-primary">Value text</span>
          </div>
          <div className="h-px bg-foundation-bg-dark-3" />
          <div>
            <p className="text-caption text-foundation-text-dark-tertiary mb-1">
              Caption or metadata
            </p>
            <p className="text-paragraph-sm text-foundation-text-dark-primary">
              Supporting information with smaller text
            </p>
          </div>
        </div>
      </section>

      <Toast message="Copied to clipboard!" value={copiedValue ?? ""} visible={toastVisible} />
    </div>
  );
}
