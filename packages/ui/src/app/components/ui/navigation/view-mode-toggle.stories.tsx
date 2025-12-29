import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ViewModeToggle } from "./view-mode-toggle";

const meta: Meta<typeof ViewModeToggle> = {
  title: "UI/ViewModeToggle",
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
    const [isFullWidth, setIsFullWidth] = useState(false);
    return (
      <ViewModeToggle isFullWidth={isFullWidth} onToggle={() => setIsFullWidth(!isFullWidth)} />
    );
  },
};

export const NormalWidth: Story = {
  render: () => {
    const [isFullWidth, setIsFullWidth] = useState(false);
    return (
      <div className="space-y-4">
        <ViewModeToggle isFullWidth={isFullWidth} onToggle={() => setIsFullWidth(!isFullWidth)} />
        <div className="text-center text-white/80">
          Mode:{" "}
          <span className="font-medium text-white">
            {isFullWidth ? "Full Width" : "Normal Width"}
          </span>
        </div>
      </div>
    );
  },
};

export const FullWidth: Story = {
  render: () => {
    const [isFullWidth, setIsFullWidth] = useState(true);
    return (
      <div className="space-y-4">
        <ViewModeToggle isFullWidth={isFullWidth} onToggle={() => setIsFullWidth(!isFullWidth)} />
        <div className="text-center text-white/80">
          Mode:{" "}
          <span className="font-medium text-white">
            {isFullWidth ? "Full Width" : "Normal Width"}
          </span>
        </div>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [isFullWidth, setIsFullWidth] = useState(false);
    return (
      <div className="space-y-6">
        <ViewModeToggle isFullWidth={isFullWidth} onToggle={() => setIsFullWidth(!isFullWidth)} />
        <div className="p-4 border border-white/10 rounded-lg">
          <div className="text-white/80 mb-2">Current view mode:</div>
          <div className="font-medium text-white">
            {isFullWidth ? "Full Width View" : "Normal Width View"}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {isFullWidth
              ? "Content spans the full width of the container"
              : "Content is constrained to a comfortable reading width"}
          </div>
        </div>
      </div>
    );
  },
};
