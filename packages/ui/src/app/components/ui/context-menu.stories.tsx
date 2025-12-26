import type { Meta, StoryObj } from "@storybook/react-vite";

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
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => (
    <ContextMenu open onOpenChange={() => {}}>
      <ContextMenuTrigger className="flex h-24 w-56 items-center justify-center rounded-md border text-sm">
        Right click area
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem>New file</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show hidden files
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
