import { createEmbeddedHost, ensureMockOpenAI, HostProvider } from "@design-studio/runtime";
import { AppsSDKButton, AppsSDKUIProvider } from "@design-studio/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { CodeBlock } from "../../../src/shared/code-block";
import "../../../src/styles.css";

// Mock for standalone development
// Mock for standalone development
if (import.meta.env.DEV) {
  ensureMockOpenAI({
    toolOutput: {
      message: "Kitchen Sink Lite - API coverage widget",
      data: { items: ["Tool calls", "State management", "Resize handling"] },
    },
  });
}

function KitchenSinkWidget() {
  const host = createEmbeddedHost();

  return (
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <div className="p-4 space-y-4">
          <h1 className="text-lg font-semibold">Kitchen Sink Lite</h1>
          <p className="text-sm text-gray-600">Comprehensive Apps SDK API demo widget</p>

          <div className="space-y-2">
            <AppsSDKButton
              onClick={() => host.callTool?.("demo_tool", { action: "test" })}
              variant="solid"
              color="primary"
            >
              Call Tool
            </AppsSDKButton>

            <CodeBlock language="json">{JSON.stringify(host.toolOutput, null, 2)}</CodeBlock>
          </div>
        </div>
      </AppsSDKUIProvider>
    </HostProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KitchenSinkWidget />
  </StrictMode>,
);
