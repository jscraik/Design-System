import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./fallback/Badge";

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
};

export const Secondary: Story = {
  render: () => <Badge variant="secondary">Pro</Badge>,
};
