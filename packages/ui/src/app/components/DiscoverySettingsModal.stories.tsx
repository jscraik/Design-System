import type { Meta, StoryObj } from "@storybook/react-vite";

import { DiscoverySettingsModal } from "./DiscoverySettingsModal";

const meta: Meta<typeof DiscoverySettingsModal> = {
  title: "ChatUI/DiscoverySettingsModal",
  component: DiscoverySettingsModal,
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
    onClose: () => {},
    promptEnhancement: "rewrite",
    onPromptEnhancementChange: () => {},
    targetSize: 60,
    onTargetSizeChange: () => {},
  },
};
