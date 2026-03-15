import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Label } from "../Label";

import { Switch } from "./fallback/Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/UI/Base/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Switch>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Notifications</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="presence" defaultChecked />
      <Label htmlFor="presence">Presence</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off" className="opacity-50">Disabled (off)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="disabled-on" defaultChecked disabled />
        <Label htmlFor="disabled-on" className="opacity-50">Disabled (on)</Label>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 min-w-[200px]">
      <div className="flex items-center gap-2">
        <Switch id="s-off" />
        <Label htmlFor="s-off">Off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="s-on" defaultChecked />
        <Label htmlFor="s-on">On</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="s-dis" disabled />
        <Label htmlFor="s-dis" className="opacity-50">Disabled</Label>
      </div>
    </div>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ClickToToggle: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="click-toggle" />
      <Label htmlFor="click-toggle">Airplane mode</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Switch starts unchecked", () => {
      const sw = canvas.getByRole("switch", { name: /airplane mode/i });
      expect(sw).toHaveAttribute("aria-checked", "false");
    });

    await userEvent.step("Click to toggle on", async () => {
      const sw = canvas.getByRole("switch", { name: /airplane mode/i });
      await userEvent.click(sw);
      expect(sw).toHaveAttribute("aria-checked", "true");
    });

    await userEvent.step("Click again to toggle off", async () => {
      const sw = canvas.getByRole("switch", { name: /airplane mode/i });
      await userEvent.click(sw);
      expect(sw).toHaveAttribute("aria-checked", "false");
    });
  },
};

export const KeyboardToggle: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="keyboard-toggle" />
      <Label htmlFor="keyboard-toggle">Dark mode</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Tab to focus the switch", async () => {
      await userEvent.tab();
      const sw = canvas.getByRole("switch", { name: /dark mode/i });
      expect(sw).toHaveFocus();
    });

    await userEvent.step("Press Space to toggle on", async () => {
      await userEvent.keyboard(" ");
      const sw = canvas.getByRole("switch", { name: /dark mode/i });
      expect(sw).toHaveAttribute("aria-checked", "true");
    });

    await userEvent.step("Press Space again to toggle off", async () => {
      await userEvent.keyboard(" ");
      const sw = canvas.getByRole("switch", { name: /dark mode/i });
      expect(sw).toHaveAttribute("aria-checked", "false");
    });
  },
};

export const DisabledDoesNotToggle: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="disabled-no-toggle" disabled />
      <Label htmlFor="disabled-no-toggle">Feature flag (locked)</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole("switch", { name: /feature flag/i });

    await userEvent.step("Switch is disabled", () => {
      expect(sw).toBeDisabled();
    });

    await userEvent.step("Clicking disabled switch does not change state", async () => {
      await userEvent.click(sw, { pointerEventsCheck: 0 });
      expect(sw).toHaveAttribute("aria-checked", "false");
    });
  },
};

export const LabelClickTogglesSwitch: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="label-click" />
      <Label htmlFor="label-click">Sync contacts</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Switch starts unchecked", () => {
      const sw = canvas.getByRole("switch");
      expect(sw).toHaveAttribute("aria-checked", "false");
    });

    await userEvent.step("Clicking the Label toggles the switch via htmlFor", async () => {
      const label = canvas.getByText("Sync contacts");
      await userEvent.click(label);
      const sw = canvas.getByRole("switch");
      expect(sw).toHaveAttribute("aria-checked", "true");
    });
  },
};
