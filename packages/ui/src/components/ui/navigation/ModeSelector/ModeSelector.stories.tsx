import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { sampleComposeModes } from "../../../../fixtures/sample-data";
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
    const [mode, setMode] = useState(sampleComposeModes[0]);
    return <ModeSelector value={mode} onChange={setMode} modes={sampleComposeModes} />;
  },
};

export const ChatMode: Story = {
  render: () => {
    const [mode, setMode] = useState(sampleComposeModes[0]);
    return <ModeSelector value={mode} onChange={setMode} modes={sampleComposeModes} />;
  },
};

export const CanvasMode: Story = {
  render: () => {
    const [mode, setMode] = useState(sampleComposeModes[2]);
    return <ModeSelector value={mode} onChange={setMode} modes={sampleComposeModes} />;
  },
};

export const Interactive: Story = {
  render: () => {
    const [mode, setMode] = useState(sampleComposeModes[0]);
    return (
      <div className="space-y-4">
        <ModeSelector value={mode} onChange={setMode} modes={sampleComposeModes} showPreview />
        <div className="text-center text-foundation-text-dark-secondary">
          Current mode:{" "}
          <span className="font-medium text-foundation-text-dark-primary">{mode.name}</span>
        </div>
      </div>
    );
  },
};
