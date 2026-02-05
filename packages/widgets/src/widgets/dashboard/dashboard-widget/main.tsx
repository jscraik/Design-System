import "../../../styles/widget.css";
import { useWidgetProps } from "../../../shared/use-widget-props";
import { mountWidget } from "../../../shared/widget-base";

import { DashboardWidget, type DashboardWidgetProps } from "./dashboard-widget";

function DashboardWidgetContainer() {
  const props = useWidgetProps<DashboardWidgetProps>({
    dashboard: true,
    headerText: "Dashboard",
    stats: [],
    recentChats: [],
  });
  return <DashboardWidget {...props} />;
}

mountWidget(<DashboardWidgetContainer />);
