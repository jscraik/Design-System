import { HostProvider, createEmbeddedHost, ensureMockOpenAI } from "@chatui/runtime";
import { AppsSDKUIProvider } from "@chatui/ui";
import { ChatInputTemplate } from "@chatui/ui/templates";
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
 * Render the chat input template with host-aware styling.
 */
function ChatInputWidgetCore() {
  const theme = useTheme();
  const maxHeight = useMaxHeight();
  const containerClass = theme === "dark" ? "dark" : "";

  return (
    <div className={containerClass} style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}>
      <ChatInputTemplate />
    </div>
  );
}

/**
 * Provide host context and theming for the chat input widget.
 */
function ChatInputWidget() {
  const host = createEmbeddedHost();

  return (
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <ChatInputWidgetCore />
      </AppsSDKUIProvider>
    </HostProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChatInputWidget />
  </StrictMode>,
);
