import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { NotificationsPanel } from "./NotificationsPanel";

/**
 * NotificationsPanel provides notification preferences for different types of events.
 * Users can configure push, email, and SMS notifications for various categories.
 *
 * ## Usage
 * ```tsx
 * import { NotificationsPanel } from "@design-studio/ui";
 *
 * <NotificationsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof NotificationsPanel> = {
  title: "Components/Settings/Notifications Panel",
  component: NotificationsPanel,
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
type Story = StoryObj<typeof NotificationsPanel>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    state: "loading",
  },
};

export const Empty: Story = {
  args: {
    notificationRows: [],
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
      <NotificationsPanel {...args} />
    </div>
  ),
};
