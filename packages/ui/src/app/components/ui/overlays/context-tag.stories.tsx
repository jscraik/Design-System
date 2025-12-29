import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";


import { IconCode, IconFolder, IconImage } from "../../../../icons";

import { ContextTag } from "./context-tag";

const meta: Meta<typeof ContextTag> = {
  title: "UI/ContextTag",
  component: ContextTag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClose: { action: "closed" },
    variant: {
      control: { type: "select" },
      options: ["green", "blue", "orange", "red", "default"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Work with Terminal Tab",
    variant: "green",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <IconFolder />,
    label: "main.tsx",
    variant: "green",
  },
};

export const WithCloseButton: Story = {
  args: {
    icon: <IconCode />,
    label: "Active Context",
    variant: "blue",
    onClose: fn(),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ContextTag label="Green variant" variant="green" />
      <ContextTag label="Blue variant" variant="blue" />
      <ContextTag label="Orange variant" variant="orange" />
      <ContextTag label="Red variant" variant="red" />
      <ContextTag label="Default variant" variant="default" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ContextTag
        icon={<IconImage />}
        label="Small size"
        variant="green"
        size="sm"
        onClose={fn()}
      />
      <ContextTag
        icon={<IconImage />}
        label="Medium size"
        variant="green"
        size="md"
        onClose={fn()}
      />
    </div>
  ),
};
