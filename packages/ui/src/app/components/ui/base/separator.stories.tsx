import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: () => (
    <div className="flex w-64 items-center gap-3 text-sm">
      <span>Left</span>
      <Separator className="flex-1" />
      <span>Right</span>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center gap-3 text-sm">
      <span>Top</span>
      <Separator orientation="vertical" className="h-6" />
      <span>Bottom</span>
    </div>
  ),
};
