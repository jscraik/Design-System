import { useState } from "react";
import {
  Settings,
  Bell,
  Loader2,
  ChevronDown,
  Info,
  Save,
  X,
  Sparkles,
  AlertCircle,
  Inbox,
  GripVertical,
  Search,
  Filter,
  Plus,
  CheckCircle2,
} from "lucide-react";

import {
  TemplatePanel,
  TemplatePanelHeader,
  TemplatePanelFooter,
  useTemplatePanel,
} from "../TemplatePanel";

// Demo component that uses the panel context
function PanelStatusIndicator() {
  const { isCollapsed, isLoading, hasError, isEmpty } = useTemplatePanel();

  return (
    <div className="inline-flex items-center gap-2 text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
      {isLoading && <Loader2 className="size-3 animate-spin" />}
      {hasError && <AlertCircle className="size-3 text-foundation-accent-red" />}
      {isEmpty && <Inbox className="size-3" />}
      {isCollapsed && <span>Collapsed</span>}
    </div>
  );
}

export function TemplatePanelDemo() {
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [emptyState, setEmptyState] = useState(false);
  const [showPanel1, setShowPanel1] = useState(true);
  const [showPanel2, setShowPanel2] = useState(true);
  const [scrollPosition, setScrollPosition] = useState<number | undefined>(undefined);
  const [itemCount, setItemCount] = useState(5);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const simulateError = () => {
    setErrorState(true);
    setTimeout(() => setErrorState(false), 3000);
  };

  return (
    <div className="h-full overflow-auto bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-1 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
            Template Panel Demo
          </h1>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Production-ready panel component with 20+ features including variants, states,
            scrolling, resizing, keyboard shortcuts, and more.
          </p>
        </div>

        {/* Variants Showcase */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Panel Variants
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <TemplatePanel variant="default" size="md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  Default Variant
                </h3>
                <p className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  Standard panel with subtle shadow and border
                </p>
              </div>
            </TemplatePanel>

            <TemplatePanel variant="elevated" size="md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  Elevated Variant
                </h3>
                <p className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  Enhanced shadow for emphasis
                </p>
              </div>
            </TemplatePanel>

            <TemplatePanel variant="outlined" size="md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  Outlined Variant
                </h3>
                <p className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  Transparent with thicker border
                </p>
              </div>
            </TemplatePanel>

            <TemplatePanel variant="ghost" size="md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  Ghost Variant
                </h3>
                <p className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  No border or shadow
                </p>
              </div>
            </TemplatePanel>
          </div>
        </div>

        {/* Dismissable & Close Button */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Dismissable Panels
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {showPanel1 && (
              <TemplatePanel
                variant="default"
                size="md"
                dismissable
                onClose={() => setShowPanel1(false)}
                header={
                  <TemplatePanelHeader
                    title="Dismissable Panel"
                    subtitle="Click the X to close"
                    leading={<Bell className="size-4 text-foundation-accent-blue" />}
                    showCloseButton
                  />
                }
              >
                <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  This panel can be dismissed using the close button in the header.
                </p>
              </TemplatePanel>
            )}
            {!showPanel1 && (
              <button
                onClick={() => setShowPanel1(true)}
                className="h-32 border-2 border-dashed border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg flex items-center justify-center text-sm text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary hover:border-foundation-accent-blue hover:text-foundation-accent-blue transition-colors"
              >
                Click to restore panel
              </button>
            )}

            {showPanel2 && (
              <TemplatePanel
                variant="default"
                size="md"
                dismissable
                onClose={() => setShowPanel2(false)}
                header={
                  <TemplatePanelHeader
                    title="Notification"
                    subtitle="New message"
                    leading={<Bell className="size-4 text-foundation-accent-orange" />}
                    badge={3}
                    badgeVariant="error"
                    showCloseButton
                  />
                }
              >
                <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  Panel with badge indicator showing notification count.
                </p>
              </TemplatePanel>
            )}
            {!showPanel2 && (
              <button
                onClick={() => setShowPanel2(true)}
                className="h-32 border-2 border-dashed border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg flex items-center justify-center text-sm text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary hover:border-foundation-accent-blue hover:text-foundation-accent-blue transition-colors"
              >
                Click to restore panel
              </button>
            )}
          </div>
        </div>

        {/* Error & Empty States */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Error & Empty States
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <TemplatePanel
              variant="default"
              size="md"
              error={errorState ? "Failed to load data. Please try again." : false}
              onRetry={() => {
                setErrorState(false);
                simulateLoading();
              }}
              header={
                <TemplatePanelHeader
                  title="Error State Demo"
                  subtitle={errorState ? "Error occurred" : "Click button to trigger error"}
                  leading={<AlertCircle className="size-4 text-foundation-accent-red" />}
                />
              }
              footer={
                <TemplatePanelFooter
                  trailing={
                    <button
                      onClick={simulateError}
                      disabled={errorState}
                      className="px-3 py-1.5 text-xs rounded-md bg-foundation-accent-red text-white hover:bg-foundation-accent-red/90 transition-colors disabled:opacity-50"
                    >
                      Trigger Error
                    </button>
                  }
                />
              }
            >
              <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                Content will be replaced by error state
              </p>
            </TemplatePanel>

            <TemplatePanel
              variant="default"
              size="md"
              empty={emptyState}
              emptyTitle="No items found"
              emptyDescription="Try adjusting your filters or add new items"
              emptyIcon={<Inbox className="size-12 text-foundation-accent-blue" />}
              header={
                <TemplatePanelHeader
                  title="Empty State Demo"
                  subtitle={emptyState ? "No content" : "Has content"}
                  leading={<Inbox className="size-4 text-foundation-accent-blue" />}
                />
              }
              footer={
                <TemplatePanelFooter
                  trailing={
                    <button
                      onClick={() => setEmptyState(!emptyState)}
                      className="px-3 py-1.5 text-xs rounded-md bg-foundation-accent-blue text-white hover:bg-foundation-accent-blue/90 transition-colors"
                    >
                      {emptyState ? "Add Content" : "Clear Content"}
                    </button>
                  }
                />
              }
            >
              <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                This content is visible when not empty
              </p>
            </TemplatePanel>
          </div>
        </div>

        {/* Collapsible with Keyboard Shortcut */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Collapsible with Keyboard Shortcut
          </h2>
          <TemplatePanel
            variant="default"
            size="md"
            collapsible
            enableKeyboardShortcuts
            collapseShortcut="ctrl+k"
            header={
              <TemplatePanelHeader
                title="Settings Panel"
                subtitle="Press Ctrl+K to toggle collapse"
                leading={<Settings className="size-4 text-foundation-accent-blue" />}
                trailing={<PanelStatusIndicator />}
                showCollapseToggle
              />
            }
            footer={
              <TemplatePanelFooter
                leading={
                  <span className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                    💡 Keyboard shortcut enabled
                  </span>
                }
                trailing={
                  <button className="px-3 py-1.5 text-xs rounded-md bg-foundation-accent-blue text-white hover:bg-foundation-accent-blue/90 transition-colors">
                    Save
                  </button>
                }
              />
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  Email Notifications
                </label>
                <input type="checkbox" className="size-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  Push Notifications
                </label>
                <input type="checkbox" className="size-4" />
              </div>
            </div>
          </TemplatePanel>
        </div>

        {/* Loading State */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Loading State
          </h2>
          <TemplatePanel
            variant="default"
            size="md"
            loading={loading}
            header={
              <TemplatePanelHeader
                title="Data Panel"
                subtitle={loading ? "Loading content..." : "Click the button to load"}
                leading={<Sparkles className="size-4 text-foundation-accent-purple" />}
              />
            }
            footer={
              <TemplatePanelFooter
                trailing={
                  <button
                    onClick={simulateLoading}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs rounded-md bg-foundation-accent-purple text-white hover:bg-foundation-accent-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-3 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load Data"
                    )}
                  </button>
                }
              />
            }
          >
            {!loading && (
              <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                Content will appear here after loading
              </p>
            )}
          </TemplatePanel>
        </div>

        {/* Scrollable with Callbacks */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Scrollable Panel with Infinite Scroll
          </h2>
          <TemplatePanel
            variant="default"
            size="md"
            scrollable
            maxBodyHeight={300}
            onScrollBottom={() => {
              // Simulate loading more items
              if (itemCount < 20) {
                setTimeout(() => setItemCount((prev) => Math.min(prev + 5, 20)), 500);
              }
            }}
            header={
              <TemplatePanelHeader
                title="Scrollable Content"
                subtitle={`Showing ${itemCount} items - Scroll to bottom to load more`}
                leading={<ChevronDown className="size-4 text-foundation-accent-green" />}
                badge={itemCount}
                badgeVariant="info"
              />
            }
            footer={
              <TemplatePanelFooter
                leading={
                  <button
                    onClick={() => setScrollPosition(0)}
                    className="text-xs text-foundation-accent-blue hover:underline"
                  >
                    Scroll to top
                  </button>
                }
                trailing={
                  <button
                    onClick={() => setItemCount(5)}
                    className="px-3 py-1.5 text-xs rounded-md border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 transition-colors"
                  >
                    Reset
                  </button>
                }
              />
            }
          >
            <div className="space-y-3">
              {Array.from({ length: itemCount }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3"
                >
                  <p className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                    Item {i + 1}
                  </p>
                  <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                    Scroll to bottom to load more items
                  </p>
                </div>
              ))}
              {itemCount >= 20 && (
                <div className="text-center py-4">
                  <CheckCircle2 className="size-8 mx-auto mb-2 text-foundation-accent-green" />
                  <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                    All items loaded
                  </p>
                </div>
              )}
            </div>
          </TemplatePanel>
        </div>

        {/* Sticky Header & Footer */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Sticky Header & Footer
          </h2>
          <TemplatePanel
            variant="default"
            size="md"
            scrollable
            maxBodyHeight={250}
            stickyHeader
            stickyFooter
            header={
              <TemplatePanelHeader
                title="Sticky Elements"
                subtitle="Header and footer stay visible while scrolling"
                leading={<Filter className="size-4 text-foundation-accent-blue" />}
                trailing={
                  <button className="px-2 py-1 text-xs rounded bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 hover:bg-foundation-bg-light-4 dark:hover:bg-foundation-bg-dark-4 transition-colors">
                    <Search className="size-3" />
                  </button>
                }
              />
            }
            footer={
              <TemplatePanelFooter
                leading={<span className="text-xs">Sticky footer</span>}
                trailing={
                  <button className="px-3 py-1.5 text-xs rounded-md bg-foundation-accent-blue text-white hover:bg-foundation-accent-blue/90 transition-colors">
                    Apply
                  </button>
                }
              />
            }
          >
            <div className="space-y-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2"
                >
                  <p className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                    Content {i + 1}
                  </p>
                </div>
              ))}
            </div>
          </TemplatePanel>
        </div>

        {/* Resizable Panel */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Resizable Panel
          </h2>
          <TemplatePanel
            variant="default"
            size="md"
            resizable
            minHeight={150}
            maxHeight={500}
            onResize={(height) => console.log("Panel resized to:", height)}
            header={
              <TemplatePanelHeader
                title="Resizable Panel"
                subtitle="Drag the bottom edge to resize"
                leading={<GripVertical className="size-4 text-foundation-accent-purple" />}
              />
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                This panel can be resized by dragging the bottom edge. Min height: 150px, Max
                height: 500px.
              </p>
              <div className="p-4 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
                <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                  The resize handle appears on hover at the bottom edge.
                </p>
              </div>
            </div>
          </TemplatePanel>
        </div>

        {/* Draggable Panel */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Draggable Panel
          </h2>
          <TemplatePanel
            variant="default"
            size="md"
            draggable
            dragHandle
            onDragStart={() => console.log("Drag started")}
            onDragEnd={() => console.log("Drag ended")}
            header={
              <TemplatePanelHeader
                title="Draggable Panel"
                subtitle="Use the drag handle to reorder"
                leading={<GripVertical className="size-4 text-foundation-accent-orange" />}
              />
            }
          >
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              This panel has a drag handle at the top. In a real implementation, you'd use
              react-dnd or a similar library for drag-and-drop functionality.
            </p>
          </TemplatePanel>
        </div>

        {/* Feature Summary */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Complete Feature List
          </h2>
          <TemplatePanel variant="outlined" size="md">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                  Core Features
                </h3>
                <ul className="space-y-2 text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>4 visual variants (default, elevated, outlined, ghost)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>3 size presets with automatic padding & radius</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Collapsible body with controlled/uncontrolled state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Context API for accessing panel state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Compound components (Header & Footer)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>ARIA accessibility attributes</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                  Advanced Features
                </h3>
                <ul className="space-y-2 text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Dismissable/closable with close button</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Error state with retry functionality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Empty state with custom content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Loading state with spinner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>ScrollArea integration with callbacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Infinite scroll support (onScrollBottom)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                  Interaction Features
                </h3>
                <ul className="space-y-2 text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Resizable with min/max height constraints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Keyboard shortcuts (customizable)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Controlled scroll position</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Draggable with drag handle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Smooth animations & transitions</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                  Layout Features
                </h3>
                <ul className="space-y-2 text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Sticky header & footer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Badge indicators with 5 variants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Configurable dividers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Flexible header/footer slots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Custom class name overrides</span>
                  </li>
                </ul>
              </div>
            </div>
          </TemplatePanel>
        </div>
      </div>
    </div>
  );
}
