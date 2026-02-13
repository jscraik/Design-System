import { figma } from "@figma/code-connect";

import { DashboardTemplate } from "./DashboardTemplate";

/**
 * Figma Code Connect mapping for DashboardTemplate
 *
 * Figma: https://www.figma.com/file/<file-key>?node-id=<node-id>
 *
 * This template maps to the "Dashboard" component in Figma.
 */
figma.connect(DashboardTemplate, {
  figmaNode: {
    name: "Dashboard",
  },

  props: {
    title: figma.string("Dashboard title"),
    widgets: figma.children("Widget cards"),
  },

  example: <DashboardTemplate title="Dashboard" widgets={<div>Widget Cards</div>} />,
});
