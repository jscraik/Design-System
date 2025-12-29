import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../base/button";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <div className="flex h-[140px] w-[240px] items-center justify-center">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button size="sm">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Helpful tooltip text</TooltipContent>
      </Tooltip>
    </div>
  ),
};
