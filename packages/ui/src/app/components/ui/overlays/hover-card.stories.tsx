import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta: Meta<typeof HoverCard> = {
  title: "UI/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <div className="flex h-[180px] w-[260px] items-center justify-center">
      <HoverCard defaultOpen>
        <HoverCardTrigger asChild>
          <a className="text-sm underline" href="#">
            Hover profile
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="text-sm font-medium">ChatUI Team</div>
          <div className="text-muted-foreground text-xs">Building thoughtful chat experiences.</div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByText("ChatUI Team")).toBeInTheDocument();
  },
};
