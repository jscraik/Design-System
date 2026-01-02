import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ModeSelector } from "./ModeSelector";

const meta: Meta<typeof ModeSelector> = {
  title: "Components/UI/Navigation/Mode Selector",
  component: ModeSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [mode, setMode] = useState<"chat" | "canvas">("chat");
    return <ModeSelector mode={mode} onModeChange={setMode} />;
  },
};

export const ChatMode: Story = {
  render: () => {
    const [mode, setMode] = useState<"chat" | "canvas">("chat");
    return <ModeSelector mode={mode} onModeChange={setMode} />;
  },
};

export const CanvasMode: Story = {
  render: () => {
    const [mode, setMode] = useState<"chat" | "canvas">("canvas");
    return <ModeSelector mode={mode} onModeChange={setMode} />;
  },
};

export const Interactive: Story = {
  render: () => {
    const [mode, setMode] = useState<"chat" | "canvas">("chat");
    return (
      <div className="space-y-4">
        <ModeSelector mode={mode} onModeChange={setMode} />
        <div className="text-center text-foundation-text-dark-secondary">
          Current mode:{" "}
          <span className="font-medium text-foundation-text-dark-primary">{mode}</span>
        </div>
      </div>
    );
  },
};
