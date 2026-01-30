import { HostProvider, createEmbeddedHost, ensureMockOpenAI } from "@design-studio/runtime";
import { AppsSDKUIProvider, ChatUIRoot } from "@design-studio/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../styles.css";

// Mock for standalone development
if (import.meta.env.DEV) {
  ensureMockOpenAI({
    toolOutput: {
      messages: [
        { role: "user", content: "Hello!" },
        { role: "assistant", content: "Hi there! How can I help you today?" },
      ],
    },
  });
}

/**
 * Render the full chat view widget with host context.
 */
function ChatViewWidget() {
  const host = createEmbeddedHost();

  return (
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        {/* Same ChatUIRoot component as your main app */}
        <ChatUIRoot />
      </AppsSDKUIProvider>
    </HostProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChatViewWidget />
  </StrictMode>,
);
