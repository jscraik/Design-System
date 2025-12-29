import type { Meta, StoryObj } from "@storybook/react-vite";

import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

const referenceDate = new Date(Date.UTC(2024, 0, 15, 12));
const rangeStart = new Date(Date.UTC(2024, 0, 10, 12));
const rangeEnd = new Date(Date.UTC(2024, 0, 16, 12));

export const Default: Story = {
  render: () => (
    <Calendar mode="single" selected={referenceDate} className="rounded-md border" />
  ),
};

export const Range: Story = {
  render: () => (
    <Calendar
      mode="range"
      selected={{
        from: rangeStart,
        to: rangeEnd,
      }}
      className="rounded-md border"
    />
  ),
};
