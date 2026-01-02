import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { DataControlsPanel } from "./DataControlsPanel";

/**
 * DataControlsPanel provides data privacy and management controls.
 * Includes toggles for model training, voice recordings, and actions for archiving/deleting data.
 *
 * ## Usage
 * ```tsx
 * import { DataControlsPanel } from "@chatui/ui";
 *
 * <DataControlsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof DataControlsPanel> = {
  title: "Components/Settings/Data Controls Panel",
  component: DataControlsPanel,
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
type Story = StoryObj<typeof DataControlsPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto bg-foundation-bg-dark-1 rounded-lg overflow-hidden">
      <DataControlsPanel {...args} />
    </div>
  ),
};
