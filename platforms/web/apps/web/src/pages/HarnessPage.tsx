import {
  AppsSDKButton,
  ModalBody,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ProductPageShell,
  ProductPanel,
  ProductSection,
} from "@design-studio/ui";
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

const KEYBOARD_SHORTCUTS = [
  { key: "?", description: "Help" },
  { key: "G", description: "Next widget" },
  { key: "Esc", description: "Close modal" },
];

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
    <ProductPageShell
      title="Widget Harness"
      description="Preview embedded widget surfaces, modal flows, and keyboard behavior from one stable verification route."
      sidebarClassName="lg:w-80"
      mainClassName="flex min-h-96"
      actions={
        <AppsSDKButton
          size="sm"
          variant="outline"
          onClick={() =>
            window.open(getWidgetUrl(selectedWidget.id), "_blank", "noopener,noreferrer")
          }
        >
          Open Selected Widget
        </AppsSDKButton>
      }
      sidebar={
        <ProductPanel
          title="Widget Gallery"
          description="Choose a widget shell to preview in the live iframe."
          density="spacious"
          tone="muted"
          className="h-full"
        >
          <div className="space-y-2">
            {WIDGETS.map((widget) => (
              <button
                type="button"
                key={widget.id}
                onClick={() => setSelectedWidget(widget)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                  selectedWidget.id === widget.id
                    ? "border-ring/40 bg-background shadow-sm"
                    : "border-border bg-background hover:bg-muted/40"
                }`}
              >
                <div className="font-medium">{widget.name}</div>
                <div className="mt-1 text-body-small text-muted-foreground">
                  {widget.description}
                </div>
              </button>
            ))}
          </div>

          <ProductSection title="Keyboard Shortcuts" density="compact" className="mt-6">
            <div className="space-y-1 text-body-small text-muted-foreground">
              {KEYBOARD_SHORTCUTS.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center gap-2">
                  <kbd className="rounded-md border border-border bg-background px-1.5 py-0.5 text-xs text-foreground">
                    {shortcut.key}
                  </kbd>
                  <span>{shortcut.description}</span>
                </div>
              ))}
            </div>
          </ProductSection>

          <ProductSection title="Modal Test Controls" density="compact" className="mt-6">
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
          </ProductSection>
        </ProductPanel>
      }
    >
      <ProductPanel
        title={selectedWidget.name}
        description={selectedWidget.description}
        className="flex flex-1 overflow-hidden"
        bodyClassName="flex flex-1"
        actions={
          <AppsSDKButton
            size="sm"
            variant="outline"
            onClick={() =>
              window.open(getWidgetUrl(selectedWidget.id), "_blank", "noopener,noreferrer")
            }
          >
            Open in New Tab
          </AppsSDKButton>
        }
      >
        <div className="flex min-h-96 flex-1 bg-muted/10 p-4">
          <div className="flex flex-1 overflow-hidden rounded-lg border border-border bg-background">
            <iframe
              key={selectedWidget.id}
              src={getWidgetUrl(selectedWidget.id)}
              className="h-full min-h-96 w-full"
              title={selectedWidget.name}
            />
          </div>
        </div>
      </ProductPanel>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Test Modal"
        description="Modal dialog for keyboard navigation tests."
        maxWidth="30rem"
      >
        <ModalHeader title="Test Modal" subtitle="Keyboard navigation baseline" />
        <ModalBody className="space-y-4">
          <p className="text-sm text-text-secondary">
            This modal exists to validate focus trap, Escape, and overlay behavior.
          </p>
          <label htmlFor="modal-test-input" className="block text-sm font-medium text-foreground">
            Sample input
            <input
              id="modal-test-input"
              aria-label="Sample input"
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
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
    </ProductPageShell>
  );
}
