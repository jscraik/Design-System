import { AppsSDKButton } from "@design-studio/ui";
import { IconArrowLeftSm } from "@design-studio/ui/icons";

import { TemplateBrowser } from "../components/template-browser/TemplateBrowser";

type TemplateBrowserPageProps = {
  templateId?: string;
};

export function TemplateBrowserPage({ templateId }: TemplateBrowserPageProps) {
  return (
    <div className="min-h-screen bg-foundation-bg-light-1 px-6 py-6 text-foundation-text-light-primary dark:bg-foundation-bg-dark-1 dark:text-foundation-text-dark-primary">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">ChatGPT UI Templates</h1>
          <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
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
          <IconArrowLeftSm className="mr-2 h-4 w-4" />
          Widget Gallery
        </AppsSDKButton>
      </div>
      <TemplateBrowser initialTemplateId={templateId} />
    </div>
  );
}
