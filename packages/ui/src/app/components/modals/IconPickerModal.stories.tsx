import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { IconPickerModal } from "./IconPickerModal";

const meta: Meta<typeof IconPickerModal> = {
  title: "ChatUI/IconPickerModal",
  component: IconPickerModal,
  tags: ["autodocs"],
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
    onClose: fn(),
    onSave: fn(),
    currentIconId: "folder",
    currentColorId: "blue",
    projectName: "Apps SDK Designer",
  },
};

export const GreenTheme: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
    onSave: fn(),
    currentIconId: "lightbulb",
    currentColorId: "green",
    projectName: "Ideas Board",
  },
};
