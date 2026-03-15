import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
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

// ─── Interaction tests ────────────────────────────────────────────────────────

export const OpenMenuByClick: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8 bg-background min-h-[400px]">
        <AttachmentMenu
          open={open}
          onOpenChange={setOpen}
          isWebSearchActive={false}
          onAttachmentAction={() => {}}
          onMoreAction={() => {}}
          onWebSearchToggle={() => {}}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Menu is closed on mount", () => {
      // The popover content should not be visible initially
      expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
    });

    await userEvent.step("Click trigger button to open", async () => {
      // The AttachmentMenu uses a + / paperclip trigger button
      const trigger = canvas.getByRole("button");
      await userEvent.click(trigger);
    });

    await userEvent.step("Popover content is now visible", async () => {
      // Radix Popover renders in a portal — query the full document body
      const body = within(canvasElement.ownerDocument.body);
      // Wait for the popover to appear; content is in a portal
      await expect(body.findByRole("menu")).resolves.toBeInTheDocument();
    });
  },
};

export const MenuClosedByDefault: Story = {
  args: {
    open: false,
    isWebSearchActive: false,
  },
  render: (args) => (
    <div className="p-8 bg-background">
      <AttachmentMenu {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("No menu visible on mount", () => {
      expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
    });

    await userEvent.step("Trigger button is present and accessible", () => {
      const button = canvas.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  },
};

