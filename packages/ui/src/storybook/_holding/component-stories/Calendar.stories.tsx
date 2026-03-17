import { Calendar } from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Calendar> = {
  title: "Components/UI/Base/Calendar",
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
  render: () => <Calendar mode="single" selected={referenceDate} className="rounded-md border" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.step("Calendar renders month view", () => {
      expect(canvas.getByRole("button", { name: /previous month/i })).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: /next month/i })).toBeInTheDocument();
    });
  },
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
