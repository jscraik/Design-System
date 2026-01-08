import { TemplateWidgetPage } from "../pages/TemplateWidgetPage";

import { Router } from "./Router";

export function App() {
  const templateId = import.meta.env.VITE_TEMPLATE_ID as string | undefined;
  if (templateId) {
    return <TemplateWidgetPage templateId={templateId} />;
  }

  return (
    <div className="min-h-screen">
      <a
        href="/templates"
        className="fixed top-4 right-4 z-50 rounded-full border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-2/90 dark:bg-foundation-bg-dark-2/90 px-3 py-1 text-xs font-medium text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary shadow-sm backdrop-blur hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-focus-ring"
      >
        Templates
      </a>
      <Router />
    </div>
  );
}
