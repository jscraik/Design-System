import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import type { ModelConfig } from "../../../components/ui/navigation/ModelSelector";
import { useControllableState } from "../../../hooks/useControllableState";
import { ChatUISlotsProvider, type ChatUISlots } from "../shared/slots";
import { ChatShell, type ChatShellSlots } from "../ChatShell";
import { ChatHeader } from "../ChatHeader";
import { ChatInput, type ChatInputAttachmentAction, type ChatInputToolAction } from "../ChatInput";
import { ChatMessages, type ChatMessage, type ChatMessageAction } from "../ChatMessages";
import { ChatSidebar } from "../ChatSidebar";
import type { ChatSidebarUser, SidebarItem } from "../shared/types";
import { ComposeView, type ComposeModeConfig } from "../ComposeView";

const FALLBACK_MODEL: ModelConfig = {
  name: "Default",
  shortName: "Default",
  description: "Default model",
};

type BaseVariantProps = {
  className?: string;
  contentClassName?: string;
  slots?: Partial<ChatShellSlots>;
  uiSlots?: ChatUISlots;

  models?: ModelConfig[];
  legacyModels?: ModelConfig[];
  defaultModel?: ModelConfig;
  selectedModel?: string | ModelConfig;
  onModelChange?: (model: string | ModelConfig) => void;

  viewMode?: "chat" | "compose";
  defaultViewMode?: "chat" | "compose";
  onViewModeChange?: (mode: "chat" | "compose") => void;

  messages?: ChatMessage[];
  emptyState?: ReactNode;
  onMessageAction?: (action: ChatMessageAction, message: ChatMessage) => void;

  headerRight?: ReactNode;
  composerLeft?: ReactNode;
  composerRight?: ReactNode;

  onSendMessage?: (message: string) => void | Promise<void>;
  onAttachmentAction?: (action: ChatInputAttachmentAction) => void;
  onToolAction?: (action: ChatInputToolAction) => void;
  onSearchToggle?: (enabled: boolean) => void;
  onResearchToggle?: (enabled: boolean) => void;

  composeModels?: ModelConfig[];
  composeModes?: ComposeModeConfig[];

  projects?: SidebarItem[];
  chatHistory?: string[];
  groupChats?: SidebarItem[];
  categories?: string[];
  categoryIcons?: Record<string, React.ReactNode>;
  categoryColors?: Record<string, string>;
  categoryIconColors?: Record<string, string>;
  user?: ChatSidebarUser;
};

function useResolvedModels({
  models,
  defaultModel,
  selectedModel: selectedModelProp,
  onModelChange,
}: {
  models?: ModelConfig[];
  defaultModel?: ModelConfig;
  selectedModel?: string | ModelConfig;
  onModelChange?: (model: string | ModelConfig) => void;
}) {
  const resolvedModels = useMemo(
    () => (models && models.length > 0 ? models : [defaultModel ?? FALLBACK_MODEL]),
    [models, defaultModel],
  );

  const [internalModel, setInternalModel] = useState<ModelConfig>(
    defaultModel ?? resolvedModels[0] ?? FALLBACK_MODEL,
  );

  useEffect(() => {
    if (selectedModelProp !== undefined) return;
    const exists = resolvedModels.some((m) => m.shortName === internalModel.shortName);
    if (!exists && resolvedModels.length > 0) {
      setInternalModel(defaultModel ?? resolvedModels[0] ?? FALLBACK_MODEL);
    }
  }, [defaultModel, internalModel.shortName, resolvedModels, selectedModelProp]);

  const selectedModel = selectedModelProp ?? internalModel;
  const resolvedSelectedModel =
    typeof selectedModel === "string"
      ? (resolvedModels.find((m) => m.name === selectedModel || m.shortName === selectedModel) ??
        FALLBACK_MODEL)
      : selectedModel;

  const handleModelChange = (model: string | ModelConfig) => {
    onModelChange?.(model);
    if (selectedModelProp !== undefined) return;

    if (typeof model === "string") {
      const found = resolvedModels.find((m) => m.name === model || m.shortName === model);
      setInternalModel(found ?? { name: model, shortName: model, description: "" });
      return;
    }

    setInternalModel(model);
  };

  return {
    resolvedModels,
    selectedModel: resolvedSelectedModel,
    handleModelChange,
  };
}

