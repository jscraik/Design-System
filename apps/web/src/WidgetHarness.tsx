import { Button, ModalBody, ModalDialog, ModalFooter, ModalHeader } from "@chatui/ui";
import { DiscoverySettingsModal, IconPickerModal, SettingsModal } from "@chatui/ui/modals";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [iconSelection, setIconSelection] = useState({
    iconId: "folder",
    colorId: "gray",
  });
  const [promptEnhancement, setPromptEnhancement] = useState<
    "rewrite" | "augment" | "preserve"
  >("rewrite");
  const [targetSize, setTargetSize] = useState(60);

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

        <div className="mt-6 pt-4 border-t">
          <h3 className="font-medium mb-2">Modal Test Controls</h3>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsModalOpen(true)}
            >
              Open Modal
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsSettingsOpen(true)}
            >
              Open Settings
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsIconPickerOpen(true)}
            >
              Choose Icon
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsDiscoveryOpen(true)}
            >
              Discovery Settings
            </Button>
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

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Test Modal"
        description="Modal dialog for keyboard navigation tests."
        maxWidth="480px"
      >
        <ModalHeader title="Test Modal" subtitle="Keyboard navigation baseline" />
        <ModalBody className="space-y-4">
          <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            This modal exists to validate focus trap, Escape, and overlay behavior.
          </p>
          <label
            htmlFor="modal-test-input"
            className="block text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
          >
            Sample input
            <input
              id="modal-test-input"
              aria-label="Sample input"
              className="mt-2 w-full rounded-md border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-transparent px-3 py-2 text-sm"
              placeholder="Type here"
            />
          </label>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalDialog>

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          account={{ email: "dev@chatui.test", phone: "(555) 123-4567", subscriptionLabel: "Pro" }}
          appInfo={{ versionLabel: "1.0.0" }}
        />
      )}

      {isIconPickerOpen && (
        <IconPickerModal
          isOpen={isIconPickerOpen}
          onClose={() => setIsIconPickerOpen(false)}
          currentIconId={iconSelection.iconId}
          currentColorId={iconSelection.colorId}
          onSave={(iconId, colorId) => setIconSelection({ iconId, colorId })}
          projectName="Test Project"
        />
      )}

      {isDiscoveryOpen && (
        <DiscoverySettingsModal
          isOpen={isDiscoveryOpen}
          onClose={() => setIsDiscoveryOpen(false)}
          promptEnhancement={promptEnhancement}
          onPromptEnhancementChange={setPromptEnhancement}
          targetSize={targetSize}
          onTargetSizeChange={setTargetSize}
        />
      )}
    </div>
  );
}
