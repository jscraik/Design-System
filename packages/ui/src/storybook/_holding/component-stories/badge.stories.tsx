import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Badge } from "@design-studio/ui";

const meta: Meta<typeof Badge> = {
  title: "Components/UI/Base/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: () => <Badge>New</Badge>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.step("Badge renders its text", () => {
      expect(canvas.getByText("New")).toBeInTheDocument();
    });
  },
};

export const Secondary: Story = {
  render: () => <Badge variant="secondary">Pro</Badge>,
};

