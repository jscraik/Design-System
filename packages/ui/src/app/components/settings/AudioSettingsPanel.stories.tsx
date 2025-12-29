import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { AudioSettingsPanel } from "./AudioSettingsPanel";

/**
 * AudioSettingsPanel provides audio-related settings.
 * Currently a placeholder for future audio configuration options.
 *
 * ## Usage
 * ```tsx
 * import { AudioSettingsPanel } from "@chatui/ui";
 *
 * <AudioSettingsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof AudioSettingsPanel> = {
  title: "Settings/AudioSettingsPanel",
  component: AudioSettingsPanel,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onBack: {
      description: "Callback when back button is clicked",
    },
  },
  args: {
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AudioSettingsPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto bg-[var(--foundation-bg-dark-1)] rounded-lg overflow-hidden">
      <AudioSettingsPanel {...args} />
    </div>
  ),
};
