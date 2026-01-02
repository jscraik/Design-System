import { createEmbeddedHost, ensureMockOpenAI, HostProvider, useToolOutput } from "@chatui/runtime";
import { AppsSDKUIProvider, Button, Card } from "@chatui/ui";
import { useState } from "react";

import type { ExampleToolOutput } from "../../../src/shared/tool-output-types";
import { createWidget, mountWidget, WidgetErrorBoundary } from "../../../src/shared/widget-base";
import "../../../src/styles.css";

const isDev = Boolean(import.meta.env?.DEV);

// Mock data for development
if (import.meta.env.DEV) {
  ensureMockOpenAI({
    toolOutput: {
      message: "Hello from the example widget!",
      count: 42,
      items: ["Item 1", "Item 2", "Item 3"],
    },
  });
}

// Core widget component using new patterns
function ExampleWidgetCore() {
  const toolOutput = useToolOutput() as ExampleToolOutput | null;
  const [localCount, setLocalCount] = useState(0);

  const message = toolOutput?.message ?? "No message received";
  const serverCount = toolOutput?.count ?? 0;
  const items = toolOutput?.items ?? [];

  const handleCallTool = async () => {
    try {
      // Example of calling a tool from within the widget
      const result = await window.openai?.callTool("example_action", {
        action: "increment",
        currentValue: localCount,
      });

      if (result?.structuredContent?.newValue) {
        setLocalCount(result.structuredContent.newValue);
      }
    } catch (error) {
      if (isDev) {
        console.error("Tool call failed:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold text-white mb-2">Server Data</h2>
        <p className="text-gray-300 mb-2">{message}</p>
        <p className="text-sm text-gray-400">Server count: {serverCount}</p>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold text-white mb-2">Interactive Elements</h2>
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={() => setLocalCount((c) => c + 1)} variant="primary">
            Local Count: {localCount}
          </Button>
          <Button onClick={handleCallTool} variant="secondary">
            Call Tool
          </Button>
        </div>
      </Card>

      {items.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Items</h2>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item} className="text-gray-300 text-sm">
                • {item}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

// Create the widget using the new createWidget HOC
const ExampleWidget = createWidget(
  () => {
    const host = createEmbeddedHost();

    return (
      <WidgetErrorBoundary>
        <HostProvider host={host}>
          <AppsSDKUIProvider linkComponent="a">
            <ExampleWidgetCore />
          </AppsSDKUIProvider>
        </HostProvider>
      </WidgetErrorBoundary>
    );
  },
  {
    title: "Example Widget",
    className: "max-w-md mx-auto",
  },
);

// Mount into the DOM when used as a standalone widget entry
if (typeof document !== "undefined") {
  mountWidget(<ExampleWidget />);
}

// Export for potential reuse
export { ExampleWidget, ExampleWidgetCore };
