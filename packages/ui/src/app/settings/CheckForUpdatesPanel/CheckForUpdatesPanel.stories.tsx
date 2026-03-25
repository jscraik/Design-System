import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { CheckForUpdatesPanel } from "./CheckForUpdatesPanel";

/**
 * CheckForUpdatesPanel provides update checking functionality.
 * Currently a placeholder for future update management features.
 *
 * ## Usage
 * ```tsx
 * import { CheckForUpdatesPanel } from "@design-studio/ui";
 *
 * <CheckForUpdatesPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof CheckForUpdatesPanel> = {
  title: "Components/Settings/Check For Updates Panel",
  component: CheckForUpdatesPanel,
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
type Story = StoryObj<typeof CheckForUpdatesPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-background">
      <CheckForUpdatesPanel {...args} />
    </div>
  ),
};
