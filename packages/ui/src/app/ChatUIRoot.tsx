import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChatHeader } from "./components/chat/ChatHeader";
import { ChatInput } from "./components/chat/ChatInput";
import { ChatMessages, type ChatMessage } from "./components/chat/ChatMessages";
import { ChatSidebar, type ChatSidebarUser, type SidebarItem } from "./components/chat/ChatSidebar";
import { ComposeView } from "./components/chat/ComposeView";
import type { ModeConfig } from "./components/ui/navigation/mode-selector";
import type { ModelConfig } from "./components/ui/navigation/model-selector";
import { useControllableState } from "./hooks/useControllableState";
import { ChatUISlotsProvider, type ChatUISlots } from "./slots";

export type ChatUIMode = "twoPane" | "full" | "dashboard";

const FALLBACK_MODEL: ModelConfig = {
  name: "Default",
  shortName: "Default",
  description: "Default model",
};

export interface ChatUIRootProps {
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

  /** Models for header selector */
  models?: ModelConfig[];
  legacyModels?: ModelConfig[];

  /** Messages for ChatMessages */
  messages?: ChatMessage[];

  /** Sidebar data */
  projects?: SidebarItem[];
  chatHistory?: string[];
  groupChats?: SidebarItem[];
  categories?: string[];
  categoryIcons?: Record<string, React.ReactNode>;
  categoryColors?: Record<string, string>;
  categoryIconColors?: Record<string, string>;
  user?: ChatSidebarUser;

  /** Compose view config */
  composeModels?: ModelConfig[];
  composeModes?: ModeConfig[];

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
  models,
  legacyModels,
  messages,
  projects,
  chatHistory,
  groupChats,
  categories,
  categoryIcons,
  categoryColors,
  categoryIconColors,
  user,
  composeModels,
  composeModes,
  mobileBreakpointPx = 768,
  onSidebarToggle,
  headerRight,
  slots,
  composerLeft,
  composerRight,
  emptyState,
}: ChatUIRootProps) {
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpointPx}px)`);
  const slotsValue = useMemo(() => slots ?? {}, [slots]);
  const resolvedModels = useMemo(
    () => (models && models.length > 0 ? models : [defaultModel ?? FALLBACK_MODEL]),
    [models, defaultModel],
  );
  const resolvedLegacyModels = useMemo(() => legacyModels ?? [], [legacyModels]);
  const resolvedComposeModels = useMemo(
    () => composeModels ?? resolvedModels,
    [composeModels, resolvedModels],
  );

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

  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const wasOverlayOpenRef = useRef(false);
  const overlayDrawerRef = useRef<HTMLDivElement | null>(null);

  const [selectedModel, setSelectedModel] = useState<ModelConfig>(
    defaultModel ?? resolvedModels[0] ?? FALLBACK_MODEL,
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
      : "overlay";

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

  const mainContent = useMemo(() => {
    if (mode === "dashboard") {
      return (
        <div className="flex-1 flex flex-col">
          <div className="p-4 text-white/80">Dashboard template placeholder</div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
        <ChatHeader
          isSidebarOpen={sidebarOpenForHeader}
          onSidebarToggle={toggleSidebar}
          selectedModel={selectedModel}
          onModelChange={(model) => {
            if (typeof model === "string") {
              // Handle string model selection - convert to ModelConfig
              setSelectedModel({ name: model, shortName: model, description: "" });
            } else {
              setSelectedModel(model);
            }
          }}
          models={resolvedModels}
          legacyModels={resolvedLegacyModels}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          headerRight={headerRight}
        />

        {viewMode === "compose" ? (
          <ComposeView models={resolvedComposeModels} modes={composeModes} />
        ) : (
          <>
            <ChatMessages emptyState={emptyState} messages={messages} />
            <ChatInput
              selectedModel={selectedModel}
              composerLeft={composerLeft}
              composerRight={composerRight}
            />
          </>
        )}
      </div>
    );
  }, [
    mode,
    sidebarOpenForHeader,
    toggleSidebar,
    selectedModel,
    setSelectedModel,
    resolvedModels,
    resolvedLegacyModels,
    viewMode,
    setViewMode,
    headerRight,
    resolvedComposeModels,
    composeModes,
    composerLeft,
    composerRight,
    emptyState,
    messages,
  ]);

  return (
    <div
      className="size-full flex bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-hidden"
      data-testid="chat-ui-root"
    >
      {sidebarBehavior === "inline" ? (
        <ChatUISlotsProvider value={slotsValue}>
          <ChatSidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            projects={projects}
            chatHistory={chatHistory}
            groupChats={groupChats}
            categories={categories}
            categoryIcons={categoryIcons}
            categoryColors={categoryColors}
            categoryIconColors={categoryIconColors}
            user={user}
          />
        </ChatUISlotsProvider>
      ) : null}

      {sidebarBehavior === "overlay" && sidebarOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
              <ChatSidebar
                isOpen={sidebarOpen}
                onToggle={closeOverlay}
                projects={projects}
                chatHistory={chatHistory}
                groupChats={groupChats}
                categories={categories}
                categoryIcons={categoryIcons}
                categoryColors={categoryColors}
                categoryIconColors={categoryIconColors}
                user={user}
              />
            </ChatUISlotsProvider>
          </div>
        </div>
      ) : null}

      <div className="flex-1 flex min-w-0">{mainContent}</div>
    </div>
  );
}
