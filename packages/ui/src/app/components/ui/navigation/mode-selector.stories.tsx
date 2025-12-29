import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ModeSelector } from "./mode-selector";

const meta: Meta<typeof ModeSelector> = {
  title: "UI/ModeSelector",
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
        <div className="text-center text-white/80">
          Current mode: <span className="font-medium text-white">{mode}</span>
        </div>
      </div>
    );
  },
};
