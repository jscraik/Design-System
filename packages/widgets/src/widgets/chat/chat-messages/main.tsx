import { HostProvider, createEmbeddedHost, ensureMockOpenAI } from "@design-studio/runtime";
import { AppsSDKUIProvider } from "@design-studio/ui";
import { ChatMessagesTemplate } from "@design-studio/ui/templates";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { useMaxHeight, useTheme } from "../../../shared/openai-hooks";
import "../../../styles.css";

if (import.meta.env.DEV) {
  ensureMockOpenAI({
    toolOutput: {
      instructions: "",
    },
  });
}

/**
 * Render the chat messages template with host-aware styling.
 */
function ChatMessagesWidgetCore() {
  const theme = useTheme();
  const maxHeight = useMaxHeight();
  const containerClass = theme === "dark" ? "dark" : "";

  return (
    <div className={containerClass} style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}>
      <ChatMessagesTemplate />
    </div>
  );
}

/**
 * Provide host context and theming for the chat messages widget.
 */
function ChatMessagesWidget() {
  const host = createEmbeddedHost();

  return (
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <ChatMessagesWidgetCore />
      </AppsSDKUIProvider>
    </HostProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChatMessagesWidget />
  </StrictMode>,
);
