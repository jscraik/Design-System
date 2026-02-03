import { useState } from "react";

import {
  IconCategory,
  IconCheckCircle,
  IconFolder,
  IconNotification,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconSparkles,
  IconWarning,
  IconX,
} from "../../../icons";
import {
  TemplatePanel,
  TemplatePanelHeader,
  TemplatePanelFooter,
  useTemplatePanel,
} from "../../blocks/TemplatePanel";

// Demo component that uses the panel context
function PanelStatusIndicator() {
  const { isCollapsed, isLoading } = useTemplatePanel();

  return (
    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      {isLoading && <IconRefresh className="size-3 animate-spin" />}
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
  const [itemCount, setItemCount] = useState(5);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const simulateError = () => {
    setErrorState(true);
  };

  const handleRetry = () => {
    setErrorState(false);
    simulateLoading();
  };

  const handleLoadMore = () => {
    setItemCount((prev) => Math.min(prev + 5, 20));
  };

  return (
    <div className="h-full overflow-auto bg-secondary dark:bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl text-foreground mb-2">Template Panel Demo</h1>
          <p className="text-text-secondary">
            Production-ready panel component with variants, collapsible state, scrollable bodies,
            loading indicators, and composable header/footer slots.
          </p>
        </div>

        {/* Variants Showcase */}
        <div>
          <h2 className="text-lg text-foreground mb-4">Panel Variants</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <TemplatePanel variant="default" size="md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Default Variant</h3>
                <p className="text-xs text-text-secondary">
                  Standard panel with subtle shadow and border
                </p>
              </div>
            </TemplatePanel>

            <TemplatePanel variant="elevated" size="md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Elevated Variant</h3>
                <p className="text-xs text-text-secondary">Enhanced shadow for emphasis</p>
              </div>
            </TemplatePanel>

            <TemplatePanel variant="outlined" size="md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Outlined Variant</h3>
                <p className="text-xs text-text-secondary">Transparent with thicker border</p>
              </div>
            </TemplatePanel>

            <TemplatePanel variant="ghost" size="md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Ghost Variant</h3>
                <p className="text-xs text-text-secondary">No border or shadow</p>
              </div>
            </TemplatePanel>
          </div>
        </div>

        {/* Closable Panels */}
        <div>
          <h2 className="text-lg text-foreground mb-4">Closable Panels</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {showPanel1 ? (
              <TemplatePanel
                variant="default"
                size="md"
                header={
                  <TemplatePanelHeader
                    title="Dismissable Panel"
                    subtitle="Click the X to close"
                    leading={<IconNotification className="size-4 text-accent-blue" />}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPanel1(false)}
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-text-secondary hover:bg-muted transition-colors"
                        aria-label="Close panel"
                      >
                        <IconX className="size-4" />
                      </button>
                    }
                  />
                }
              >
                <p className="text-sm text-text-secondary">
                  This panel can be closed using the header action.
                </p>
              </TemplatePanel>
            ) : (
              <button
                onClick={() => setShowPanel1(true)}
                className="h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground hover:border-accent-blue hover:text-accent-blue transition-colors"
              >
                Click to restore panel
              </button>
            )}

            {showPanel2 ? (
              <TemplatePanel
                variant="default"
                size="md"
                header={
                  <TemplatePanelHeader
                    title="Notifications"
                    subtitle="New updates available"
                    leading={<IconNotification className="size-4 text-accent-orange" />}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPanel2(false)}
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-text-secondary hover:bg-muted transition-colors"
                        aria-label="Close panel"
                      >
                        <IconX className="size-4" />
                      </button>
                    }
                  />
                }
              >
                <p className="text-sm text-text-secondary">
                  Panel with a custom close action in the header.
                </p>
              </TemplatePanel>
            ) : (
              <button
                onClick={() => setShowPanel2(true)}
                className="h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground hover:border-accent-blue hover:text-accent-blue transition-colors"
              >
                Click to restore panel
              </button>
            )}
          </div>
        </div>

        {/* Error & Empty States */}
        <div>
          <h2 className="text-lg text-foreground mb-4">Error & Empty States</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <TemplatePanel
              variant="default"
              size="md"
              header={
                <TemplatePanelHeader
                  title="Error State Demo"
                  subtitle={errorState ? "Error occurred" : "Click button to trigger error"}
                  leading={<IconWarning className="size-4 text-status-error" />}
                />
              }
              footer={
                <TemplatePanelFooter
                  trailing={
                    <button
                      onClick={errorState ? handleRetry : simulateError}
                      className="px-3 py-1.5 text-xs rounded-md bg-status-error text-accent-foreground hover:bg-status-error/90 transition-colors"
                    >
                      {errorState ? "Retry" : "Trigger Error"}
                    </button>
                  }
                />
              }
            >
              {errorState ? (
                <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
                  <IconWarning className="size-5 text-status-error" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Failed to load data</p>
                    <p className="text-xs text-muted-foreground">
                      Please try again or check your connection.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-secondary">
                  Content will be replaced by an error state when triggered.
                </p>
              )}
            </TemplatePanel>

            <TemplatePanel
              variant="default"
              size="md"
              header={
                <TemplatePanelHeader
                  title="Empty State Demo"
                  subtitle={emptyState ? "No content" : "Has content"}
                  leading={<IconFolder className="size-4 text-accent-blue" />}
                />
              }
              footer={
                <TemplatePanelFooter
                  trailing={
                    <button
                      onClick={() => setEmptyState(!emptyState)}
                      className="px-3 py-1.5 text-xs rounded-md bg-accent-blue text-accent-foreground hover:bg-accent-blue/90 transition-colors"
                    >
                      {emptyState ? "Add Content" : "Clear Content"}
                    </button>
                  }
                />
              }
            >
              {emptyState ? (
                <div className="flex flex-col items-center text-center gap-2 py-6">
                  <IconFolder className="size-8 text-accent-blue" />
                  <p className="text-sm text-foreground">No items found</p>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your filters or add a new item.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-text-secondary">
                  This content is visible when not empty.
                </p>
              )}
            </TemplatePanel>
          </div>
        </div>

        {/* Collapsible Panel */}
        <div>
          <h2 className="text-lg text-foreground mb-4">Collapsible Panel</h2>
          <TemplatePanel
            variant="default"
            size="md"
            collapsible
            header={
              <TemplatePanelHeader
                title="Settings Panel"
                subtitle="Use the chevron to collapse"
                leading={<IconSettings className="size-4 text-accent-blue" />}
                trailing={<PanelStatusIndicator />}
                showCollapseToggle
              />
            }
            footer={
              <TemplatePanelFooter
                leading={
                  <span className="text-xs text-muted-foreground">Collapse toggle enabled</span>
                }
                trailing={
                  <button className="px-3 py-1.5 text-xs rounded-md bg-accent-blue text-accent-foreground hover:bg-accent-blue/90 transition-colors">
                    Save
                  </button>
                }
              />
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-foreground">Email Notifications</label>
                <input
                  type="checkbox"
                  className="size-4"
                  aria-label="Email Notifications"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-foreground">Push Notifications</label>
                <input type="checkbox" className="size-4" aria-label="Push Notifications" />
              </div>
            </div>
          </TemplatePanel>
        </div>

        {/* Loading State */}
        <div>
          <h2 className="text-lg text-foreground mb-4">Loading State</h2>
          <TemplatePanel
            variant="default"
            size="md"
            loading={loading}
            header={
              <TemplatePanelHeader
                title="Data Panel"
                subtitle={loading ? "Loading content..." : "Click the button to load"}
                leading={<IconSparkles className="size-4 text-accent-purple" />}
              />
            }
            footer={
              <TemplatePanelFooter
                trailing={
                  <button
                    onClick={simulateLoading}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs rounded-md bg-accent-purple text-accent-foreground hover:bg-accent-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <IconRefresh className="size-3 animate-spin" />
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
              <p className="text-sm text-text-secondary">Content will appear here after loading.</p>
            )}
          </TemplatePanel>
        </div>

        {/* Scrollable Panel */}
        <div>
          <h2 className="text-lg text-foreground mb-4">Scrollable Panel</h2>
          <TemplatePanel
            variant="default"
            size="md"
            scrollable
            maxBodyHeight={300}
            header={
              <TemplatePanelHeader
                title="Scrollable Content"
                subtitle={`Showing ${itemCount} items`}
                leading={<IconCategory className="size-4 text-accent-blue" />}
                trailing={
                  <button className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80 dark:hover:bg-muted transition-colors">
                    <IconSearch className="size-3" />
                  </button>
                }
              />
            }
            footer={
              <TemplatePanelFooter
                leading={
                  <button
                    onClick={() => setItemCount(5)}
                    className="text-xs text-accent-blue hover:underline"
                  >
                    Reset list
                  </button>
                }
                trailing={
                  <button
                    onClick={handleLoadMore}
                    disabled={itemCount >= 20}
                    className="px-3 py-1.5 text-xs rounded-md border border-border text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    Load more
                  </button>
                }
              />
            }
          >
            <div className="space-y-3">
              {Array.from({ length: itemCount }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary border border-border">
                  <p className="text-sm text-foreground">Item {i + 1}</p>
                  <p className="text-xs text-muted-foreground">Scroll to see more items</p>
                </div>
              ))}
              {itemCount >= 20 && (
                <div className="text-center py-4">
                  <IconCheckCircle className="size-8 mx-auto mb-2 text-accent-green" />
                  <p className="text-xs text-muted-foreground">All items loaded</p>
                </div>
              )}
            </div>
          </TemplatePanel>
        </div>

        {/* Feature Summary */}
        <div>
          <h2 className="text-lg text-foreground mb-4">Feature Summary</h2>
          <TemplatePanel variant="outlined" size="md">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Core Features</h3>
                <ul className="space-y-2 text-xs text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>4 visual variants (default, elevated, outlined, ghost)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>3 size presets with automatic padding & radius</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>Collapsible body with controlled/uncontrolled state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>Loading state with spinner and placeholder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>Scrollable body with max height support</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Composition & UX</h3>
                <ul className="space-y-2 text-xs text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>Compound components (Header & Footer)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>Context API for accessing panel state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>Configurable dividers and animation toggles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>Flexible header/footer slots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    <span>ARIA labelling support</span>
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
