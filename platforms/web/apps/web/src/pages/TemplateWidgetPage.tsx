import { templatesGalleryRegistry } from "@chatui/ui/dev";

type TemplateWidgetPageProps = {
  templateId: string;
};

export function TemplateWidgetPage({ templateId }: TemplateWidgetPageProps) {
  const selectedTemplate = templatesGalleryRegistry.find((template) => template.id === templateId);
  const TemplateComponent = selectedTemplate?.Component;

  return (
    <div
      data-theme="dark"
      className="min-h-screen bg-foundation-bg-dark-1 text-foundation-text-dark-primary"
    >
      {TemplateComponent ? (
        <TemplateComponent {...selectedTemplate?.previewProps} />
      ) : (
        <div className="h-full min-h-[600px] flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
          Template not found: {templateId}
        </div>
      )}
    </div>
  );
}
