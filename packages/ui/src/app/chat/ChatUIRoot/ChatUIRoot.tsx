import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChatSidebar } from "../ChatSidebar";
import { ChatHeader } from "../ChatHeader";
import { ChatView } from "../ChatView";
import { ComposeView } from "../ComposeView";
import { useControllableState } from "../../../hooks/useControllableState";
import { ChatUISlotsProvider, type ChatUISlots } from "../shared/slots";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Layout modes for the chat UI.
 */
export type ChatUIMode = "twoPane" | "full" | "dashboard";

/**
 * Model metadata used by the chat header and composer.
 */
export interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
}

/**
 * Props for the chat UI root container.
 */
export interface ChatUIRootProps extends StatefulComponentProps {
  mode?: ChatUIMode;
  defaultMode?: ChatUIMode;
  onModeChange?: (mode: ChatUIMode) => void;

  /** Unified sidebar open state (inline or overlay depending on mode/viewport). */
  sidebarOpen?: boolean;

  /** Default sidebar open state for uncontrolled usage. */
  defaultSidebarOpen?: boolean;

  onSidebarOpenChange?: (open: boolean) => void;

  viewMode?: "chat" | "compose";
  defaultViewMode?: "chat" | "compose";
  onViewModeChange?: (mode: "chat" | "compose") => void;

  /** Optional: allow caller to set a starting model */
  defaultModel?: ModelConfig;

  /**
   * Breakpoint for mobile overlay behavior.
   * Default: 768px
   */
  mobileBreakpointPx?: number;

  /**
   * Optional: called when the user toggles sidebar
   * desktopOpen = inline sidebar open state
   * overlayOpen = overlay drawer open state
   */
  onSidebarToggle?: (next: { desktopOpen: boolean; overlayOpen: boolean }) => void;

  /** Slot: Custom content on the right side of header (action buttons) */
  headerRight?: ReactNode;

  /** Template-level slot(s) */
  slots?: ChatUISlots;

  /** Slot: Custom content left of composer input */
  composerLeft?: ReactNode;

  /** Slot: Custom content right of composer input (send/attach controls) */
  composerRight?: ReactNode;

  /** Slot: Custom empty state when no messages */
  emptyState?: ReactNode;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}

function getFocusable(container: HTMLElement) {
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );
}

/**
 * Renders the full chat UI shell with sidebar, header, and content.
 *
 * Supports stateful props for loading, error, and disabled states.
 * When loading, shows loading overlay over main content.
 * When error, shows error message overlay.
 * When disabled, disables all interactive elements.
 *
 * Accessibility contract:
 * - When sidebar opens as an overlay, focus is restored to the previously
 *     focused element on close.
 *
 * @param props - Chat UI root props and stateful options.
 * @returns The full chat UI layout.
 *
 * @example
 * ```tsx
 * <ChatUIRoot mode="twoPane" />
 * <ChatUIRoot loading />
 * <ChatUIRoot error="Failed to load chat" />
 * ```
 */