function useViewModeState({
  viewMode,
  defaultViewMode,
  onViewModeChange,
}: {
  viewMode?: "chat" | "compose";
  defaultViewMode?: "chat" | "compose";
  onViewModeChange?: (mode: "chat" | "compose") => void;
}) {
  return useControllableState<"chat" | "compose">({
    value: viewMode,
    defaultValue: defaultViewMode ?? "chat",
    onChange: onViewModeChange,
  });
}

/**
 * Props for the split-sidebar chat variant.
 */
export type ChatVariantSplitSidebarProps = BaseVariantProps & {
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  showSidebarToggle?: boolean;
};

/**
 * Renders the split-sidebar chat variant.
 *
 * @param props - Variant props.
 * @returns A chat layout with inline sidebar.
 */
export function ChatVariantSplitSidebar({
  className,
  contentClassName,
  slots,
  uiSlots,
  models,
  legacyModels,
  defaultModel,
  selectedModel: selectedModelProp,
  onModelChange,
  viewMode,
  defaultViewMode,
  onViewModeChange,
  messages,
  emptyState,
  onMessageAction,
  headerRight,
  composerLeft,
  composerRight,
  onSendMessage,
  onAttachmentAction,
  onToolAction,
  onSearchToggle,
  onResearchToggle,
  composeModels,
  composeModes,
  projects,
  chatHistory,
  groupChats,
  categories,
  categoryIcons,
  categoryColors,
  categoryIconColors,
  user,
  sidebarOpen: sidebarOpenProp,
  defaultSidebarOpen = true,
  onSidebarOpenChange,
  showSidebarToggle = true,
}: ChatVariantSplitSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useControllableState({
    value: sidebarOpenProp,
    defaultValue: defaultSidebarOpen,
    onChange: onSidebarOpenChange,
  });

  const [viewModeState, setViewModeState] = useViewModeState({
    viewMode,
    defaultViewMode,
    onViewModeChange,
  });

  const { resolvedModels, selectedModel, handleModelChange } = useResolvedModels({
    models,
    defaultModel,
    selectedModel: selectedModelProp,
    onModelChange,
  });

  const resolvedComposeModels = useMemo(
    () => (composeModels && composeModels.length > 0 ? composeModels : resolvedModels),
    [composeModels, resolvedModels],
  );

  const baseSlots: ChatShellSlots = {
    sidebar: sidebarOpen ? (
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        projects={projects}
        chatHistory={chatHistory}
        groupChats={groupChats}
        categories={categories}
        categoryIcons={categoryIcons}
        categoryColors={categoryColors}
        categoryIconColors={categoryIconColors}
        user={user}
      />
    ) : null,
    header: (
      <ChatHeader
        isSidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
        showSidebarToggle={showSidebarToggle}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        models={resolvedModels}
        legacyModels={legacyModels}
        viewMode={viewModeState}
        onViewModeChange={setViewModeState}
        headerRight={headerRight}
      />
    ),
    messages:
      viewModeState === "compose" ? (
        <ComposeView models={resolvedComposeModels} modes={composeModes} />
      ) : (
        <ChatMessages
          emptyState={emptyState}
          messages={messages}
          onMessageAction={onMessageAction}
        />
      ),
    composer:
      viewModeState === "compose" ? null : (
        <ChatInput
          selectedModel={selectedModel}
          composerLeft={composerLeft}
          composerRight={composerRight}
          onSendMessage={onSendMessage}
          onAttachmentAction={onAttachmentAction}
          onToolAction={onToolAction}
          onSearchToggle={onSearchToggle}
          onResearchToggle={onResearchToggle}
        />
      ),
  };

  const resolvedSlots = { ...baseSlots, ...slots };

  return (
    <ChatUISlotsProvider value={uiSlots ?? {}}>
      <ChatShell slots={resolvedSlots} className={className} contentClassName={contentClassName} />
    </ChatUISlotsProvider>
  );
}

