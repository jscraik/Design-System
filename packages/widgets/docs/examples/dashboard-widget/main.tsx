import {
  HostProvider,
  createEmbeddedHost,
  ensureMockOpenAI,
  useToolOutput,
} from "@design-studio/runtime";
import { AppsSDKUIProvider } from "@design-studio/ui";
import type { DashboardChat, DashboardStat } from "@design-studio/ui/dev";
import { DashboardPage } from "@design-studio/ui/dev";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../src/styles.css";

if (import.meta.env.DEV) {
  ensureMockOpenAI({
    toolOutput: {
      headerText: "ChatGPT Dashboard Widget",
      stats: [
        { label: "Total Conversations", value: "1,234", change: "+12%" },
        { label: "Messages Today", value: "89", change: "+5%" },
        { label: "Active Models", value: "3", change: "0%" },
        { label: "Response Time", value: "1.2s", change: "-8%" },
      ],
      recentChats: [
        { id: 1, title: "Code Review Session", model: "GPT-4", time: "2 min ago" },
        { id: 2, title: "Project Planning", model: "Claude", time: "1 hour ago" },
        { id: 3, title: "Debug Help", model: "GPT-4o", time: "3 hours ago" },
      ],
    },
  });
}

type DashboardToolOutput = {
  headerText?: string;
  stats?: DashboardStat[];
  recentChats?: DashboardChat[];
};

// Widget-specific dashboard with minimal chrome
function DashboardWidget() {
  const toolOutput = useToolOutput() as DashboardToolOutput | null;
  const headerText = toolOutput?.headerText ?? "ChatGPT Dashboard Widget";

  return (
    <DashboardPage
      onNavigate={(page) => {
        // In a widget, you might post messages to parent
        window.parent?.postMessage({ type: "navigate", page }, "*");
      }}
      headerSlot={<div className="text-secondary text-sm">{headerText}</div>}
      stats={toolOutput?.stats}
      recentChats={toolOutput?.recentChats}
    />
  );
}

function DashboardWidgetApp() {
  const host = createEmbeddedHost();

  return (
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <DashboardWidget />
      </AppsSDKUIProvider>
    </HostProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DashboardWidgetApp />
  </StrictMode>,
);
