import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { PersonalizationPanel } from "./PersonalizationPanel";

/**
 * PersonalizationPanel provides settings for customizing ChatGPT's behavior and style.
 * Includes base style selection, characteristics tuning, and advanced feature toggles.
 *
 * ## Usage
 * ```tsx
 * import { PersonalizationPanel } from "@chatui/ui";
 *
 * <PersonalizationPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof PersonalizationPanel> = {
  title: "Settings/PersonalizationPanel",
  component: PersonalizationPanel,
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
type Story = StoryObj<typeof PersonalizationPanel>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto bg-[var(--foundation-bg-dark-1)] rounded-lg overflow-hidden">
      <PersonalizationPanel {...args} />
    </div>
  ),
};
