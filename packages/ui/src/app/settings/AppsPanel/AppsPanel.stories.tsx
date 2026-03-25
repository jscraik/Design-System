import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { AppsPanel } from "./AppsPanel";

/**
 * AppsPanel displays enabled apps and provides access to browse all available apps.
 * Shows app icons, names, and navigation to individual app settings.
 *
 * ## Usage
 * ```tsx
 * import { AppsPanel } from "@design-studio/ui";
 *
 * <AppsPanel onBack={fn()} />
 * ```
 */
const meta: Meta<typeof AppsPanel> = {
  title: "Components/Settings/Apps Panel",
  component: AppsPanel,
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
type Story = StoryObj<typeof AppsPanel>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    state: "loading",
  },
};

export const Empty: Story = {
  args: {
    enabledApps: [],
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
      <AppsPanel {...args} />
    </div>
  ),
};
