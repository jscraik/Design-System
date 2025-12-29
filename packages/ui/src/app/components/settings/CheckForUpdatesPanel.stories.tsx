import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { CheckForUpdatesPanel } from "./CheckForUpdatesPanel";

/**
 * CheckForUpdatesPanel provides update checking functionality.
 * Currently a placeholder for future update management features.
 *
 * ## Usage
 * ```tsx
 * import { CheckForUpdatesPanel } from "@chatui/ui";
 *
 * <CheckForUpdatesPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof CheckForUpdatesPanel> = {
  title: "Settings/CheckForUpdatesPanel",
  component: CheckForUpdatesPanel,
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
type Story = StoryObj<typeof CheckForUpdatesPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto bg-[var(--foundation-bg-dark-1)] rounded-lg overflow-hidden">
      <CheckForUpdatesPanel {...args} />
    </div>
  ),
};
