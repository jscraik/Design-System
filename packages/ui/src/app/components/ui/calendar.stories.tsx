import type { Meta, StoryObj } from "@storybook/react-vite";

import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => (
    <Calendar
      mode="single"
      selected={new Date()}
      className="rounded-md border"
    />
  ),
};

export const Range: Story = {
  render: () => (
    <Calendar
      mode="range"
      selected={{
        from: new Date(new Date().getFullYear(), 0, 10),
        to: new Date(new Date().getFullYear(), 0, 16),
      }}
      className="rounded-md border"
    />
  ),
};
