import type { Meta, StoryObj } from "@storybook/react";

import { GlowText, GradientText } from "../src/components/text";

const glowMeta: Meta<typeof GlowText> = {
  title: "Effects/Text/GlowText",
  component: GlowText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "a11y"],
};

export default glowMeta;
type GlowStory = StoryObj<typeof glowMeta>;

export const Default: GlowStory = {
  render: () => <GlowText color="#00f260">Glowing Text</GlowText>,
};

export const Intensities: GlowStory = {
  render: () => (
    <div className="space-y-4">
      <GlowText color="#00f260" intensity="subtle">
        Subtle Glow
      </GlowText>
      <GlowText color="#00f260" intensity="medium">
        Medium Glow
      </GlowText>
      <GlowText color="#00f260" intensity="intense">
        Intense Glow
      </GlowText>
    </div>
  ),
};

export const PulseAnimation: GlowStory = {
  render: () => (
    <GlowText color="#ff0080" animate="pulse">
      Pulsing Glow
    </GlowText>
  ),
};

export const BreatheAnimation: GlowStory = {
  render: () => (
    <GlowText color="#00b4d8" animate="breathe">
      Breathing Glow
    </GlowText>
  ),
};

export const CustomColors: GlowStory = {
  render: () => (
    <div className="space-y-2">
      <GlowText color="#ff0000">Red Glow</GlowText>
      <GlowText color="#00ff00">Green Glow</GlowText>
      <GlowText color="#0000ff">Blue Glow</GlowText>
    </div>
  ),
};

// Gradient Text Stories

const _gradientMeta: Meta<typeof GradientText> = {
  title: "Effects/Text/GradientText",
  component: GradientText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "a11y"],
};

export const GradientDefault: StoryObj<typeof GradientText> = {
  render: () => <GradientText>Gradient Text</GradientText>,
};

export const Presets: StoryObj<typeof GradientText> = {
  render: () => (
    <div className="space-y-4">
      <GradientText preset="sunset">Sunset Gradient</GradientText>
      <GradientText preset="ocean">Ocean Gradient</GradientText>
      <GradientText preset="forest">Forest Gradient</GradientText>
      <GradientText preset="aurora">Aurora Gradient</GradientText>
      <GradientText preset="fire">Fire Gradient</GradientText>
      <GradientText preset="cyber">Cyber Gradient</GradientText>
    </div>
  ),
};

export const Directions: StoryObj<typeof GradientText> = {
  render: () => (
    <div className="space-y-4">
      <GradientText preset="sunset" direction="horizontal">
        Horizontal
      </GradientText>
      <GradientText preset="ocean" direction="vertical">
        Vertical
      </GradientText>
      <GradientText preset="forest" direction="diagonal">
        Diagonal
      </GradientText>
    </div>
  ),
};

export const FlowAnimation: StoryObj<typeof GradientText> = {
  render: () => (
    <GradientText preset="sunset" animate="flow">
      Flowing Gradient
    </GradientText>
  ),
};

export const CustomColors: StoryObj<typeof GradientText> = {
  render: () => (
    <GradientText colors={["#ff0080", "#7928ca", "#ff0080"]}>Custom Gradient</GradientText>
  ),
};
