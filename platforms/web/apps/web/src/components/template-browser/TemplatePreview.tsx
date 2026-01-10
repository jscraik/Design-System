import { AppsSDKBadge, AppsSDKButton } from "@astudio/ui";
import { IconCopy, IconMoon, IconSun } from "@astudio/ui/icons";

import { TemplateHost } from "./TemplateHost";

import { useThemePreference } from "@/app/useThemePreference";
import type { TemplateRegistryEntry } from "@/generated/template-registry";

type TemplatePreviewProps = {
  template?: TemplateRegistryEntry;
};

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const { theme, setTheme } = useThemePreference();

  if (!template) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-foundation-bg-light-3 bg-foundation-bg-light-1 text-sm text-foundation-text-light-secondary dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-1 dark:text-foundation-text-dark-secondary">
        Select a template to preview
      </div>
    );
  }

  const handleCopyUsage = async () => {
    const snippet = `import { ${template.entry} } from "@/templates/registry";\n\n<${template.entry} />`;
    try {
      await navigator.clipboard.writeText(snippet);
    } catch (error) {
      console.error("Unable to copy usage snippet", error);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="flex flex-col gap-3 rounded-2xl border border-foundation-bg-light-3 bg-foundation-bg-light-1 p-5 dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              {template.title}
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              {template.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <AppsSDKBadge className="bg-foundation-bg-light-3 text-foundation-text-light-secondary dark:bg-foundation-bg-dark-3 dark:text-foundation-text-dark-secondary">
                {template.status}
              </AppsSDKBadge>
              {template.tags.map((tag) => (
                <AppsSDKBadge
                  key={tag}
                  className="bg-foundation-bg-light-2 text-foundation-text-light-tertiary dark:bg-foundation-bg-dark-2 dark:text-foundation-text-dark-tertiary"
                >
                  {tag}
                </AppsSDKBadge>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <AppsSDKButton size="sm" variant="outline" onClick={handleCopyUsage}>
              <IconCopy className="mr-2 h-4 w-4" />
              Copy usage
            </AppsSDKButton>
            <AppsSDKButton
              size="sm"
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <IconSun className="mr-2 h-4 w-4" />
              ) : (
                <IconMoon className="mr-2 h-4 w-4" />
              )}
              {theme === "dark" ? "Light" : "Dark"} mode
            </AppsSDKButton>
          </div>
        </div>
        <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
          Source: {template.sourcePath}
        </div>
      </header>
      <div className="flex-1 rounded-2xl border border-foundation-bg-light-3 bg-foundation-bg-light-1 p-4 dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-1">
        <TemplateHost templateId={template.id}>
          <template.Component />
        </TemplateHost>
      </div>
    </div>
  );
}
