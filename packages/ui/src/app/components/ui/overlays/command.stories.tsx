import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

const meta: Meta<typeof Command> = {
  title: "UI/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command className="w-[320px] rounded-md border">
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          <CommandItem>New chat</CommandItem>
          <CommandItem>Open settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem>
            Templates
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Projects
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox");
    await userEvent.type(input, "Open settings");

    await expect(canvas.getByText("Open settings")).toBeInTheDocument();
  },
};
