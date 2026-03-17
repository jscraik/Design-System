import { Toggle } from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";

const meta: Meta<typeof Toggle> = {
  title: "Components/UI/Base/Toggle",
  component: Toggle,
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
    const [checked, setChecked] = useState(false);
    return <Toggle checked={checked} onChange={setChecked} ariaLabel="Example toggle" />;
  },
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return <Toggle checked={checked} onChange={setChecked} ariaLabel="Example toggle" />;
  },
};

export const Disabled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Toggle checked={checked} onChange={setChecked} disabled={true} ariaLabel="Example toggle" />
    );
  },
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ClickToToggle: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Toggle checked={checked} onChange={setChecked} ariaLabel="Dark mode" />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Toggle starts unchecked", () => {
      const btn = canvas.getByRole("button", { name: /dark mode/i });
      expect(btn).toHaveAttribute("aria-pressed", "false");
    });

    await userEvent.step("Click to toggle on", async () => {
      const btn = canvas.getByRole("button", { name: /dark mode/i });
      await userEvent.click(btn);
      expect(btn).toHaveAttribute("aria-pressed", "true");
    });

    await userEvent.step("Click again to toggle off", async () => {
      const btn = canvas.getByRole("button", { name: /dark mode/i });
      await userEvent.click(btn);
      expect(btn).toHaveAttribute("aria-pressed", "false");
    });
  },
};

export const KeyboardToggle: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Toggle checked={checked} onChange={setChecked} ariaLabel="Bold" />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Tab to focus", async () => {
      await userEvent.tab();
      const btn = canvas.getByRole("button", { name: /bold/i });
      expect(btn).toHaveFocus();
    });

    await userEvent.step("Press Enter to activate", async () => {
      await userEvent.keyboard("{Enter}");
      const btn = canvas.getByRole("button", { name: /bold/i });
      expect(btn).toHaveAttribute("aria-pressed", "true");
    });
  },
};
