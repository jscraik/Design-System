import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionHeader } from "./SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "Components/UI/Base/Section Header",
  component: SectionHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Section Title",
    description: "This is a description of what this section contains.",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Simple Title",
  },
};

export const WithCustomDescription: Story = {
  args: {
    title: "Token Budgets",
    description:
      "Sets the target size for your final prompt. Use 60k for ChatGPT (lite Pro context), higher for CLI/API tools with larger context windows.",
    descriptionClassName:
      "text-[13px] font-normal leading-[18px] text-foundation-text-dark-tertiary mb-4",
  },
};

export const LongTitle: Story = {
  args: {
    title: "This is a Very Long Section Title That Might Wrap",
    description:
      "Even with long titles, the description should still be properly formatted and readable.",
  },
};

export const LongDescription: Story = {
  args: {
    title: "Configuration",
    description:
      "This is a longer description that explains in detail what this section is about and what the user can expect to find here. It provides comprehensive information about the settings and options available.",
  },
};

export const SettingsExample: Story = {
  args: {
    title: "Prompt Enhancement",
    description: "How the agent modifies your instructions after discovery.",
  },
};

export const ClarifyingQuestionsExample: Story = {
  args: {
    title: "Clarifying Questions",
    description:
      "Allow the agent to ask you questions during discovery to better understand your intent.",
    descriptionClassName:
      "text-[13px] font-normal leading-[18px] text-foundation-text-dark-tertiary mb-4",
  },
};
