import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { DiscoverySettingsModal } from "./DiscoverySettingsModal";

const meta: Meta<typeof DiscoverySettingsModal> = {
  title: "Components/Modals/Discovery Settings Modal",
  component: DiscoverySettingsModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="h-screen bg-background">
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

export const LightTheme: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
    promptEnhancement: "rewrite",
    onPromptEnhancementChange: fn(),
    targetSize: 60,
    onTargetSizeChange: fn(),
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
