import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Toggle checked={checked} onChange={setChecked} ariaLabel="Example toggle" />;
  },
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return <Toggle checked={checked} onChange={setChecked} ariaLabel="Example toggle" />;
  },
};

export const Disabled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Toggle checked={checked} onChange={setChecked} disabled={true} ariaLabel="Example toggle" />
    );
  },
};

export const DisabledChecked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Toggle checked={checked} onChange={setChecked} disabled={true} ariaLabel="Example toggle" />
    );
  },
};
