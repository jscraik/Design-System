import { useEffect, useMemo, useState } from "react";
import { ChatUIRoot } from "@chatui/ui";

import { HarnessPage } from "../pages/HarnessPage";
import { AboutPage } from "../pages/AboutPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SettingsPage } from "../pages/SettingsPage";
import { TemplatesGalleryPage } from "../pages/TemplatesGalleryPage";

function normalizePath(pathname: string) {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function usePathname() {
  const [pathname, setPathname] = useState(() =>
    typeof window === "undefined" ? "/" : normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const handlePopState = () => setPathname(normalizePath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return pathname;
}

const NotFound = () => (
  <div className="min-h-screen bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary p-6">
    <h1 className="text-2xl font-semibold">Not Found</h1>
    <p className="mt-2 text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
      The requested route is not available.
    </p>
  </div>
);

/**
 * Lightweight router to support the chat shell + widget harness surfaces.
 */
export function Router() {
  const pathname = usePathname();

  const route = useMemo(() => {
    if (pathname === "/") return <ChatUIRoot />;
    if (pathname === "/harness") return <HarnessPage />;
    if (pathname === "/settings") return <SettingsPage />;
    if (pathname === "/profile") return <ProfilePage />;
    if (pathname === "/about") return <AboutPage />;

    if (pathname.startsWith("/templates")) {
      const parts = pathname.split("/").filter(Boolean);
      const templateId = parts.length > 1 ? parts[1] : undefined;
      return <TemplatesGalleryPage initialTemplateId={templateId} />;
    }

    return <NotFound />;
  }, [pathname]);

  return route;
}
