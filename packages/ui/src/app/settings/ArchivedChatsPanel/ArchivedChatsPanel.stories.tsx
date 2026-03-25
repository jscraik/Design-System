import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { ArchivedChatsPanel } from "./ArchivedChatsPanel";

/**
 * ArchivedChatsPanel displays archived chat conversations organized by time period.
 * Includes search functionality and navigation to individual archived chats.
 *
 * ## Usage
 * ```tsx
 * import { ArchivedChatsPanel } from "@design-studio/ui";
 *
 * <ArchivedChatsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof ArchivedChatsPanel> = {
  title: "Components/Settings/Archived Chats Panel",
  component: ArchivedChatsPanel,
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
type Story = StoryObj<typeof ArchivedChatsPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-background">
      <ArchivedChatsPanel {...args} />
    </div>
  ),
};
