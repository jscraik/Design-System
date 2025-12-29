import { useState } from "react";

import { ChatHeader } from "./components/chat/ChatHeader";
import { ChatInput } from "./components/chat/ChatInput";
import { ChatMessages } from "./components/chat/ChatMessages";
import { ChatSidebar } from "./components/chat/ChatSidebar";
import { ComposeView } from "./components/chat/ComposeView";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { SpacingPage } from "./pages/SpacingPage";
import { TypographyPage } from "./pages/TypographyPage";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "chat" | "typography" | "spacing" | "design-system"
  >("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState({
    name: "ChatGPT 5.2 Pro",
    shortName: "5.2 Pro",
    description: "Our most capable model",
  });
  const [viewMode, setViewMode] = useState<"chat" | "compose">("chat");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Simple view switcher for demo purposes
  if (currentView === "design-system") {
    return (
      <div className="relative">
        <DesignSystemPage />
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button type="button"
            onClick={() => setCurrentView("typography")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            Typography
          </button>
          <button type="button"
            onClick={() => setCurrentView("spacing")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            Spacing
          </button>
          <button type="button"
            onClick={() => setCurrentView("chat")}
            className="rounded-lg bg-foundation-bg-dark-1 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-foundation-bg-dark-2"
          >
            ← Back to Chat
          </button>
        </div>
      </div>
    );
  }

  if (currentView === "typography") {
    return (
      <div className="relative">
        <TypographyPage />
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button type="button"
            onClick={() => setCurrentView("design-system")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            ← Overview
          </button>
          <button type="button"
            onClick={() => setCurrentView("spacing")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            View Spacing →
          </button>
          <button type="button"
            onClick={() => setCurrentView("chat")}
            className="rounded-lg bg-foundation-bg-dark-1 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-foundation-bg-dark-2"
          >
            ← Back to Chat
          </button>
        </div>
      </div>
    );
  }

  if (currentView === "spacing") {
    return (
      <div className="relative">
        <SpacingPage />
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button type="button"
            onClick={() => setCurrentView("design-system")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            ← Overview
          </button>
          <button type="button"
            onClick={() => setCurrentView("chat")}
            className="rounded-lg bg-foundation-bg-dark-1 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-foundation-bg-dark-2"
          >
            ← Back to Chat
          </button>
          <button type="button"
            onClick={() => setCurrentView("typography")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100"
          >
            ← View Typography
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex bg-foundation-bg-dark-1 dark">
      {/* Sidebar */}
      <ChatSidebar isOpen={isSidebarOpen} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-foundation-bg-dark-1">
        {/* Header */}
        <ChatHeader
          isSidebarOpen={isSidebarOpen}
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
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Conditional View */}
        {viewMode === "compose" ? (
          <ComposeView />
        ) : (
          <>
            {/* Messages Area */}
            <ChatMessages />

            {/* Input Area */}
            <ChatInput selectedModel={selectedModel} />
          </>
        )}
      </div>
    </div>
  );
}
