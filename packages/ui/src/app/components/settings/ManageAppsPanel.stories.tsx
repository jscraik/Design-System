import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { ManageAppsPanel } from "./ManageAppsPanel";

/**
 * ManageAppsPanel allows users to manage connected apps and install new ones.
 * Shows connected apps with their status and available apps to connect.
 *
 * ## Usage
 * ```tsx
 * import { ManageAppsPanel } from "@chatui/ui";
 *
 * <ManageAppsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof ManageAppsPanel> = {
  title: "Settings/ManageAppsPanel",
  component: ManageAppsPanel,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onBack: {
      description: "Callback when back button is clicked",
    },
  },
  args: {
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ManageAppsPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto bg-[var(--foundation-bg-dark-1)] rounded-lg overflow-hidden">
      <ManageAppsPanel {...args} />
    </div>
  ),
};
