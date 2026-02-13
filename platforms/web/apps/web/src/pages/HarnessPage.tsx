import { AppsSDKButton, ModalBody, ModalDialog, ModalFooter, ModalHeader } from "@design-studio/ui";
import { DiscoverySettingsModal, IconPickerModal, SettingsModal } from "@design-studio/ui/modals";
import { useState } from "react";

interface Widget {
  id: string;
  name: string;
  description: string;
}

const WIDGET_BASE_URL = (import.meta.env.VITE_WIDGETS_BASE ?? "http://localhost:5173").replace(
  /\/$/,
  "",
);

const WIDGETS: Widget[] = [
  {
    id: "dashboard-widget",
    name: "Dashboard Widget",
    description: "Dashboard overview widget with stats and recent chats",
  },
  {
    id: "chat-view",
    name: "Chat View",
    description: "Main chat interface - same as standalone app",
  },
  {
    id: "search-results",
    name: "Search Results",
    description: "Display search results with tags and links",
  },
  {
    id: "compose-view",
    name: "Compose View",
    description: "Compose view parity widget",
  },
  {
    id: "chat-header",
    name: "Chat Header",
    description: "Chat header block widget",
  },
  {
    id: "chat-sidebar",
    name: "Chat Sidebar",
    description: "Chat sidebar block widget",
  },
  {
    id: "chat-messages",
    name: "Chat Messages",
    description: "Chat messages block widget",
  },
  {
    id: "chat-input",
    name: "Chat Input",
    description: "Chat input block widget",
  },
  {
    id: "chat-template",
    name: "Chat Template",
    description: "Template shell for chat (messages + composer)",
  },
  {
    id: "kitchen-sink-lite",
    name: "Kitchen Sink Lite",
    description: "Comprehensive Apps SDK API demo widget",
  },
  {
    id: "pizzaz-table",
    name: "Pizzaz Table",
    description: "Structured data table widget",
  },
];

const getWidgetUrl = (widgetId: string) => `${WIDGET_BASE_URL}/${widgetId}`;

export function HarnessPage() {
  const [selectedWidget, setSelectedWidget] = useState<Widget>(WIDGETS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [iconSelection, setIconSelection] = useState({
    iconId: "folder",
    colorId: "gray",
  });
  const [promptEnhancement, setPromptEnhancement] = useState<"rewrite" | "augment" | "preserve">(
    "rewrite",
  );
  const [targetSize, setTargetSize] = useState(60);

  return (
    <div className="flex h-screen">
      {/* Widget List */}
      <div className="w-80 border-r border-foundation-bg-light-3 bg-foundation-bg-light-2 p-4">
        <h2 className="text-lg font-semibold mb-4 text-foundation-text-light-primary">
          Widget Gallery
        </h2>
        <div className="space-y-2">
          {WIDGETS.map((widget) => (
            <button
              type="button"
              key={widget.id}
              onClick={() => setSelectedWidget(widget)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedWidget.id === widget.id
                  ? "bg-foundation-bg-light-1 border-foundation-accent-blue/40"
                  : "bg-foundation-bg-light-1 border-foundation-bg-light-3 hover:bg-foundation-bg-light-2"
              }`}
            >
              <div className="font-medium text-foundation-text-light-primary">{widget.name}</div>
              <div className="text-sm text-foundation-text-light-secondary mt-1">
                {widget.description}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-foundation-bg-light-3">
          <h3 className="font-medium mb-2 text-foundation-text-light-primary">
            Keyboard Shortcuts
          </h3>
          <div className="text-sm text-foundation-text-light-secondary space-y-1">
            <div>
              <kbd className="px-1 py-0.5 bg-foundation-bg-light-3 rounded text-xs">?</kbd> Help
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-foundation-bg-light-3 rounded text-xs">G</kbd> Next
              widget
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-foundation-bg-light-3 rounded text-xs">Esc</kbd> Close
              modal
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-foundation-bg-light-3">
          <h3 className="font-medium mb-2 text-foundation-text-light-primary">
            Modal Test Controls
          </h3>
          <div className="space-y-2">
            <AppsSDKButton
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsModalOpen(true)}
            >
              Open Modal
            </AppsSDKButton>
            <AppsSDKButton
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsSettingsOpen(true)}
            >
              Open Settings
            </AppsSDKButton>
            <AppsSDKButton
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsIconPickerOpen(true)}
            >
              Choose Icon
            </AppsSDKButton>
            <AppsSDKButton
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsDiscoveryOpen(true)}
            >
              Discovery Settings
            </AppsSDKButton>
          </div>
        </div>
      </div>

      {/* Widget Preview */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-foundation-bg-light-3 p-4 bg-foundation-bg-light-1">
          <h1 className="text-xl font-semibold text-foundation-text-light-primary">
            {selectedWidget.name}
          </h1>
          <p className="text-foundation-text-light-secondary mt-1">{selectedWidget.description}</p>
          <div className="mt-2 flex gap-2">
            <AppsSDKButton
              size="sm"
              variant="outline"
              onClick={() =>
                window.open(getWidgetUrl(selectedWidget.id), "_blank", "noopener,noreferrer")
              }
            >
              Open in New Tab
            </AppsSDKButton>
          </div>
        </div>

        <div className="flex-1 p-4">
          <iframe
            key={selectedWidget.id}
            src={getWidgetUrl(selectedWidget.id)}
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
          <p className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-secondary">
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
            <AppsSDKButton size="sm" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AppsSDKButton>
            <AppsSDKButton size="sm" onClick={() => setIsModalOpen(false)}>
              Confirm
            </AppsSDKButton>
          </div>
        </ModalBody>
        <ModalFooter>
          <AppsSDKButton variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
            Close
          </AppsSDKButton>
        </ModalFooter>
      </ModalDialog>

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          account={{ email: "dev@astudio.test", phone: "(555) 123-4567", subscriptionLabel: "Pro" }}
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
