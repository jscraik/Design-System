import type { Meta, StoryObj } from "@storybook/react-vite";

import { SettingsModal } from "./SettingsModal";

const meta: Meta<typeof SettingsModal> = {
  title: "ChatUI/SettingsModal",
  component: SettingsModal,
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="h-screen bg-[var(--foundation-bg-dark-1)]">
      <SettingsModal {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof SettingsModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};
