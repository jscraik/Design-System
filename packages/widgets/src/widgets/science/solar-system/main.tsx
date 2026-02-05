import { createEmbeddedHost, ensureMockOpenAI, HostProvider } from "@design-studio/runtime";
import { AppsSDKUIProvider } from "@design-studio/ui";
import { createRoot } from "react-dom/client";

import "../../../styles/widget.css";

import App from "./solar-system";

const root = document.getElementById("solar-system-root");

if (root) {
  if (import.meta.env.DEV) {
    ensureMockOpenAI();
  }

  const host = createEmbeddedHost();

  createRoot(root).render(
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <App />
      </AppsSDKUIProvider>
    </HostProvider>,
  );
}
