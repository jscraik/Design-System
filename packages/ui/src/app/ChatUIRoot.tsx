import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { ComposeView } from "./components/ComposeView";

export type ChatUIMode = "twoPane" | "full" | "dashboard";

export interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
}

export interface ChatUIRootProps {
  mode?: ChatUIMode;

  /**
   * Desktop inline sidebar (twoPane only):
   * when false, sidebar is fully hidden (Option B).
   */
  defaultSidebarOpen?: boolean;

  /** Default main view: chat thread vs compose view */
  defaultViewMode?: "chat" | "compose";

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
    "[tabindex]:not([tabindex=\"-1\"])",
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
  );
}

export function ChatUIRoot({
  mode = "twoPane",
  defaultSidebarOpen = true,
  defaultViewMode = "chat",
  defaultModel,
  mobileBreakpointPx = 768,
  onSidebarToggle,
}: ChatUIRootProps) {
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpointPx}px)`);

  // Inline desktop sidebar (twoPane only; Option B = fully hidden when false).
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(defaultSidebarOpen);

  // Overlay drawer (twoPane mobile + full all sizes).
  const [overlaySidebarOpen, setOverlaySidebarOpen] = useState(false);

  // Track focus to restore after closing overlay.
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const overlayDrawerRef = useRef<HTMLDivElement | null>(null);

  // Local state (replace later with your real data model/host adapter)
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(
    defaultModel ?? {
      name: "ChatGPT 5.2 Pro",
      shortName: "5.2 Pro",
      description: "Our most capable model",
    }
  );
  const [viewMode, setViewMode] = useState<"chat" | "compose">(defaultViewMode);

  const canShowSidebar = mode === "twoPane" || mode === "full";

  const sidebarBehavior: "none" | "inline" | "overlay" = !canShowSidebar
    ? "none"
    : mode === "twoPane"
      ? (isMobile ? "overlay" : "inline")
      : "overlay"; // mode === "full"

  const emitToggle = useCallback(
    (next: { desktopOpen: boolean; overlayOpen: boolean }) => {
      onSidebarToggle?.(next);
    },
    [onSidebarToggle]
  );

  const closeOverlay = useCallback(() => {
    setOverlaySidebarOpen(false);
    emitToggle({ desktopOpen: desktopSidebarOpen, overlayOpen: false });

    const el = lastActiveElementRef.current;
    if (el && typeof el.focus === "function") el.focus();
    lastActiveElementRef.current = null;
  }, [desktopSidebarOpen, emitToggle]);

  const toggleSidebar = useCallback(() => {
    if (sidebarBehavior === "none") return;

    if (sidebarBehavior === "inline") {
      setDesktopSidebarOpen((prev) => {
        const next = !prev;
        emitToggle({ desktopOpen: next, overlayOpen: false });
        return next;
      });
      return;
    }

    // overlay behavior
    if (!overlaySidebarOpen) {
      lastActiveElementRef.current = document.activeElement as HTMLElement | null;
      setOverlaySidebarOpen(true);
      emitToggle({ desktopOpen: desktopSidebarOpen, overlayOpen: true });
    } else {
      closeOverlay();
    }
  }, [
    sidebarBehavior,
    overlaySidebarOpen,
    closeOverlay,
    desktopSidebarOpen,
    emitToggle,
  ]);

  // If we move from mobile (overlay) to desktop inline in twoPane, close overlay.
  useEffect(() => {
    if (mode !== "twoPane") return;
    if (sidebarBehavior === "inline" && overlaySidebarOpen) closeOverlay();
  }, [closeOverlay, mode, overlaySidebarOpen, sidebarBehavior]);

  // Keyboard shortcut: Ctrl/Cmd + B toggles sidebar. Esc closes overlay.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && (e.key === "b" || e.key === "B")) {
        if (sidebarBehavior === "none") return;
        e.preventDefault();
        toggleSidebar();
      }

      if (overlaySidebarOpen && e.key === "Escape") {
        e.preventDefault();
        closeOverlay();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeOverlay, overlaySidebarOpen, sidebarBehavior, toggleSidebar]);

  // Focus trap for overlay drawer
  useEffect(() => {
    if (!overlaySidebarOpen) return;

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
  }, [overlaySidebarOpen]);

  const sidebarOpenForHeader =
    sidebarBehavior === "inline"
      ? desktopSidebarOpen
      : sidebarBehavior === "overlay"
        ? overlaySidebarOpen
        : false;

  const mainContent = useMemo(() => {
    if (mode === "dashboard") {
      return (
        <div className="flex-1 flex flex-col">
          <div className="p-4 text-white/80">Dashboard template placeholder</div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-[#0D0D0D]">
        <ChatHeader
          isSidebarOpen={sidebarOpenForHeader}
          onSidebarToggle={toggleSidebar}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === "compose" ? (
          <ComposeView />
        ) : (
          <>
            <ChatMessages />
            <ChatInput selectedModel={selectedModel} />
          </>
        )}
      </div>
    );
  }, [
    mode,
    sidebarOpenForHeader,
    toggleSidebar,
    selectedModel,
    viewMode,
  ]);

  return (
    <div className="size-full flex bg-[#212121] dark">
      {/* Inline desktop sidebar (twoPane desktop only; Option B = fully hidden when closed) */}
      {sidebarBehavior === "inline" ? (
        <ChatSidebar isOpen={desktopSidebarOpen} onToggle={toggleSidebar} />
      ) : null}

      {/* Overlay sidebar (twoPane mobile + full all sizes) */}
      {sidebarBehavior === "overlay" && overlaySidebarOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/50"
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
            <ChatSidebar isOpen={true} onToggle={closeOverlay} />
          </div>
        </div>
      ) : null}

      <div className="flex-1 flex min-w-0">{mainContent}</div>
    </div>
  );
}
