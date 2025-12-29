import type { Meta, StoryObj } from "@storybook/react-vite";

import { AspectRatio } from "./aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-md">
        <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-48">
      <AspectRatio ratio={1} className="bg-muted overflow-hidden rounded-md">
        <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
          1:1
        </div>
      </AspectRatio>
    </div>
  ),
};
