import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/UI/Base/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => <Skeleton className="h-5 w-40 max-w-full" data-testid="skeleton-default" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.step("Skeleton appears in document", () => {
      expect(canvas.getByTestId("skeleton-default")).toBeInTheDocument();
    });
  },
};

export const Card: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ),
};

