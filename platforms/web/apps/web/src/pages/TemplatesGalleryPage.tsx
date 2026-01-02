import type { ReactNode } from "react";
import { Component, useEffect, useMemo, useState } from "react";
import {
  getTemplatesGalleryByCategory,
  templatesGalleryCategories,
  templatesGalleryRegistry,
} from "@chatui/ui/dev";

type TemplatesGalleryPageProps = {
  initialTemplateId?: string;
};

const CATEGORY_ORDER: (keyof typeof templatesGalleryCategories)[] = [
  "layouts",
  "templates",
  "components",
  "apps-sdk-examples",
  "panels",
  "modals",
  "design-system",
  "blocks",
];

function getDefaultId() {
  return templatesGalleryRegistry[0]?.id;
}

class PreviewErrorBoundary extends Component<
  { fallback: ReactNode; children?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function TemplatesGalleryPage({ initialTemplateId }: TemplatesGalleryPageProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialTemplateId ?? getDefaultId(),
  );

  useEffect(() => {
    if (!initialTemplateId) return;
    const match = templatesGalleryRegistry.some((template) => template.id === initialTemplateId);
    setSelectedId(match ? initialTemplateId : getDefaultId());
  }, [initialTemplateId]);

  useEffect(() => {
    if (!selectedId) return;
    const nextPath = `/templates/${selectedId}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }, [selectedId]);

  const selectedTemplate = useMemo(
    () => templatesGalleryRegistry.find((template) => template.id === selectedId) ?? templatesGalleryRegistry[0],
    [selectedId],
  );

  const TemplateComponent = selectedTemplate?.Component;

  const groupedTemplates = useMemo(() => {
    return CATEGORY_ORDER.map((categoryKey) => ({
      categoryKey,
      categoryName: templatesGalleryCategories[categoryKey],
      templates: getTemplatesGalleryByCategory(categoryKey),
    })).filter((group) => group.templates.length > 0);
  }, []);

  return (
    <div
      data-theme="dark"
      className="min-h-screen bg-foundation-bg-dark-1 text-foundation-text-dark-primary"
    >
      <div className="fixed top-0 left-0 right-0 z-10 border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-2/95 dark:bg-foundation-bg-dark-2/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              ChatUI Templates Gallery
            </h1>
            <p className="text-sm text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mt-1">
              Canonical templates + demos from @chatui/ui/dev
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 rounded-lg text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              {templatesGalleryRegistry.length} templates
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen pt-[89px]">
        <nav
          aria-label="Template library"
          className="w-80 border-r border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-y-auto"
        >
          <div className="p-4">
            <div className="text-xs uppercase tracking-wider font-medium text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mb-4 px-2">
              Template Library
            </div>
            <div className="sr-only" aria-live="polite">
              Selected template: {selectedTemplate?.title ?? "none"}
            </div>
            <div className="flex-1 overflow-y-auto pb-4 space-y-6">
              {groupedTemplates.map((group) => (
                <div key={group.categoryKey}>
                  <div className="text-sm font-medium text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-3 px-2">
                    {group.categoryName}
                  </div>
                  <ul className="space-y-2" role="list">
                    {group.templates.map((template) => {
                      const isActive = template.id === selectedId;
                      return (
                        <li key={template.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(template.id)}
                            aria-pressed={isActive}
                            className={`w-full text-left rounded-lg border px-4 py-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-focus-ring ${
                              isActive
                                ? "border-foundation-accent-blue-light dark:border-foundation-accent-blue bg-foundation-accent-blue-light/10 dark:bg-foundation-accent-blue/10 text-foundation-text-light-primary dark:text-foundation-text-dark-primary shadow-sm"
                                : "border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:bg-foundation-bg-light-3/50 dark:hover:bg-foundation-bg-dark-3/50 hover:border-foundation-bg-light-3 dark:hover:border-foundation-bg-dark-3"
                            }`}
                          >
                            <div
                              className={`text-sm font-medium ${
                                isActive
                                  ? "text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
                                  : ""
                              }`}
                            >
                              {template.title}
                            </div>
                            <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mt-1 line-clamp-2">
                              {template.description}
                            </p>
                            {template.tags && template.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {template.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className={`px-2 py-0.5 text-xs rounded ${
                                      isActive
                                        ? "bg-foundation-accent-blue-light/20 dark:bg-foundation-accent-blue/20 text-foundation-accent-blue-light dark:text-foundation-accent-blue"
                                        : "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <main className="flex-1 p-8 overflow-auto bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              {selectedTemplate?.title}
            </h2>
            <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-2">
              {selectedTemplate?.description}
            </p>
            {selectedTemplate?.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedTemplate.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-lg">
            <PreviewErrorBoundary
              fallback={
                <div className="h-full min-h-[600px] flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                  Preview failed. Select another template.
                </div>
              }
            >
              {TemplateComponent ? (
                <TemplateComponent {...selectedTemplate?.previewProps} />
              ) : (
                <div className="h-full min-h-[600px] flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                  Select a template to preview
                </div>
              )}
            </PreviewErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
