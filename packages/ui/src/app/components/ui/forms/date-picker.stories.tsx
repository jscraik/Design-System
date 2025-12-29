import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";

import { DatePicker, DateRangePicker } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "UI/Forms/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text when no date is selected",
    },
    disabled: {
      control: "boolean",
      description: "Disable the date picker",
    },
  },
  args: {
    placeholder: "Pick a date",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const referenceDate = new Date(Date.UTC(2024, 0, 15, 12));
const minRangeDate = new Date(Date.UTC(2024, 0, 1, 12));
const maxRangeDate = new Date(Date.UTC(2024, 1, 1, 12));
const nextWeekDate = new Date(Date.UTC(2024, 0, 22, 12));

export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>();
    return <DatePicker value={date} onValueChange={setDate} {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /pick a date/i });
    await userEvent.click(trigger);
    const doc = canvasElement.ownerDocument;
    const overlay = within(doc.body);
    await userEvent.click(overlay.getByRole("button", { name: "15" }));
    await expect(trigger).toHaveTextContent("January 15, 2024");
  },
};

export const WithPreselectedDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(referenceDate);
    return <DatePicker value={date} onValueChange={setDate} />;
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(referenceDate);
    return <DatePicker value={date} onValueChange={setDate} disabled />;
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <DatePicker value={date} onValueChange={setDate} placeholder="Select your birthday..." />
    );
  },
};

export const WithMinDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="space-y-2">
        <DatePicker
          value={date}
          onValueChange={setDate}
          minDate={referenceDate}
          placeholder="Select future date..."
        />
        <p className="text-sm text-foundation-text-dark-tertiary">
          Only future dates can be selected
        </p>
      </div>
    );
  },
};

export const WithMaxDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="space-y-2">
        <DatePicker
          value={date}
          onValueChange={setDate}
          maxDate={referenceDate}
          placeholder="Select past date..."
        />
        <p className="text-sm text-foundation-text-dark-tertiary">
          Only past dates can be selected
        </p>
      </div>
    );
  },
};

export const WithDateRange: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="space-y-2">
        <DatePicker
          value={date}
          onValueChange={setDate}
          minDate={minRangeDate}
          maxDate={maxRangeDate}
          placeholder="Select date within range..."
        />
        <p className="text-sm text-foundation-text-dark-tertiary">
          Only dates within ±30 days can be selected
        </p>
      </div>
    );
  },
};

export const CustomFormat: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(referenceDate);
    return (
      <DatePicker
        value={date}
        onValueChange={setDate}
        formatDate={(d) =>
          d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
        }
      />
    );
  },
};

export const ISOFormat: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(referenceDate);
    return (
      <DatePicker
        value={date}
        onValueChange={setDate}
        formatDate={(d) => d.toISOString().split("T")[0]}
      />
    );
  },
};

// DateRangePicker stories
export const RangePicker: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    return (
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onRangeChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />
    );
  },
};

export const RangePickerWithDates: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | undefined>(referenceDate);
    const [endDate, setEndDate] = useState<Date | undefined>(nextWeekDate);
    return (
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onRangeChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />
    );
  },
};

export const RangePickerDisabled: Story = {
  render: () => {
    return (
      <DateRangePicker
        startDate={referenceDate}
        endDate={nextWeekDate}
        onRangeChange={fn()}
        disabled
      />
    );
  },
};
