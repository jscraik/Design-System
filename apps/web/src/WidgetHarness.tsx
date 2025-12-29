import { Button } from "@chatui/ui";
import { useState } from "react";

interface Widget {
  id: string;
  name: string;
  description: string;
  path: string;
}

const WIDGETS: Widget[] = [
  {
    id: "dashboard-widget",
    name: "Dashboard Widget",
    description: "Dashboard overview widget with stats and recent chats",
    path: "/widgets/dashboard-widget/index.html",
  },
  {
    id: "chat-view",
    name: "Chat View",
    description: "Main chat interface - same as standalone app",
    path: "/widgets/chat-view/index.html",
  },
  {
    id: "search-results",
    name: "Search Results",
    description: "Display search results with tags and links",
    path: "/widgets/search-results/index.html",
  },
  {
    id: "kitchen-sink-lite",
    name: "Kitchen Sink Lite",
    description: "Comprehensive Apps SDK API demo widget",
    path: "/widgets/kitchen-sink-lite/index.html",
  },
  {
    id: "pizzaz-table",
    name: "Pizzaz Table",
    description: "Structured data table widget",
    path: "/widgets/pizzaz-table/index.html",
  },
];

export function WidgetHarness() {
  const [selectedWidget, setSelectedWidget] = useState<Widget>(WIDGETS[0]);

  return (
    <div className="flex h-screen">
      {/* Widget List */}
      <div className="w-80 border-r bg-gray-50 p-4">
        <h2 className="text-lg font-semibold mb-4">Widget Gallery</h2>
        <div className="space-y-2">
          {WIDGETS.map((widget) => (
            <button
              type="button"
              key={widget.id}
              onClick={() => setSelectedWidget(widget)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedWidget.id === widget.id
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{widget.name}</div>
              <div className="text-sm text-gray-600 mt-1">{widget.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">?</kbd> Help
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">G</kbd> Next widget
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> Close modal
            </div>
          </div>
        </div>
      </div>

      {/* Widget Preview */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 bg-white">
          <h1 className="text-xl font-semibold">{selectedWidget.name}</h1>
          <p className="text-gray-600 mt-1">{selectedWidget.description}</p>
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                window.open(selectedWidget.path, "_blank", "noopener,noreferrer")
              }
            >
              Open in New Tab
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <iframe
            key={selectedWidget.id}
            src={selectedWidget.path}
            className="w-full h-full border rounded-lg"
            title={selectedWidget.name}
          />
        </div>
      </div>
    </div>
  );
}
