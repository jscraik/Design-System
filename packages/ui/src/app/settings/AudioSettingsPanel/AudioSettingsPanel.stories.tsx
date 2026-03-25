import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { AudioSettingsPanel } from "./AudioSettingsPanel";

/**
 * AudioSettingsPanel provides audio-related settings.
 * Currently a placeholder for future audio configuration options.
 *
 * ## Usage
 * ```tsx
 * import { AudioSettingsPanel } from "@design-studio/ui";
 *
 * <AudioSettingsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof AudioSettingsPanel> = {
  title: "Components/Settings/Audio Settings Panel",
  component: AudioSettingsPanel,
  parameters: {
    layout: "fullscreen",
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
    <div className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-background">
      <AudioSettingsPanel {...args} />
    </div>
  ),
};