/**
 * Props for the compact chat variant.
 */
export type ChatVariantCompactProps = BaseVariantProps;

/**
 * Renders the compact chat variant without a persistent sidebar.
 *
 * @param props - Variant props.
 * @returns A compact chat layout.
 */
export function ChatVariantCompact({
  className,
  contentClassName,
  slots,
  uiSlots,
  models,
  legacyModels,
  defaultModel,
  selectedModel: selectedModelProp,
  onModelChange,
  viewMode,
  defaultViewMode,
  onViewModeChange,
  messages,
  emptyState,
  onMessageAction,
  headerRight,
  composerLeft,
  composerRight,
  onSendMessage,
  onAttachmentAction,
  onToolAction,
  onSearchToggle,
  onResearchToggle,
  composeModels,
  composeModes,
}: ChatVariantCompactProps) {
  const [viewModeState, setViewModeState] = useViewModeState({
    viewMode,
    defaultViewMode,
    onViewModeChange,
  });

  const { resolvedModels, selectedModel, handleModelChange } = useResolvedModels({
    models,
    defaultModel,
    selectedModel: selectedModelProp,
    onModelChange,
  });

  const resolvedComposeModels = useMemo(
    () => (composeModels && composeModels.length > 0 ? composeModels : resolvedModels),
    [composeModels, resolvedModels],
  );

  const baseSlots: ChatShellSlots = {
    header: (
      <ChatHeader
        isSidebarOpen={false}
        onSidebarToggle={() => {}}
        showSidebarToggle={false}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        models={resolvedModels}
        legacyModels={legacyModels}
        viewMode={viewModeState}
        onViewModeChange={setViewModeState}
        headerRight={headerRight}
      />
    ),
    messages:
      viewModeState === "compose" ? (
        <ComposeView models={resolvedComposeModels} modes={composeModes} />
      ) : (
        <ChatMessages
          emptyState={emptyState}
          messages={messages}
          onMessageAction={onMessageAction}
        />
      ),
    composer:
      viewModeState === "compose" ? null : (
        <ChatInput
          selectedModel={selectedModel}
          composerLeft={composerLeft}
          composerRight={composerRight}
          onSendMessage={onSendMessage}
          onAttachmentAction={onAttachmentAction}
          onToolAction={onToolAction}
          onSearchToggle={onSearchToggle}
          onResearchToggle={onResearchToggle}
        />
      ),
  };

  const resolvedSlots = { ...baseSlots, ...slots };

  return (
    <ChatUISlotsProvider value={uiSlots ?? {}}>
      <ChatShell slots={resolvedSlots} className={className} contentClassName={contentClassName} />
    </ChatUISlotsProvider>
  );
}

/**
 * Props for the context-rail chat variant.
 */
export type ChatVariantContextRailProps = ChatVariantSplitSidebarProps & {
  contextPanel?: ReactNode;
};

/**
 * Renders the context-rail chat variant with a right-side panel.
 *
 * @param props - Variant props.
 * @returns A chat layout with context rail.
 */
export function ChatVariantContextRail({
  contextPanel,
  slots,
  contentClassName,
  ...props
}: ChatVariantContextRailProps) {
  const resolvedSlots: Partial<ChatShellSlots> = {
    contextPanel: contextPanel ? (
      <div className="hidden lg:block w-[320px] border-l border-muted bg-background">
        {contextPanel}
      </div>
    ) : null,
    ...slots,
  };

  return (
    <ChatVariantSplitSidebar {...props} contentClassName={contentClassName} slots={resolvedSlots} />
  );
}
