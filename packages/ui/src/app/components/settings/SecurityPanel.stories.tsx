import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { SecurityPanel } from "./SecurityPanel";

/**
 * SecurityPanel provides security-related settings.
 * Includes multi-factor authentication toggle and related security options.
 *
 * ## Usage
 * ```tsx
 * import { SecurityPanel } from "@chatui/ui";
 *
 * <SecurityPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof SecurityPanel> = {
  title: "Settings/SecurityPanel",
  component: SecurityPanel,
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
type Story = StoryObj<typeof SecurityPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto bg-[var(--foundation-bg-dark-1)] rounded-lg overflow-hidden">
      <SecurityPanel {...args} />
    </div>
  ),
};
