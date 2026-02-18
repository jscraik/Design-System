import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Button } from "../../base/Button";

import { Popover, PopoverContent, PopoverTrigger } from "./fallback/Popover";

const meta: Meta<typeof Popover> = {
  title: "Components/UI/Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <div className="flex h-[200px] w-[260px] items-center justify-center">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button size="sm">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="text-sm">Popover content with a little context.</PopoverContent>
      </Popover>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByText("Popover content with a little context.")).toBeInTheDocument();
  },
};

export const KeyboardSmoke: Story = {
  render: () => (
    <div className="flex h-[200px] w-[260px] items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="text-sm">Popover content with a little context.</PopoverContent>
      </Popover>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = body.getByRole("button", { name: /open popover/i });

    await userEvent.click(trigger);
    await expect(body.getByText("Popover content with a little context.")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await expect(
      body.queryByText("Popover content with a little context."),
    ).not.toBeInTheDocument();
  },
};
