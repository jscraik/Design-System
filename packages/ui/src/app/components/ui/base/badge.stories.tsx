import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: () => <Badge>New</Badge>,
};

export const Secondary: Story = {
  render: () => <Badge variant="secondary">Pro</Badge>,
};
