import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { ArchivedChatsPanel } from "./ArchivedChatsPanel";

/**
 * ArchivedChatsPanel displays archived chat conversations organized by time period.
 * Includes search functionality and navigation to individual archived chats.
 *
 * ## Usage
 * ```tsx
 * import { ArchivedChatsPanel } from "@chatui/ui";
 *
 * <ArchivedChatsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof ArchivedChatsPanel> = {
  title: "Settings/ArchivedChatsPanel",
  component: ArchivedChatsPanel,
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
type Story = StoryObj<typeof ArchivedChatsPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto bg-[var(--foundation-bg-dark-1)] rounded-lg overflow-hidden">
      <ArchivedChatsPanel {...args} />
    </div>
  ),
};
