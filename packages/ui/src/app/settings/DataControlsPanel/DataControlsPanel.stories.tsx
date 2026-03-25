import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { DataControlsPanel } from "./DataControlsPanel";

/**
 * DataControlsPanel provides data privacy and management controls.
 * Includes toggles for model training, voice recordings, and actions for archiving/deleting data.
 *
 * ## Usage
 * ```tsx
 * import { DataControlsPanel } from "@design-studio/ui";
 *
 * <DataControlsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof DataControlsPanel> = {
  title: "Components/Settings/Data Controls Panel",
  component: DataControlsPanel,
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
type Story = StoryObj<typeof DataControlsPanel>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    state: "loading",
  },
};

export const Busy: Story = {
  args: {
    busy: true,
  },
};

export const Error: Story = {
  args: {
    state: "error",
  },
};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto bg-background rounded-lg overflow-hidden">
      <DataControlsPanel {...args} />
    </div>
  ),
};
