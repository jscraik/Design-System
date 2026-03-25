import { templateRegistry } from "@/generated/template-registry";

type TemplateWidgetPageProps = {
  templateId: string;
};

export function TemplateWidgetPage({ templateId }: TemplateWidgetPageProps) {
  const selectedTemplate = templateRegistry.find((template) => template.id === templateId);
  const TemplateComponent = selectedTemplate?.Component;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {TemplateComponent ? (
        <TemplateComponent />
      ) : (
        <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
          Template not found: {templateId}
        </div>
      )}
    </div>
  );
}
