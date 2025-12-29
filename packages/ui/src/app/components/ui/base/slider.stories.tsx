import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => <Slider className="w-64" defaultValue={[50]} />,
};

export const Range: Story = {
  render: () => <Slider className="w-64" defaultValue={[25, 75]} />,
};
