import type { Meta, StoryObj } from "@storybook/react-vite";

import { ModelBadge } from "./ModelBadge";

const meta: Meta<typeof ModelBadge> = {
  title: "Components/UI/Navigation/Model Badge",
  component: ModelBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["blue", "green", "orange", "default"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "GPT-4",
  },
};

export const Blue: Story = {
  args: {
    name: "GPT-4",
    variant: "blue",
  },
};

export const Green: Story = {
  args: {
    name: "Claude",
    variant: "green",
  },
};

export const Orange: Story = {
  args: {
    name: "Gemini",
    variant: "orange",
  },
};

export const LongName: Story = {
  args: {
    name: "GPT-4-Turbo-Preview",
    variant: "blue",
  },
};

export const ShortName: Story = {
  args: {
    name: "o1",
    variant: "green",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ModelBadge name="GPT-4" variant="blue" />
      <ModelBadge name="Claude" variant="green" />
      <ModelBadge name="Gemini" variant="orange" />
      <ModelBadge name="Default" variant="default" />
    </div>
  ),
};
