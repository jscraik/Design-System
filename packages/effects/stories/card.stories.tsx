import type { Meta, StoryObj } from "@storybook/react";

import { HoloCard } from "../src/components/card";

const meta: Meta<typeof HoloCard> = {
  title: "Effects/Card/HoloCard",
  component: HoloCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "a11y"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoloCard colors="neon">
      <h3 className="text-lg font-semibold">Holographic Card</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Hover to see the 3D tilt and shimmer effect
      </p>
    </HoloCard>
  ),
};

export const GlassVariant: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-purple-500 to-pink-500">
      <HoloCard variant="glass" colors="aurora">
        <h3 className="text-lg font-semibold">Glass Effect</h3>
        <p className="text-sm">Backdrop blur with noise texture</p>
      </HoloCard>
    </div>
  ),
};

export const ColorPresets: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <HoloCard colors="neon">
        <h3 className="font-semibold">Neon</h3>
      </HoloCard>
      <HoloCard colors="ocean">
        <h3 className="font-semibold">Ocean</h3>
      </HoloCard>
      <HoloCard colors="sunset">
        <h3 className="font-semibold">Sunset</h3>
      </HoloCard>
      <HoloCard colors="aurora">
        <h3 className="font-semibold">Aurora</h3>
      </HoloCard>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <HoloCard size="sm" colors="neon">
        <h4 className="font-medium">Small Card</h4>
      </HoloCard>
      <HoloCard size="default" colors="ocean">
        <h4 className="font-medium">Default Card</h4>
      </HoloCard>
      <HoloCard size="lg" colors="sunset">
        <h4 className="font-medium text-lg">Large Card</h4>
      </HoloCard>
    </div>
  ),
};

export const NoTilt: Story = {
  render: () => (
    <HoloCard disableTilt colors="neon">
      <h3 className="text-lg font-semibold">No 3D Tilt</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Shimmer effect only</p>
    </HoloCard>
  ),
};

export const Interactive: Story = {
  render: () => (
    <HoloCard colors="neon" hoverScale={1.05} onClick={() => console.log("Card clicked")}>
      <h3 className="text-lg font-semibold">Clickable Card</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">With enhanced scale effect</p>
    </HoloCard>
  ),
};
