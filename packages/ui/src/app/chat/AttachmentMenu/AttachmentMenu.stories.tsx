import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { AttachmentMenu } from "./AttachmentMenu";

const meta: Meta<typeof AttachmentMenu> = {
  title: "Components/Chat/Attachment Menu",
  component: AttachmentMenu,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#212121" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the menu is open",
    },
    isWebSearchActive: {
      control: "boolean",
      description: "Whether web search is currently active",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story with state management
export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [isWebSearchActive, setIsWebSearchActive] = useState(false);

    return (
      <div className="p-8 bg-background min-h-[400px]">
        <AttachmentMenu
          {...args}
          open={open}
          onOpenChange={setOpen}
          isWebSearchActive={isWebSearchActive}
          onWebSearchToggle={() => setIsWebSearchActive(!isWebSearchActive)}
          onAttachmentAction={(action) => {
            console.log("Attachment action:", action);
          }}
          onMoreAction={(action) => {
            console.log("More action:", action);
          }}
        />
      </div>
    );
  },
};

// Default closed state
export const Default: Story = {
  args: {
    open: false,
    isWebSearchActive: false,
  },
  render: (args) => (
    <div className="p-8 bg-background">
      <AttachmentMenu {...args} />
    </div>
  ),
};

// Open state showing primary menu
export const OpenPrimary: Story = {
  args: {
    open: true,
    isWebSearchActive: false,
  },
  render: (args) => (
    <div className="p-8 bg-background min-h-[400px]">
      <AttachmentMenu {...args} />
    </div>
  ),
};

// With web search active
export const WebSearchActive: Story = {
  args: {
    open: true,
    isWebSearchActive: true,
  },
  render: (args) => (
    <div className="p-8 bg-background min-h-[400px]">
      <AttachmentMenu {...args} />
    </div>
  ),
};
