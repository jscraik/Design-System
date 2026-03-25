import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { SecurityPanel } from "./SecurityPanel";

/**
 * SecurityPanel provides security-related settings.
 * Includes multi-factor authentication toggle and related security options.
 *
 * ## Usage
 * ```tsx
 * import { SecurityPanel } from "@design-studio/ui";
 *
 * <SecurityPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof SecurityPanel> = {
  title: "Components/Settings/Security Panel",
  component: SecurityPanel,
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
type Story = StoryObj<typeof SecurityPanel>;

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
      <SecurityPanel {...args} />
    </div>
  ),
};
