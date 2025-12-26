import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
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
        <PopoverContent className="text-sm">
          Popover content with a little context.
        </PopoverContent>
      </Popover>
    </div>
  ),
};