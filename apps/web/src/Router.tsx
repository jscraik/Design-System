import { ChatUIRoot } from "@chatui/ui";
import { useCallback, useEffect, useState } from "react";

import { WidgetHarness } from "./WidgetHarness";
import {
  sampleChatHistory,
  sampleMessages,
  sampleModels,
  sampleProjects,
  sampleUser,
} from "./sample-data";
import { AboutPage } from "./pages/AboutPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

export type Route = "chat" | "harness" | "settings" | "profile" | "about";

interface RouterProps {
  initialRoute?: Route;
}

export function Router({ initialRoute }: RouterProps) {
  const [currentRoute, setCurrentRoute] = useState<Route>(() => {
    if (initialRoute) return initialRoute;

    // Parse route from URL
    const path = window.location.pathname;
    const search = window.location.search;

    if (path === "/harness" || search.includes("harness=true")) return "harness";
    if (path === "/settings") return "settings";
    if (path === "/profile") return "profile";
    if (path === "/about") return "about";

    return "chat";
  });

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/settings") setCurrentRoute("settings");
      else if (path === "/profile") setCurrentRoute("profile");
      else if (path === "/about") setCurrentRoute("about");
      else if (path === "/harness") setCurrentRoute("harness");
      else setCurrentRoute("chat");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navigation function
  const navigate = useCallback((route: Route) => {
    setCurrentRoute(route);

    // Update URL without page reload
    const url = route === "chat" ? "/" : `/${route}`;
    window.history.pushState({}, "", url);
  }, []);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const detail = (event as CustomEvent<Route>).detail;
      if (!detail) return;
      navigate(detail);
    };

    window.addEventListener("navigate", handleNavigate);
    return () => window.removeEventListener("navigate", handleNavigate);
  }, [navigate]);

  // Render current page
  const renderPage = () => {
    switch (currentRoute) {
      case "harness":
        return <WidgetHarness />;
      case "settings":
        return <SettingsPage onNavigate={navigate} />;
      case "profile":
        return <ProfilePage onNavigate={navigate} />;
      case "about":
        return <AboutPage onNavigate={navigate} />;
      case "chat":
      default:
        return (
          <ChatUIRoot
            models={sampleModels}
            messages={sampleMessages}
            projects={sampleProjects}
            chatHistory={sampleChatHistory}
            user={sampleUser}
          />
        );
    }
  };

  return renderPage();
}

// Navigation hook for components
export function useNavigation() {
  const navigate = (route: Route) => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: route }));
  };

  return { navigate };
}
