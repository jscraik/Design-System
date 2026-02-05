import { AppsSDKButton } from "@design-studio/ui";
import { IconChevronDownMd, IconChevronRightMd } from "@design-studio/ui/icons";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import type { TemplateRegistryEntry } from "@/generated/template-registry";

const STORAGE_KEY = "astudio.template.sidebar.collapsed";

type TemplateCategoryGroup = {
  id: string;
  label: string;
  icon: ReactNode;
  templates: TemplateRegistryEntry[];
};

type TemplateSidebarProps = {
  categories: TemplateCategoryGroup[];
  selectedId?: string;
  onSelect: (template: TemplateRegistryEntry) => void;
};

export function TemplateSidebar({ categories, selectedId, onSelect }: TemplateSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Record<string, boolean>;
      setCollapsed(parsed);
    } catch (error) {
      console.error("Unable to parse collapsed state", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleCategory = useCallback((categoryId: string) => {
    setCollapsed((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  }, []);

  const totalTemplates = useMemo(
    () => categories.reduce((count, group) => count + group.templates.length, 0),
    [categories],
  );

  return (
    <aside className="flex h-full w-full flex-col gap-2 border-b border-foundation-bg-light-3 bg-foundation-bg-light-2 p-4 dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-2 lg:border-b-0 lg:border-r">
      <div>
        <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
          Template Library
        </h2>
        <p className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
          {totalTemplates} templates available
        </p>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {categories.map((group) => {
          const isCollapsed = collapsed[group.id];

          return (
            <div key={group.id} className="space-y-2">
              <AppsSDKButton
                size="sm"
                variant="ghost"
                className="w-full justify-between px-2"
                onClick={() => toggleCategory(group.id)}
                aria-expanded={!isCollapsed}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foundation-bg-light-1 text-foundation-text-light-secondary dark:bg-foundation-bg-dark-1 dark:text-foundation-text-dark-secondary">
                    {group.icon}
                  </span>
                  {group.label}
                </span>
                <span className="flex items-center gap-1 text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                  {group.templates.length}
                  {isCollapsed ? (
                    <IconChevronRightMd className="h-3.5 w-3.5" />
                  ) : (
                    <IconChevronDownMd className="h-3.5 w-3.5" />
                  )}
                </span>
              </AppsSDKButton>
              {!isCollapsed && (
                <div className="space-y-1">
                  {group.templates.map((template) => {
                    const isSelected = template.id === selectedId;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => onSelect(template)}
                        aria-current={isSelected ? "true" : undefined}
                        className={`w-full rounded-xl border px-3 py-1.5 text-left text-sm transition-colors ${
                          isSelected
                            ? "border-foundation-accent-blue bg-foundation-bg-light-1 text-foundation-text-light-primary dark:bg-foundation-bg-dark-1 dark:text-foundation-text-dark-primary"
                            : "border-transparent text-foundation-text-light-secondary hover:border-foundation-bg-light-3 hover:bg-foundation-bg-light-1 dark:text-foundation-text-dark-secondary dark:hover:border-foundation-bg-dark-3 dark:hover:bg-foundation-bg-dark-1"
                        }`}
                      >
                        <div className="font-medium">{template.title}</div>
                        <div className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                          {template.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
