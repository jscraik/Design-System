import type { Meta, StoryObj } from "@storybook/react-vite";
import * as RechartsPrimitive from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";

const meta: Meta<typeof ChartContainer> = {
  title: "UI/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ChartContainer>;

const chartData = [
  { day: "Mon", visits: 120 },
  { day: "Tue", visits: 220 },
  { day: "Wed", visits: 180 },
  { day: "Thu", visits: 260 },
  { day: "Fri", visits: 140 },
];

const chartConfig = {
  visits: {
    label: "Visits",
    color: "var(--foundation-accent-green)",
  },
};

export const Default: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[220px] w-[360px]">
      <RechartsPrimitive.BarChart data={chartData} margin={{ left: 8, right: 8 }}>
        <RechartsPrimitive.CartesianGrid vertical={false} />
        <RechartsPrimitive.XAxis dataKey="day" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <RechartsPrimitive.Bar dataKey="visits" fill="var(--color-visits)" radius={[4, 4, 0, 0]} />
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  ),
};
