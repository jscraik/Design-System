import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { DiscoverySettingsModal } from "./DiscoverySettingsModal";

const meta: Meta<typeof DiscoverySettingsModal> = {
  title: "ChatUI/DiscoverySettingsModal",
  component: DiscoverySettingsModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="h-screen bg-[var(--foundation-bg-dark-1)]">
      <DiscoverySettingsModal {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof DiscoverySettingsModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
    promptEnhancement: "rewrite",
    onPromptEnhancementChange: fn(),
    targetSize: 60,
    onTargetSizeChange: fn(),
  },
};
