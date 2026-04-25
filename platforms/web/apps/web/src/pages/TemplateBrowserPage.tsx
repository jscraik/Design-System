import { AppsSDKButton, ProductPageShell } from "@design-studio/ui";
import { IconArrowLeftSm } from "@design-studio/ui/icons";

import { TemplateBrowser } from "../components/template-browser/TemplateBrowser";

type TemplateBrowserPageProps = {
  templateId?: string;
};

export function TemplateBrowserPage({ templateId }: TemplateBrowserPageProps) {
  return (
    <ProductPageShell
      title="ChatGPT UI Templates"
      description="Browse production-ready templates and copy usage snippets."
      actions={
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
      }
    >
      <TemplateBrowser initialTemplateId={templateId} />
    </ProductPageShell>
  );
}
