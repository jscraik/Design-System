import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { RangeSlider } from "./range-slider";

const meta: Meta<typeof RangeSlider> = {
  title: "UI/RangeSlider",
  component: RangeSlider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div className="w-80">
        <RangeSlider value={value} onChange={setValue} />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState(60);
    return (
      <div className="w-80">
        <RangeSlider
          label="Target Size"
          value={value}
          onChange={setValue}
          min={20}
          max={100}
          suffix="k"
        />
      </div>
    );
  },
};

export const CustomRange: Story = {
  render: () => {
    const [value, setValue] = useState(75);
    return (
      <div className="w-80">
        <RangeSlider
          label="Volume"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          suffix="%"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div className="w-80">
        <RangeSlider
          label="Disabled Slider"
          value={value}
          onChange={setValue}
          disabled={true}
          suffix="%"
        />
      </div>
    );
  },
};
