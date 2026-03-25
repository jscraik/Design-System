import { useEffect, useState } from "react";

import { ChatShellPage } from "../pages/ChatShellPage";
import { HarnessPage } from "../pages/HarnessPage";
import { TemplateBrowserPage } from "../pages/TemplateBrowserPage";
import { TemplateWidgetPage } from "../pages/TemplateWidgetPage";

const getTemplateId = (pathname: string, search: string) => {
  const params = new URLSearchParams(search);
  const queryId = params.get("id") ?? undefined;
  if (queryId) return queryId;

  if (pathname.startsWith("/templates/")) {
    const slug = pathname.replace("/templates/", "");
    return slug ? decodeURIComponent(slug) : undefined;
  }

  return undefined;
};

const getTemplateWidgetId = (pathname: string) => {
  if (!pathname.startsWith("/template-widget/")) {
    return undefined;
  }

  const slug = pathname.replace("/template-widget/", "");
  return slug ? decodeURIComponent(slug) : undefined;
};

/**
 * Lightweight router for the widget harness and templates.
 */
export function Router() {
  const [location, setLocation] = useState(() => {
    if (typeof window === "undefined") {
      return { pathname: "/", search: "" };
    }
    return { pathname: window.location.pathname, search: window.location.search };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleChange = () => {
      setLocation({ pathname: window.location.pathname, search: window.location.search });
    };
    window.addEventListener("popstate", handleChange);
    return () => window.removeEventListener("popstate", handleChange);
  }, []);

  const widgetTemplateId = getTemplateWidgetId(location.pathname);
  if (widgetTemplateId) {
    return <TemplateWidgetPage templateId={widgetTemplateId} />;
  }

  if (location.pathname.startsWith("/templates")) {
    return <TemplateBrowserPage templateId={getTemplateId(location.pathname, location.search)} />;
  }

  if (location.pathname === "/harness") {
    return <HarnessPage />;
  }

  return <ChatShellPage />;
}
