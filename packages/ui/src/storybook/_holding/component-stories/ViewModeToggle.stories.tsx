import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ViewModeToggle } from "./ViewModeToggle";

const meta: Meta<typeof ViewModeToggle> = {
  title: "Components/UI/Navigation/View Mode Toggle",
  component: ViewModeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [mode, setMode] = useState<"chat" | "compose">("chat");
    return <ViewModeToggle value={mode} onChange={setMode} />;
  },
};

export const ComposeSelected: Story = {
  args: {
    value: "compose",
  },
};

export const CustomLabels: Story = {
  args: {
    labels: { chat: "Chat", compose: "Compose" },
  },
  render: (args) => {
    const [mode, setMode] = useState<"chat" | "compose">("compose");
    return <ViewModeToggle {...args} value={mode} onChange={setMode} />;
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "chat",
  },
};
