import { AppsSDKButton } from "@design-studio/ui";
import { IconArrowLeftSm } from "@design-studio/ui/icons";

import { TemplateBrowser } from "../components/template-browser/TemplateBrowser";

type TemplateBrowserPageProps = {
  templateId?: string;
};

export function TemplateBrowserPage({ templateId }: TemplateBrowserPageProps) {
  return (
    <div className="min-h-dvh bg-background px-6 py-6 text-foreground">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-balance">ChatGPT UI Templates</h1>
          <p className="text-body-small text-text-secondary text-pretty">
            Browse production-ready templates and copy usage snippets.
          </p>
        </div>
        <AppsSDKButton
          size="sm"
          variant="outline"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <IconArrowLeftSm className="mr-2 size-4" />
          Widget Gallery
        </AppsSDKButton>
      </div>
      <TemplateBrowser initialTemplateId={templateId} />
    </div>
  );
}
