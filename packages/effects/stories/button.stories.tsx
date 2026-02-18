import type { Meta, StoryObj } from "@storybook/react";

import { MagneticButton } from "../src/components/button";

const meta: Meta<typeof MagneticButton> = {
  title: "Effects/Button/MagneticButton",
  component: MagneticButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "a11y"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <MagneticButton ariaLabel="Example magnetic button">Hover Me</MagneticButton>,
};

export const Outline: Story = {
  render: () => (
    <MagneticButton variant="outline" ariaLabel="Example magnetic button">
      Outline Style
    </MagneticButton>
  ),
};

export const Ghost: Story = {
  render: () => (
    <MagneticButton variant="ghost" ariaLabel="Example magnetic button">
      Ghost Style
    </MagneticButton>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <MagneticButton size="sm" ariaLabel="Small button">
        Small
      </MagneticButton>
      <MagneticButton size="default" ariaLabel="Default button">
        Default
      </MagneticButton>
      <MagneticButton size="lg" ariaLabel="Large button">
        Large
      </MagneticButton>
    </div>
  ),
};

export const HighStrength: Story = {
  render: () => (
    <MagneticButton magneticStrength={0.5} ariaLabel="Example magnetic button">
      Strong Magnetic
    </MagneticButton>
  ),
};

export const Disabled: Story = {
  render: () => (
    <MagneticButton disabled ariaLabel="Example magnetic button">
      Disabled
    </MagneticButton>
  ),
};

export const NoMagnetic: Story = {
  render: () => (
    <MagneticButton disableMagnetic ariaLabel="Example magnetic button">
      No Magnetic Effect
    </MagneticButton>
  ),
};
