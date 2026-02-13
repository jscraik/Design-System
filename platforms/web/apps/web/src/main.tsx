import "./styles/main.css";

import { createStandaloneHost, ensureMockOpenAI, HostProvider } from "@design-studio/runtime";
import { AppsSDKUIProvider } from "@design-studio/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App";
import { initThemePreference } from "./app/theme";

if (import.meta.env.DEV) {
  ensureMockOpenAI();
}

initThemePreference();

const host = createStandaloneHost(import.meta.env.VITE_API_BASE ?? "http://localhost:8787");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <App />
      </AppsSDKUIProvider>
    </HostProvider>
  </StrictMode>,
);
