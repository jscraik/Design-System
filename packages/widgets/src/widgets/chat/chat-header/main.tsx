import { HostProvider, createEmbeddedHost, ensureMockOpenAI } from "@astudio/runtime";
import { AppsSDKUIProvider } from "@astudio/ui";
import { ChatHeaderTemplate } from "@astudio/ui/templates";
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
 * Render the chat header template with host-aware styling.
 */
function ChatHeaderWidgetCore() {
  const theme = useTheme();
  const maxHeight = useMaxHeight();
  const containerClass = theme === "dark" ? "dark" : "";

  return (
    <div className={containerClass} style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}>
      <ChatHeaderTemplate />
    </div>
  );
}

/**
 * Provide host context and theming for the chat header widget.
 */
function ChatHeaderWidget() {
  const host = createEmbeddedHost();

  return (
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <ChatHeaderWidgetCore />
      </AppsSDKUIProvider>
    </HostProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChatHeaderWidget />
  </StrictMode>,
);
