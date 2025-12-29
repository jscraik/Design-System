import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea } from "./scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-40 w-[260px] rounded-md border p-3">
      <div className="space-y-2 text-sm">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="rounded-md bg-muted px-2 py-1">
            Item {index + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
