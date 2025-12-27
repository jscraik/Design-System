import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconPickerModal } from "./IconPickerModal";

const meta: Meta<typeof IconPickerModal> = {
  title: "ChatUI/IconPickerModal",
  component: IconPickerModal,
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="h-screen bg-[var(--foundation-bg-dark-1)]">
      <IconPickerModal {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof IconPickerModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSave: () => {},
    currentColor: "text-[var(--foundation-accent-blue)]",
    projectName: "Apps SDK Designer",
  },
};
