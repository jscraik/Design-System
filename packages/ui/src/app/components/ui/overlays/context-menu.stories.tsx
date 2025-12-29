import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "@storybook/test";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "UI/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => (
    <ContextMenu open onOpenChange={fn()}>
      <ContextMenuTrigger className="flex h-24 w-56 items-center justify-center rounded-md border text-sm">
        Right click area
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem>New file</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show hidden files</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvasElement }) => {
    const menu = within(canvasElement.ownerDocument.body);
    await expect(menu.getByText("Actions")).toBeInTheDocument();

    const checkbox = menu.getByRole("menuitemcheckbox", { name: /show hidden files/i });
    await userEvent.click(checkbox);
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
  },
};
