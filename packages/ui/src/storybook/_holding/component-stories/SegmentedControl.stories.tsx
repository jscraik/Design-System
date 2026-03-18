import { SegmentedControl } from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";

const meta: Meta<typeof SegmentedControl> = {
  title: "Components/UI/Base/Segmented Control",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Display stories ──────────────────────────────────────────────────────────

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

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ClickToSwitch: Story = {
  render: () => {
    const [value, setValue] = useState<"a" | "b" | "c">("a");
    return (
      <div className="space-y-2">
        <SegmentedControl
          value={value}
          options={[
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta" },
            { value: "c", label: "Gamma" },
          ]}
          onChange={setValue}
        />
        <p className="text-xs opacity-60" data-testid="selected">
          Selected: {value}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Alpha is selected by default", () => {
      expect(canvas.getByTestId("selected")).toHaveTextContent("Selected: a");
    });

    await userEvent.step("Click Beta to select it", async () => {
      await userEvent.click(canvas.getByText("Beta"));
    });

    await userEvent.step("Beta is now selected", () => {
      expect(canvas.getByTestId("selected")).toHaveTextContent("Selected: b");
    });

    await userEvent.step("Click Gamma", async () => {
      await userEvent.click(canvas.getByText("Gamma"));
    });

    await userEvent.step("Gamma is now selected", () => {
      expect(canvas.getByTestId("selected")).toHaveTextContent("Selected: c");
    });
  },
};
