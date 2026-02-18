import { templateRegistry } from "@/generated/template-registry";

type TemplateWidgetPageProps = {
  templateId: string;
};

export function TemplateWidgetPage({ templateId }: TemplateWidgetPageProps) {
  const selectedTemplate = templateRegistry.find((template) => template.id === templateId);
  const TemplateComponent = selectedTemplate?.Component;

  return (
    <div className="min-h-screen bg-foundation-bg-light-1 text-foundation-text-light-primary dark:bg-foundation-bg-dark-1 dark:text-foundation-text-dark-primary">
      {TemplateComponent ? (
        <TemplateComponent />
      ) : (
        <div className="h-full min-h-[600px] flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
          Template not found: {templateId}
        </div>
      )}
    </div>
  );
}
