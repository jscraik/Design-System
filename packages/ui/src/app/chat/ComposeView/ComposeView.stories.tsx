import type { Meta, StoryObj } from "@storybook/react-vite";

import { sampleComposeModes, sampleModels } from "../../../fixtures/sample-data";

import { ComposeView } from "./ComposeView";

const meta: Meta<typeof ComposeView> = {
  title: "Components/Chat/Compose View",
  component: ComposeView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="h-screen bg-background">
      <ComposeView models={sampleModels} modes={sampleComposeModes} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ComposeView>;

export const Default: Story = {};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Framed: Story = {
  render: () => (
    <div className="h-screen bg-background p-6">
      <div className="h-full rounded-2xl border border-muted dark:border-foreground/10 overflow-hidden">
        <ComposeView models={sampleModels} modes={sampleComposeModes} />
      </div>
    </div>
  ),
};
