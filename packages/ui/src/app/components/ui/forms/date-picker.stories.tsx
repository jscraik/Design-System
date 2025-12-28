import type { Meta, StoryObj } from "@storybook/react";
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

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return <DatePicker value={date} onValueChange={setDate} />;
  },
};

export const WithPreselectedDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <DatePicker value={date} onValueChange={setDate} />;
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
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
    const today = new Date();
    return (
      <div className="space-y-2">
        <DatePicker
          value={date}
          onValueChange={setDate}
          minDate={today}
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
    const today = new Date();
    return (
      <div className="space-y-2">
        <DatePicker
          value={date}
          onValueChange={setDate}
          maxDate={today}
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
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 30);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return (
      <div className="space-y-2">
        <DatePicker
          value={date}
          onValueChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
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
    const [date, setDate] = useState<Date | undefined>(new Date());
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
    const [date, setDate] = useState<Date | undefined>(new Date());
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
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const [startDate, setStartDate] = useState<Date | undefined>(today);
    const [endDate, setEndDate] = useState<Date | undefined>(nextWeek);
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
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return (
      <DateRangePicker startDate={today} endDate={nextWeek} onRangeChange={() => {}} disabled />
    );
  },
};
