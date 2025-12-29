import type { Meta, StoryObj } from "@storybook/react-vite";

import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: () => <Progress className="w-64" value={45} />,
};

export const Complete: Story = {
  render: () => <Progress className="w-64" value={100} />,
};
