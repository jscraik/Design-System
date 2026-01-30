import { HostProvider, createEmbeddedHost, ensureMockOpenAI } from "@design-studio/runtime";
import { AppsSDKUIProvider } from "@design-studio/ui";
import { ComposeTemplate } from "@design-studio/ui/templates";
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
 * Render the compose template with host-aware styling.
 */
function ComposeWidgetCore() {
  const theme = useTheme();
  const maxHeight = useMaxHeight();
  const containerClass = theme === "dark" ? "dark" : "";

  return (
    <div className={containerClass} style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}>
      <ComposeTemplate />
    </div>
  );
}

/**
 * Provide host context and theming for the compose widget.
 */
function ComposeWidget() {
  const host = createEmbeddedHost();

  return (
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <ComposeWidgetCore />
      </AppsSDKUIProvider>
    </HostProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ComposeWidget />
  </StrictMode>,
);
