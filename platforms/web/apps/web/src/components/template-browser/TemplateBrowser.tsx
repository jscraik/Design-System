import { useEffect, useMemo, useState } from "react";
import {
  IconCheckCircle,
  IconFolder,
  IconGrid3x3,
  IconLightBulb,
  IconPlusCircle,
  IconSettings,
  IconSidebar,
  IconStar,
} from "@astudio/ui/icons";

import {
  templateCategoryLabels,
  templateRegistry,
  type TemplateCategory,
  type TemplateRegistryEntry,
} from "@/generated/template-registry";

import { TemplatePreview } from "./TemplatePreview";
import { TemplateSearch } from "./TemplateSearch";
import { TemplateSidebar } from "./TemplateSidebar";

const CATEGORY_ORDER: TemplateCategory[] = [
  "educational",
  "templates",
  "components",
  "design-system",
  "layouts",
  "settings",
  "modals",
  "panels",
];

const CATEGORY_ICONS: Record<TemplateCategory, React.ReactNode> = {
  educational: <IconLightBulb className="h-4 w-4" />,
  templates: <IconGrid3x3 className="h-4 w-4" />,
  components: <IconCheckCircle className="h-4 w-4" />,
  "design-system": <IconStar className="h-4 w-4" />,
  layouts: <IconSidebar className="h-4 w-4" />,
  settings: <IconSettings className="h-4 w-4" />,
  modals: <IconPlusCircle className="h-4 w-4" />,
  panels: <IconFolder className="h-4 w-4" />,
};

type TemplateBrowserProps = {
  initialTemplateId?: string;
};

const updateUrl = (templateId?: string) => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (templateId) {
    url.searchParams.set("id", templateId);
  } else {
    url.searchParams.delete("id");
  }
  window.history.replaceState({}, "", url.toString());
};

export function TemplateBrowser({ initialTemplateId }: TemplateBrowserProps) {
  const [query, setQuery] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(
    initialTemplateId,
  );

  useEffect(() => {
    if (initialTemplateId) {
      setSelectedTemplateId(initialTemplateId);
    }
  }, [initialTemplateId]);

  const filteredTemplates = useMemo(() => {
    if (!query.trim()) return templateRegistry;
    const normalized = query.toLowerCase();
    return templateRegistry.filter((template) => {
      const matchesTitle = template.title.toLowerCase().includes(normalized);
      const matchesDescription = template.description.toLowerCase().includes(normalized);
      const matchesTags = template.tags.some((tag) => tag.includes(normalized));
      return matchesTitle || matchesDescription || matchesTags;
    });
  }, [query]);

  const categories = useMemo(() => {
    return CATEGORY_ORDER.map((category) => {
      const templates = filteredTemplates.filter((template) => template.category === category);
      return {
        id: category,
        label: templateCategoryLabels[category],
        icon: CATEGORY_ICONS[category],
        templates,
      };
    }).filter((category) => category.templates.length > 0 || query.length === 0);
  }, [filteredTemplates, query]);

  const selectedTemplate = useMemo<TemplateRegistryEntry | undefined>(() => {
    if (!selectedTemplateId) return undefined;
    return templateRegistry.find((template) => template.id === selectedTemplateId);
  }, [selectedTemplateId]);

  const handleSelect = (template: TemplateRegistryEntry) => {
    setSelectedTemplateId(template.id);
    updateUrl(template.id);
  };

  return (
    <div className="grid h-full min-h-[720px] grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <div className="flex h-full flex-col gap-4">
        <TemplateSearch
          query={query}
          onQueryChange={setQuery}
          resultsCount={filteredTemplates.length}
          totalCount={templateRegistry.length}
        />
        <TemplateSidebar
          categories={categories}
          selectedId={selectedTemplateId}
          onSelect={handleSelect}
        />
      </div>
      <TemplatePreview template={selectedTemplate} />
    </div>
  );
}