export function ChatUIRoot({
  mode: modeProp,
  defaultMode = "twoPane",
  onModeChange,
  sidebarOpen: sidebarOpenProp,
  defaultSidebarOpen = true,
  onSidebarOpenChange,
  viewMode: viewModeProp,
  defaultViewMode = "chat",
  onViewModeChange,
  defaultModel,
  mobileBreakpointPx = 768,
  onSidebarToggle,
  headerRight,
  slots,
  composerLeft,
  composerRight,
  emptyState,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
}: ChatUIRootProps) {
  // Determine effective state (priority: loading > error > disabled > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;

  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpointPx}px)`);
  const slotsValue = useMemo(() => slots ?? {}, [slots]);

  const [mode] = useControllableState({
    value: modeProp,
    defaultValue: defaultMode,
    onChange: onModeChange,
  });

  const [sidebarOpen, setSidebarOpen] = useControllableState({
    value: sidebarOpenProp,
    defaultValue: defaultSidebarOpen,
    onChange: onSidebarOpenChange,
  });

  // Track focus to restore after closing overlay.
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const wasOverlayOpenRef = useRef(false);
  const overlayDrawerRef = useRef<HTMLDivElement | null>(null);

  // Local state (replace later with your real data model/host adapter)
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(
    defaultModel ?? {
      name: "Auto",
      shortName: "Auto",
      description: "Decides how long to think",
    },
  );
  const [viewMode, setViewMode] = useControllableState<"chat" | "compose">({
    value: viewModeProp,
    defaultValue: defaultViewMode,
    onChange: onViewModeChange,
  });

  const canShowSidebar = mode === "twoPane" || mode === "full";

  const sidebarBehavior: "none" | "inline" | "overlay" = !canShowSidebar
    ? "none"
    : mode === "twoPane"
      ? isMobile
        ? "overlay"
        : "inline"
      : "overlay"; // mode === "full"

  const emitToggle = useCallback(
    (nextOpen: boolean) => {
      if (!onSidebarToggle) return;
      onSidebarToggle({
        desktopOpen: sidebarBehavior === "inline" ? nextOpen : false,
        overlayOpen: sidebarBehavior === "overlay" ? nextOpen : false,
      });
    },
    [onSidebarToggle, sidebarBehavior],
  );

  const closeOverlay = useCallback(() => {
    setSidebarOpen(false);
    emitToggle(false);

    const el = lastActiveElementRef.current;
    if (el && typeof el.focus === "function") el.focus();
    lastActiveElementRef.current = null;
  }, [emitToggle, setSidebarOpen]);

  const toggleSidebar = useCallback(() => {
    if (sidebarBehavior === "none") return;

    if (sidebarBehavior === "overlay") {
      if (!sidebarOpen) {
        lastActiveElementRef.current = document.activeElement as HTMLElement | null;
        setSidebarOpen(true);
        emitToggle(true);
      } else {
        closeOverlay();
      }
      return;
    }

    setSidebarOpen((prev) => {
      const next = !prev;
      emitToggle(next);
      return next;
    });
  }, [sidebarBehavior, sidebarOpen, closeOverlay, emitToggle, setSidebarOpen]);

  const isOverlayOpen = sidebarBehavior === "overlay" && sidebarOpen;

  useEffect(() => {
    if (isOverlayOpen && !lastActiveElementRef.current) {
      lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    }
  }, [isOverlayOpen]);

  useEffect(() => {
    const wasOpen = wasOverlayOpenRef.current;
    if (wasOpen && !isOverlayOpen) {
      const el = lastActiveElementRef.current;
      if (el && typeof el.focus === "function") el.focus();
      lastActiveElementRef.current = null;
    }
    wasOverlayOpenRef.current = isOverlayOpen;
  }, [isOverlayOpen]);

  // Keyboard shortcut: Ctrl/Cmd + B toggles sidebar. Esc closes overlay.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && (e.key === "b" || e.key === "B")) {
        if (sidebarBehavior === "none") return;
        e.preventDefault();
        toggleSidebar();
      }

      if (isOverlayOpen && e.key === "Escape") {
        e.preventDefault();
        closeOverlay();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeOverlay, isOverlayOpen, sidebarBehavior, toggleSidebar]);

  // Focus trap for overlay drawer
  useEffect(() => {
    if (!isOverlayOpen) return;

    const drawer = overlayDrawerRef.current;
    if (!drawer) return;

    const focusFirst = () => {
      const focusables = getFocusable(drawer);
      (focusables[0] ?? drawer).focus?.();
    };

    const t = window.setTimeout(focusFirst, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusables = getFocusable(drawer);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOverlayOpen]);

  const sidebarOpenForHeader = sidebarBehavior === "none" ? false : sidebarOpen;
  const handleModelChange = useCallback((model: string | ModelConfig) => {
    if (typeof model === "string") {
      setSelectedModel({ name: model, shortName: model, description: "" });
      return;
    }
    setSelectedModel(model);
  }, []);

  const mainContent = useMemo(() => {
    if (mode === "dashboard") {
      return (
        <div className="flex-1 flex flex-col">
          <div className="p-4 text-text-secondary">Dashboard template placeholder</div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-background dark:bg-background">
        <ChatHeader
          isSidebarOpen={sidebarOpenForHeader}
          onSidebarToggle={toggleSidebar}
          showSidebarToggle={true}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          headerRight={headerRight}
        />

        {viewMode === "compose" ? (
          <ComposeView />
        ) : (
          <ChatView
            selectedModel={selectedModel}
            composerLeft={composerLeft}
            composerRight={composerRight}
            emptyState={emptyState}
          />
        )}
      </div>
    );
  }, [
    mode,
    sidebarOpenForHeader,
    toggleSidebar,
    selectedModel,
    handleModelChange,
    viewMode,
    setViewMode,
    headerRight,
    composerLeft,
    composerRight,
    emptyState,
  ]);

  return (
    <div
      className="min-h-screen w-full flex bg-background dark:bg-background overflow-hidden"
      data-testid="chat-ui-root"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 dark:bg-background/80">
          <div className="text-muted-foreground">Loading chat...</div>
        </div>
      )}
      {/* Error overlay */}
      {error && !loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 dark:bg-background/80">
          <div className="text-status-error">{error}</div>
        </div>
      )}
      {/* Inline desktop sidebar (twoPane desktop only; Option B = fully hidden when closed) */}
      {sidebarBehavior === "inline" ? (
        <ChatUISlotsProvider value={slotsValue}>
          <ChatSidebar isOpen={true} onToggle={toggleSidebar} />
        </ChatUISlotsProvider>
      ) : null}

      {/* Overlay sidebar (twoPane mobile + full all sizes) */}
      {sidebarBehavior === "overlay" && sidebarOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-background/50 backdrop-blur-sm"
            onClick={closeOverlay}
          />

          <div
            ref={overlayDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
            tabIndex={-1}
            className="absolute left-0 top-0 h-full w-64 outline-none"
          >
            <ChatUISlotsProvider value={slotsValue}>
              <ChatSidebar isOpen={sidebarOpen} onToggle={closeOverlay} />
            </ChatUISlotsProvider>
          </div>
        </div>
      ) : null}

      <div className="flex-1 flex min-w-0 min-h-0">{mainContent}</div>
    </div>
  );
}
