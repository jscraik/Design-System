import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";

import { RangeSlider } from "@design-studio/ui";

const meta: Meta<typeof RangeSlider> = {
  title: "Components/UI/Forms/Range Slider",
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("RangeSlider renders correctly", () => {
      // We look for slider roles
      const slider = canvas.getByRole("slider");
      expect(slider).toBeInTheDocument();
    });

    await userEvent.step("Keyboard adjustment works", async () => {
      const slider = canvas.getByRole("slider");
      slider.focus();
      await userEvent.keyboard("[ArrowRight]");
      expect(slider).toHaveAttribute("aria-valuenow", "51");
    });
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
