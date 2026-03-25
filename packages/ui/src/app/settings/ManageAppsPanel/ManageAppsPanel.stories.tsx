import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { ManageAppsPanel } from "./ManageAppsPanel";

/**
 * ManageAppsPanel allows users to manage connected apps and install new ones.
 * Shows connected apps with their status and available apps to connect.
 *
 * ## Usage
 * ```tsx
 * import { ManageAppsPanel } from "@design-studio/ui";
 *
 * <ManageAppsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof ManageAppsPanel> = {
  title: "Components/Settings/Manage Apps Panel",
  component: ManageAppsPanel,
  parameters: {
    layout: "fullscreen",
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

export const Loading: Story = {
  args: {
    state: "loading",
  },
};

export const Empty: Story = {
  args: {
    connectedApps: [],
    availableApps: [],
  },
};

export const Error: Story = {
  args: {
    state: "error",
  },
};

export const InContainer: Story = {
  render: (args) => (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-background">
      <ManageAppsPanel {...args} />
    </div>
  ),
};
