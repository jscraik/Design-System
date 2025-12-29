import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./menubar";

const meta: Meta<typeof Menubar> = {
  title: "UI/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem>
            Open…<MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Close</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("menuitem", { name: /file/i });
    await userEvent.click(trigger);

    const menu = within(canvasElement.ownerDocument.body);
    await expect(menu.getByText("New Tab")).toBeInTheDocument();
  },
};
