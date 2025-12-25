import "./main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

import { ensureMockOpenAI } from "@chatui/runtime";
import { ChatUIRoot } from "@chatui/ui";

if (import.meta.env.DEV) {
  ensureMockOpenAI();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppsSDKUIProvider>
      <ChatUIRoot />
    </AppsSDKUIProvider>
  </StrictMode>
);
