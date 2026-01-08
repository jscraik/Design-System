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
    <div className="inline-flex items-center gap-2 text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
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
    <div className="h-full overflow-auto bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-1 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
            Template Panel Demo
          </h1>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Production-ready panel component with variants, collapsible state, scrollable bodies,
            loading indicators, and composable header/footer slots.
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

        {/* Closable Panels */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Closable Panels
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {showPanel1 ? (
              <TemplatePanel
                variant="default"
                size="md"
                header={
                  <TemplatePanelHeader
                    title="Dismissable Panel"
                    subtitle="Click the X to close"
                    leading={<IconNotification className="size-4 text-foundation-accent-blue" />}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPanel1(false)}
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 transition-colors"
                        aria-label="Close panel"
                      >
                        <IconX className="size-4" />
                      </button>
                    }
                  />
                }
              >
                <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  This panel can be closed using the header action.
                </p>
              </TemplatePanel>
            ) : (
              <button
                onClick={() => setShowPanel1(true)}
                className="h-32 border-2 border-dashed border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg flex items-center justify-center text-sm text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary hover:border-foundation-accent-blue hover:text-foundation-accent-blue transition-colors"
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
                    leading={<IconNotification className="size-4 text-foundation-accent-orange" />}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPanel2(false)}
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 transition-colors"
                        aria-label="Close panel"
                      >
                        <IconX className="size-4" />
                      </button>
                    }
                  />
                }
              >
                <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  Panel with a custom close action in the header.
                </p>
              </TemplatePanel>
            ) : (
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
              header={
                <TemplatePanelHeader
                  title="Error State Demo"
                  subtitle={errorState ? "Error occurred" : "Click button to trigger error"}
                  leading={<IconWarning className="size-4 text-foundation-accent-red" />}
                />
              }
              footer={
                <TemplatePanelFooter
                  trailing={
                    <button
                      onClick={errorState ? handleRetry : simulateError}
                      className="px-3 py-1.5 text-xs rounded-md bg-foundation-accent-red text-accent-foreground hover:bg-foundation-accent-red/90 transition-colors"
                    >
                      {errorState ? "Retry" : "Trigger Error"}
                    </button>
                  }
                />
              }
            >
              {errorState ? (
                <div className="flex items-start gap-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-4">
                  <IconWarning className="size-5 text-foundation-accent-red" />
                  <div>
                    <p className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                      Failed to load data
                    </p>
                    <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                      Please try again or check your connection.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
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
                  leading={<IconFolder className="size-4 text-foundation-accent-blue" />}
                />
              }
              footer={
                <TemplatePanelFooter
                  trailing={
                    <button
                      onClick={() => setEmptyState(!emptyState)}
                      className="px-3 py-1.5 text-xs rounded-md bg-foundation-accent-blue text-accent-foreground hover:bg-foundation-accent-blue/90 transition-colors"
                    >
                      {emptyState ? "Add Content" : "Clear Content"}
                    </button>
                  }
                />
              }
            >
              {emptyState ? (
                <div className="flex flex-col items-center text-center gap-2 py-6">
                  <IconFolder className="size-8 text-foundation-accent-blue" />
                  <p className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                    No items found
                  </p>
                  <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                    Try adjusting your filters or add a new item.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  This content is visible when not empty.
                </p>
              )}
            </TemplatePanel>
          </div>
        </div>

        {/* Collapsible Panel */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Collapsible Panel
          </h2>
          <TemplatePanel
            variant="default"
            size="md"
            collapsible
            header={
              <TemplatePanelHeader
                title="Settings Panel"
                subtitle="Use the chevron to collapse"
                leading={<IconSettings className="size-4 text-foundation-accent-blue" />}
                trailing={<PanelStatusIndicator />}
                showCollapseToggle
              />
            }
            footer={
              <TemplatePanelFooter
                leading={
                  <span className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                    Collapse toggle enabled
                  </span>
                }
                trailing={
                  <button className="px-3 py-1.5 text-xs rounded-md bg-foundation-accent-blue text-accent-foreground hover:bg-foundation-accent-blue/90 transition-colors">
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
                <input
                  type="checkbox"
                  className="size-4"
                  aria-label="Email Notifications"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  Push Notifications
                </label>
                <input type="checkbox" className="size-4" aria-label="Push Notifications" />
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
                leading={<IconSparkles className="size-4 text-foundation-accent-purple" />}
              />
            }
            footer={
              <TemplatePanelFooter
                trailing={
                  <button
                    onClick={simulateLoading}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs rounded-md bg-foundation-accent-purple text-accent-foreground hover:bg-foundation-accent-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                Content will appear here after loading.
              </p>
            )}
          </TemplatePanel>
        </div>

        {/* Scrollable Panel */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Scrollable Panel
          </h2>
          <TemplatePanel
            variant="default"
            size="md"
            scrollable
            maxBodyHeight={300}
            header={
              <TemplatePanelHeader
                title="Scrollable Content"
                subtitle={`Showing ${itemCount} items`}
                leading={<IconCategory className="size-4 text-foundation-accent-blue" />}
                trailing={
                  <button className="px-2 py-1 text-xs rounded bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 hover:bg-foundation-bg-light-4 dark:hover:bg-foundation-bg-dark-4 transition-colors">
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
                    className="text-xs text-foundation-accent-blue hover:underline"
                  >
                    Reset list
                  </button>
                }
                trailing={
                  <button
                    onClick={handleLoadMore}
                    disabled={itemCount >= 20}
                    className="px-3 py-1.5 text-xs rounded-md border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 transition-colors disabled:opacity-50"
                  >
                    Load more
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
                    Scroll to see more items
                  </p>
                </div>
              ))}
              {itemCount >= 20 && (
                <div className="text-center py-4">
                  <IconCheckCircle className="size-8 mx-auto mb-2 text-foundation-accent-green" />
                  <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                    All items loaded
                  </p>
                </div>
              )}
            </div>
          </TemplatePanel>
        </div>

        {/* Feature Summary */}
        <div>
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Feature Summary
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
                    <span>Loading state with spinner and placeholder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Scrollable body with max height support</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                  Composition & UX
                </h3>
                <ul className="space-y-2 text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Compound components (Header & Footer)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Context API for accessing panel state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Configurable dividers and animation toggles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
                    <span>Flexible header/footer slots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foundation-accent-green">✓</span>
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
