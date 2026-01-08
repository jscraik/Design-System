import React, { useState, useCallback } from "react";

import { copyToClipboard as copyToClipboardUtil } from "../utils/clipboard";
import { colors } from "../design-tokens";

import { cn } from "./ui/utils";

// Types
type ViewMode = "grid" | "detailed";

// Icons
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

function IconPalette({ className }: { className?: string }) {
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
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
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

function IconSparkles({ className }: { className?: string }) {
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
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
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
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

function IconLayers({ className }: { className?: string }) {
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
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
}

function IconSwatches({ className }: { className?: string }) {
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
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  );
}

// Color Swatch
interface ColorSwatchProps {
  name: string;
  value: string;
  onCopy: (value: string) => void;
  isCopied: boolean;
  isDark?: boolean;
  variant?: "compact" | "detailed";
}

function ColorSwatch({
  name,
  value,
  onCopy,
  isCopied,
  isDark = true,
  variant = "compact",
}: ColorSwatchProps) {
  const textClass = isDark
    ? "text-foundation-text-dark-primary"
    : "text-foundation-text-light-primary";
  const valueClass = isDark
    ? "text-foundation-text-dark-tertiary"
    : "text-foundation-text-light-tertiary";
  const borderClass = isDark ? "border-foundation-bg-dark-3" : "border-foundation-bg-light-3";

  if (variant === "detailed") {
    return (
      <button
        type="button"
        onClick={() => onCopy(value)}
        aria-label={`Copy ${name}: ${value}`}
        className={cn(
          "group flex flex-col gap-3 text-left transition-all duration-200",
          "hover:scale-[1.02] active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-foundation-bg-light-1 dark:focus-visible:ring-offset-foundation-bg-dark-1",
          "rounded-xl",
        )}
      >
        <div className="relative overflow-hidden rounded-xl">
          <div
            className={cn(
              "h-28 w-full rounded-xl border-2 shadow-sm",
              "transition-all duration-200",
              "group-hover:shadow-lg group-hover:border-foundation-accent-blue/40",
              "group-active:scale-[0.98]",
              borderClass,
            )}
            style={{ backgroundColor: value }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-xl">
            <div className="bg-white/95 dark:bg-foundation-bg-dark-2/95 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-200 shadow-xl border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
              {isCopied ? (
                <IconCheck className="size-4 text-foundation-accent-success" />
              ) : (
                <IconCopy className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col px-1 space-y-1">
          <p className={cn("text-sm font-medium leading-tight", textClass)}>{name}</p>
          <p
            className={cn(
              "text-xs font-mono leading-tight",
              "group-hover:text-foundation-accent-blue transition-colors duration-200",
              valueClass,
            )}
          >
            {value}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      aria-label={`Copy ${name}: ${value}`}
      className={cn(
        "group flex items-center gap-3 w-full text-left p-2.5 rounded-lg",
        "transition-all duration-200",
        "hover:bg-foundation-bg-light-2/70 dark:hover:bg-foundation-bg-dark-3/70",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
      )}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            "size-12 rounded-lg border shadow-sm",
            "transition-all duration-200",
            "group-hover:shadow-md group-hover:scale-105 group-hover:border-foundation-accent-blue/30",
            borderClass,
          )}
          style={{ backgroundColor: value }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isCopied ? (
            <IconCheck className="size-4 text-white drop-shadow-lg" />
          ) : (
            <IconCopy className="size-3.5 text-white drop-shadow-lg" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className={cn("text-sm font-medium truncate leading-tight", textClass)}>{name}</div>
        <div
          className={cn(
            "text-xs font-mono truncate leading-tight",
            "group-hover:text-foundation-accent-blue transition-colors duration-200",
            valueClass,
          )}
        >
          {value}
        </div>
      </div>
    </button>
  );
}

// Color Group
interface ColorGroupProps {
  title: string;
  colors: Record<string, string>;
  isDark?: boolean;
  onCopy: (value: string) => void;
  copiedValue: string | null;
  variant?: "compact" | "detailed";
  icon?: React.ReactNode;
}

function ColorGroup({
  title,
  colors,
  isDark = true,
  onCopy,
  copiedValue,
  variant = "compact",
  icon,
}: ColorGroupProps) {
  const entries = Object.entries(colors);
  const groupClass = isDark
    ? "bg-foundation-bg-dark-2 border-foundation-bg-dark-3"
    : "bg-foundation-bg-light-1 border-foundation-bg-light-3";
  const textClass = isDark
    ? "text-foundation-text-dark-primary"
    : "text-foundation-text-light-primary";
  const subtleClass = isDark
    ? "text-foundation-text-dark-tertiary"
    : "text-foundation-text-light-tertiary";

  if (variant === "detailed") {
    return (
      <div
        className={cn(
          "rounded-2xl p-6 shadow-sm border",
          "transition-all duration-200 hover:shadow-md hover:border-foundation-accent-blue/20",
          groupClass,
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={cn(
                  "p-2.5 rounded-lg shadow-sm",
                  isDark
                    ? "bg-foundation-bg-dark-3 text-foundation-icon-dark-secondary"
                    : "bg-foundation-bg-light-2 text-foundation-icon-light-secondary",
                )}
              >
                {icon}
              </div>
            )}
            <h3 className={cn("font-semibold text-base", textClass)}>{title}</h3>
          </div>
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              "border",
              isDark
                ? "bg-foundation-bg-dark-3 border-foundation-bg-dark-4"
                : "bg-foundation-bg-light-2 border-foundation-bg-light-3",
              subtleClass,
            )}
          >
            {entries.length} {entries.length === 1 ? "color" : "colors"}
          </span>
        </div>
        <div
          className={cn(
            "h-px w-full mb-6",
            isDark ? "bg-foundation-bg-dark-3" : "bg-foundation-bg-light-3",
          )}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {entries.map(([n, v]) => (
            <ColorSwatch
              key={n}
              name={n}
              value={v}
              onCopy={onCopy}
              isCopied={copiedValue === v}
              isDark={isDark}
              variant="detailed"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl p-5 border shadow-sm hover:shadow-md transition-all duration-200", groupClass)}>
      <h3 className={cn("text-sm font-semibold mb-4", textClass)}>{title}</h3>
      <div className="space-y-0.5">
        {entries.map(([n, v]) => (
          <ColorSwatch
            key={n}
            name={n}
            value={v}
            onCopy={onCopy}
            isCopied={copiedValue === v}
            isDark={isDark}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}

// CSS Variable Swatch
function CSSVariableSwatch({
  name,
  description,
  onCopy,
  isCopied,
}: {
  name: string;
  description: string;
  onCopy: (v: string) => void;
  isCopied: boolean;
}) {
  const copyValue = `var(${name})`;
  return (
    <button
      type="button"
      onClick={() => onCopy(copyValue)}
      aria-label={`Copy ${name}`}
      className={cn(
        "group flex items-center gap-3 w-full text-left p-2.5 rounded-lg",
        "transition-all duration-200",
        "hover:bg-foundation-bg-dark-3/70 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
      )}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            "size-12 rounded-lg border border-foundation-bg-dark-3 shadow-sm",
            "transition-all duration-200",
            "group-hover:shadow-md group-hover:scale-105 group-hover:border-foundation-accent-blue/30",
          )}
          style={{ backgroundColor: `var(${name})` }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isCopied ? (
            <IconCheck className="size-4 text-white drop-shadow-lg" />
          ) : (
            <IconCopy className="size-3.5 text-white drop-shadow-lg" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="text-sm font-medium text-foundation-text-dark-primary truncate leading-tight">
          {description}
        </div>
        <div className="text-xs font-mono text-foundation-text-dark-tertiary truncate group-hover:text-foundation-accent-blue transition-colors duration-200 leading-tight">
          {name}
        </div>
      </div>
    </button>
  );
}

// Toast
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
        <p className="text-xs font-mono text-foundation-text-dark-secondary mt-0.5 truncate leading-tight">{value}</p>
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

/** ColorShowcase displays all foundation color tokens with Grid and Detailed views. Click any color to copy. */
export function ColorShowcase() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
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

  const getCategoryIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("text")) return <IconType className="size-4" />;
    if (t.includes("icon")) return <IconSparkles className="size-4" />;
    if (t.includes("accent")) return <IconSwatches className="size-4" />;
    return <IconPalette className="size-4" />;
  };

  // Calculate stats
  const totalColors = 
    Object.keys(colors.background.dark).length +
    Object.keys(colors.background.light).length +
    Object.keys(colors.text.dark).length +
    Object.keys(colors.text.light).length +
    Object.keys(colors.icon.dark).length +
    Object.keys(colors.icon.light).length +
    Object.keys(colors.accent.dark).length +
    Object.keys(colors.accent.light).length;

  const categories = 8; // background, text, icon, accent × 2 (light/dark)

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-foundation-accent-blue to-foundation-accent-purple flex items-center justify-center shadow-lg">
                <IconPalette className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foundation-text-dark-primary">
                  Color System
                </h2>
                <p className="text-sm text-foundation-text-dark-secondary mt-0.5">
                  Complete foundation color palette with light & dark themes
                </p>
              </div>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex gap-1.5 p-1.5 rounded-xl bg-foundation-bg-dark-2 border border-foundation-bg-dark-3 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                viewMode === "grid"
                  ? "bg-foundation-bg-dark-3 text-foundation-text-dark-primary shadow-sm scale-[1.02]"
                  : "text-foundation-text-dark-tertiary hover:text-foundation-text-dark-secondary hover:bg-foundation-bg-dark-3/50",
              )}
            >
              <IconGrid className={cn("size-4", viewMode === "grid" && "text-foundation-accent-blue")} />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("detailed")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                viewMode === "detailed"
                  ? "bg-foundation-bg-dark-3 text-foundation-text-dark-primary shadow-sm scale-[1.02]"
                  : "text-foundation-text-dark-tertiary hover:text-foundation-text-dark-secondary hover:bg-foundation-bg-dark-3/50",
              )}
            >
              <IconLayers className={cn("size-4", viewMode === "detailed" && "text-foundation-accent-blue")} />
              <span>Detailed</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Colors"
            value={totalColors}
            icon={<IconPalette className="size-5" />}
          />
          <StatCard
            label="Categories"
            value={categories}
            icon={<IconLayers className="size-5" />}
          />
          <StatCard
            label="Themes"
            value={2}
            icon={<IconSparkles className="size-5" />}
          />
          <StatCard
            label="View Modes"
            value={2}
            icon={<IconGrid className="size-5" />}
          />
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="space-y-8">
          {/* Dark Theme */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-foundation-bg-dark-3" />
              <h2 className="text-lg font-semibold text-foundation-text-dark-primary flex items-center gap-2">
                <div className="size-2 rounded-full bg-foundation-text-dark-primary" />
                Dark Theme
              </h2>
              <div className="h-px flex-1 bg-foundation-bg-dark-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ColorGroup
                title="Backgrounds"
                colors={colors.background.dark}
                isDark
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
              />
              <ColorGroup
                title="Text"
                colors={colors.text.dark}
                isDark
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
              />
              <ColorGroup
                title="Icons"
                colors={colors.icon.dark}
                isDark
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
              />
              <ColorGroup
                title="Accents"
                colors={colors.accent.dark}
                isDark
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
              />
            </div>
          </section>

          {/* Light Theme */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-foundation-bg-dark-3" />
              <h2 className="text-lg font-semibold text-foundation-text-dark-primary flex items-center gap-2">
                <div className="size-2 rounded-full bg-foundation-text-dark-secondary" />
                Light Theme
              </h2>
              <div className="h-px flex-1 bg-foundation-bg-dark-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ColorGroup
                title="Backgrounds"
                colors={colors.background.light}
                isDark={false}
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
              />
              <ColorGroup
                title="Text"
                colors={colors.text.light}
                isDark={false}
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
              />
              <ColorGroup
                title="Icons"
                colors={colors.icon.light}
                isDark={false}
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
              />
              <ColorGroup
                title="Accents"
                colors={colors.accent.light}
                isDark={false}
                onCopy={copyToClipboard}
                copiedValue={copiedValue}
              />
            </div>
          </section>

          {/* CSS Variables */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-foundation-bg-dark-3" />
              <h2 className="text-lg font-semibold text-foundation-text-dark-primary flex items-center gap-2">
                <svg className="size-5 text-foundation-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                CSS Variables (Live)
              </h2>
              <div className="h-px flex-1 bg-foundation-bg-dark-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-5 border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-sm font-semibold mb-4 text-foundation-text-dark-primary">
                  Dark Backgrounds
                </h3>
                <div className="space-y-0.5">
                  {[
                    { name: "--foundation-bg-dark-1", desc: "Primary" },
                    { name: "--foundation-bg-dark-2", desc: "Secondary" },
                    { name: "--foundation-bg-dark-3", desc: "Tertiary" },
                    { name: "--foundation-bg-dark-4", desc: "Quaternary" },
                  ].map(({ name, desc }) => (
                    <CSSVariableSwatch
                      key={name}
                      name={name}
                      description={desc}
                      onCopy={copyToClipboard}
                      isCopied={copiedValue === `var(${name})`}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-5 border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-sm font-semibold mb-4 text-foundation-text-dark-primary">
                  Accent Colors
                </h3>
                <div className="space-y-0.5">
                  {[
                    { name: "--foundation-accent-blue", desc: "Blue" },
                    { name: "--foundation-accent-green", desc: "Green" },
                    { name: "--foundation-accent-orange", desc: "Orange" },
                    { name: "--foundation-accent-red", desc: "Red" },
                  ].map(({ name, desc }) => (
                    <CSSVariableSwatch
                      key={name}
                      name={name}
                      description={desc}
                      onCopy={copyToClipboard}
                      isCopied={copiedValue === `var(${name})`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Detailed View */}
      {viewMode === "detailed" && (
        <div className="space-y-6">
          <ColorGroup
            title="Backgrounds / Light Mode"
            colors={colors.background.light}
            isDark={false}
            onCopy={copyToClipboard}
            copiedValue={copiedValue}
            variant="detailed"
            icon={getCategoryIcon("background")}
          />
          <ColorGroup
            title="Backgrounds / Dark Mode"
            colors={colors.background.dark}
            isDark
            onCopy={copyToClipboard}
            copiedValue={copiedValue}
            variant="detailed"
            icon={getCategoryIcon("background")}
          />
          <ColorGroup
            title="Text / Light Mode"
            colors={colors.text.light}
            isDark={false}
            onCopy={copyToClipboard}
            copiedValue={copiedValue}
            variant="detailed"
            icon={getCategoryIcon("text")}
          />
          <ColorGroup
            title="Text / Dark Mode"
            colors={colors.text.dark}
            isDark
            onCopy={copyToClipboard}
            copiedValue={copiedValue}
            variant="detailed"
            icon={getCategoryIcon("text")}
          />
          <ColorGroup
            title="Icons / Light Mode"
            colors={colors.icon.light}
            isDark={false}
            onCopy={copyToClipboard}
            copiedValue={copiedValue}
            variant="detailed"
            icon={getCategoryIcon("icon")}
          />
          <ColorGroup
            title="Icons / Dark Mode"
            colors={colors.icon.dark}
            isDark
            onCopy={copyToClipboard}
            copiedValue={copiedValue}
            variant="detailed"
            icon={getCategoryIcon("icon")}
          />
          <ColorGroup
            title="Accents / Light Mode"
            colors={colors.accent.light}
            isDark={false}
            onCopy={copyToClipboard}
            copiedValue={copiedValue}
            variant="detailed"
            icon={getCategoryIcon("accent")}
          />
          <ColorGroup
            title="Accents / Dark Mode"
            colors={colors.accent.dark}
            isDark
            onCopy={copyToClipboard}
            copiedValue={copiedValue}
            variant="detailed"
            icon={getCategoryIcon("accent")}
          />
        </div>
      )}

      <Toast message="Copied to clipboard!" value={copiedValue ?? ""} visible={toastVisible} />
    </div>
  );
}
