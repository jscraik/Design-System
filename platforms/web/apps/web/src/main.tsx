import "./styles/main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HostProvider, createStandaloneHost, ensureMockOpenAI } from "@chatui/runtime";
import { AppsSDKUIProvider } from "@chatui/ui";

import { App } from "./app/App";

if (import.meta.env.DEV) {
  ensureMockOpenAI();
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
document.documentElement.setAttribute("data-theme", prefersDark.matches ? "dark" : "light");
prefersDark.addEventListener("change", (event) => {
  document.documentElement.setAttribute("data-theme", event.matches ? "dark" : "light");
});

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
