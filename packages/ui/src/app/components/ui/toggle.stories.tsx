import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: () => <Toggle aria-label="Toggle bold">Bold</Toggle>,
};

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic">
      Italic
    </Toggle>
  ),
};
