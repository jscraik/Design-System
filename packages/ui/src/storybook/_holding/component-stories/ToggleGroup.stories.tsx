import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { ToggleGroup, ToggleGroupItem } from "@design-studio/ui";

const meta: Meta<typeof ToggleGroup> = {
  title: "Components/UI/Base/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ToggleGroup>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const SingleSelectToggle: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Left is pressed by default", () => {
      const left = canvas.getByRole("radio", { name: /left/i });
      expect(left).toHaveAttribute("aria-checked", "true");
    });

    await userEvent.step("Click Center — it becomes selected, Left deselected", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: /center/i }));
      expect(canvas.getByRole("radio", { name: /center/i })).toHaveAttribute("aria-checked", "true");
      expect(canvas.getByRole("radio", { name: /left/i })).toHaveAttribute("aria-checked", "false");
    });
  },
};

export const MultipleSelectToggle: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Bold is pressed by default", () => {
      const bold = canvas.getByRole("button", { name: /bold/i });
      expect(bold).toHaveAttribute("aria-pressed", "true");
    });

    await userEvent.step("Click Italic — both Bold and Italic are pressed", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /italic/i }));
      expect(canvas.getByRole("button", { name: /bold/i })).toHaveAttribute("aria-pressed", "true");
      expect(canvas.getByRole("button", { name: /italic/i })).toHaveAttribute("aria-pressed", "true");
    });

    await userEvent.step("Click Bold to unpress it — only Italic remains", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /bold/i }));
      expect(canvas.getByRole("button", { name: /bold/i })).toHaveAttribute("aria-pressed", "false");
      expect(canvas.getByRole("button", { name: /italic/i })).toHaveAttribute("aria-pressed", "true");
    });
  },
};
