import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import { Button } from "../../base/Button";

import { Tooltip, TooltipContent, TooltipTrigger } from "./fallback/Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/UI/Overlays/Tooltip",
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
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const tooltips = body.getAllByText("Helpful tooltip text");
    await expect(tooltips.length).toBeGreaterThan(0);
  },
};
