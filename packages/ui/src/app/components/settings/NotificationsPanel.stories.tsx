import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { NotificationsPanel } from "./NotificationsPanel";

/**
 * NotificationsPanel provides notification preferences for different types of events.
 * Users can configure push, email, and SMS notifications for various categories.
 *
 * ## Usage
 * ```tsx
 * import { NotificationsPanel } from "@chatui/ui";
 *
 * <NotificationsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof NotificationsPanel> = {
  title: "Settings/NotificationsPanel",
  component: NotificationsPanel,
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
type Story = StoryObj<typeof NotificationsPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto bg-[var(--foundation-bg-dark-1)] rounded-lg overflow-hidden">
      <NotificationsPanel {...args} />
    </div>
  ),
};
