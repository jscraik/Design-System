import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { SegmentedControl } from "./segmented-control";

const meta: Meta<typeof SegmentedControl> = {
  title: "UI/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<"option1" | "option2" | "option3">("option1");
    return (
      <SegmentedControl
        value={value}
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        onChange={setValue}
      />
    );
  },
};

export const PromptEnhancement: Story = {
  render: () => {
    const [value, setValue] = useState<"rewrite" | "augment" | "preserve">("rewrite");
    return (
      <SegmentedControl
        value={value}
        options={[
          { value: "rewrite", label: "Rewrite" },
          { value: "augment", label: "Augment" },
          { value: "preserve", label: "Preserve" },
        ]}
        onChange={setValue}
      />
    );
  },
};

export const TextFormat: Story = {
  render: () => {
    const [value, setValue] = useState<"text" | "markdown" | "xml" | "json">("text");
    return (
      <SegmentedControl
        value={value}
        options={[
          { value: "text", label: "Text" },
          { value: "markdown", label: "Markdown" },
          { value: "xml", label: "XML" },
          { value: "json", label: "JSON" },
        ]}
        onChange={setValue}
      />
    );
  },
};

export const TwoOptions: Story = {
  render: () => {
    const [value, setValue] = useState<"on" | "off">("on");
    return (
      <SegmentedControl
        value={value}
        options={[
          { value: "on", label: "On" },
          { value: "off", label: "Off" },
        ]}
        onChange={setValue}
      />
    );
  },
};
