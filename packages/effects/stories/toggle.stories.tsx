import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { LiquidToggle } from "./liquid-toggle";

const meta: Meta<typeof LiquidToggle> = {
  title: "Effects/Toggle/LiquidToggle",
  component: LiquidToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "a11y"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [pressed, setPressed] = useState(false);
    return (
      <LiquidToggle
        pressed={pressed}
        onPressedChange={setPressed}
        ariaLabel="Example liquid toggle"
      >
        Toggle Me
      </LiquidToggle>
    );
  },
};

export const Pressed: Story = {
  render: () => {
    const [pressed, setPressed] = useState(true);
    return (
      <LiquidToggle
        pressed={pressed}
        onPressedChange={setPressed}
        ariaLabel="Example liquid toggle"
      >
        Active
      </LiquidToggle>
    );
  },
};

export const Outline: Story = {
  render: () => {
    const [pressed, setPressed] = useState(false);
    return (
      <LiquidToggle
        pressed={pressed}
        onPressedChange={setPressed}
        variant="outline"
        ariaLabel="Example liquid toggle"
      >
        Outline Style
      </LiquidToggle>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [pressed1, setPressed1] = useState(false);
    const [pressed2, setPressed2] = useState(false);
    const [pressed3, setPressed3] = useState(false);
    return (
      <div className="flex items-center gap-4">
        <LiquidToggle
          pressed={pressed1}
          onPressedChange={setPressed1}
          size="sm"
          ariaLabel="Small toggle"
        >
          Small
        </LiquidToggle>
        <LiquidToggle
          pressed={pressed2}
          onPressedChange={setPressed2}
          size="default"
          ariaLabel="Default toggle"
        >
          Default
        </LiquidToggle>
        <LiquidToggle
          pressed={pressed3}
          onPressedChange={setPressed3}
          size="lg"
          ariaLabel="Large toggle"
        >
          Large
        </LiquidToggle>
      </div>
    );
  },
};

export const NoLiquid: Story = {
  render: () => {
    const [pressed, setPressed] = useState(false);
    return (
      <LiquidToggle
        pressed={pressed}
        onPressedChange={setPressed}
        liquid="none"
        ariaLabel="Example liquid toggle"
      >
        No Effect
      </LiquidToggle>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [pressed, setPressed] = useState(false);
    return (
      <LiquidToggle
        pressed={pressed}
        onPressedChange={setPressed}
        disabled
        ariaLabel="Example liquid toggle"
      >
        Disabled
      </LiquidToggle>
    );
  },
};
