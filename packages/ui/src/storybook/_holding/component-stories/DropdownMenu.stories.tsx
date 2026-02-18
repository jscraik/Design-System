import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Button } from "../../base/Button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./fallback/DropdownMenu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/UI/Overlays/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the menu is open by default",
    },
  },
  args: {
    defaultOpen: false,
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: (args) => (
    <DropdownMenu defaultOpen={args.defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Profile</DropdownMenuLabel>
        <DropdownMenuItem>View profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Enable notifications</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /open menu/i });
    await userEvent.click(trigger);
    const overlay = within(canvasElement.ownerDocument.body);
    await expect(overlay.getByRole("menuitem", { name: "View profile" })).toBeVisible();
  },
};
