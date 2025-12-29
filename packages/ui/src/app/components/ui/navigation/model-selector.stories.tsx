import type { Meta, StoryObj } from "@storybook/react-vite";

import { ModelSelector } from "./model-selector";

const meta: Meta<typeof ModelSelector> = {
  title: "UI/ModelSelector",
  component: ModelSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleModels = [
  { name: "GPT-4o", shortName: "4o", description: "Fast and efficient" },
  { name: "GPT-4", shortName: "4", description: "Most capable" },
  { name: "GPT-3.5 Turbo", shortName: "3.5", description: "Quick responses" },
];

const legacyModels = [
  { name: "GPT-3", shortName: "3", description: "Legacy model", isLegacy: true },
  { name: "GPT-2", shortName: "2", description: "Older model", isLegacy: true },
];

export const Default: Story = {
  args: {
    value: "GPT-4o",
    models: sampleModels,
    label: "ChatGPT",
  },
};

export const WithLegacyModels: Story = {
  args: {
    value: "GPT-4o",
    models: sampleModels,
    legacyModels: legacyModels,
    label: "ChatGPT",
  },
};

export const NoLabel: Story = {
  args: {
    value: "GPT-4o",
    models: sampleModels,
    label: "",
  },
};

export const Disabled: Story = {
  args: {
    value: "GPT-4o",
    models: sampleModels,
    label: "ChatGPT",
    disabled: true,
  },
};
