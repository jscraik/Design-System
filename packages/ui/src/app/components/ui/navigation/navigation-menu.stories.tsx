import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./navigation-menu";

const meta: Meta<typeof NavigationMenu> = {
  title: "UI/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  render: () => (
    <NavigationMenu className="w-[480px]">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-2 text-sm">
              <li>
                <NavigationMenuLink href="#">Introduction</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Installation</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-2 text-sm">
              <li>
                <NavigationMenuLink href="#">Buttons</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Forms</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Documentation</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /getting started/i });
    await userEvent.click(trigger);

    const menu = within(canvasElement.ownerDocument.body);
    await expect(menu.getByText("Introduction")).toBeInTheDocument();
  },
};
