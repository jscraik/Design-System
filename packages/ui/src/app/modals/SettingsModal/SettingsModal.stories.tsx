import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useState } from "react";

import { SettingsModal } from "./SettingsModal";

const meta: Meta<typeof SettingsModal> = {
  title: "Components/Modals/Settings Modal",
  component: SettingsModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="h-screen bg-[var(--background)]">
      <SettingsModal {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof SettingsModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="h-screen bg-[var(--background)] flex items-center justify-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-lg transition-colors"
        >
          Open Settings
        </button>
        <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    );
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: fn(),
  },
};

export const ColorPaletteCompliant: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "This modal uses the official ChatGPT color palette with solid hex colors instead of opacity-based colors. All text, icons, and backgrounds use CSS custom properties from the foundation tokens.",
      },
    },
  },
};
