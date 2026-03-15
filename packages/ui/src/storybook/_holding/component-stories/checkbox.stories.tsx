import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Label } from "../Label";

import { Checkbox } from "./fallback/Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/UI/Base/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="marketing" defaultChecked />
      <Label htmlFor="marketing">Email updates</Label>
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="indeterminate" checked="indeterminate" onCheckedChange={() => {}} />
      <Label htmlFor="indeterminate">Select all (partial)</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="dis-off" disabled />
        <Label htmlFor="dis-off" className="opacity-50">Disabled (unchecked)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="dis-on" defaultChecked disabled />
        <Label htmlFor="dis-on" className="opacity-50">Disabled (checked)</Label>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 min-w-[220px]">
      <div className="flex items-center gap-2">
        <Checkbox id="c-off" />
        <Label htmlFor="c-off">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c-on" defaultChecked />
        <Label htmlFor="c-on">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c-ind" checked="indeterminate" onCheckedChange={() => {}} />
        <Label htmlFor="c-ind">Indeterminate</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c-dis" disabled />
        <Label htmlFor="c-dis" className="opacity-50">Disabled</Label>
      </div>
    </div>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ClickToCheck: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="click-check" />
      <Label htmlFor="click-check">I agree to the terms</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Checkbox starts unchecked", () => {
      const cb = canvas.getByRole("checkbox", { name: /agree/i });
      expect(cb).not.toBeChecked();
    });

    await userEvent.step("Click to check", async () => {
      const cb = canvas.getByRole("checkbox", { name: /agree/i });
      await userEvent.click(cb);
      expect(cb).toBeChecked();
    });

    await userEvent.step("Click again to uncheck", async () => {
      const cb = canvas.getByRole("checkbox", { name: /agree/i });
      await userEvent.click(cb);
      expect(cb).not.toBeChecked();
    });
  },
};

export const KeyboardCheck: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="keyboard-check" />
      <Label htmlFor="keyboard-check">Subscribe to newsletter</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Tab to focus the checkbox", async () => {
      await userEvent.tab();
      const cb = canvas.getByRole("checkbox", { name: /subscribe/i });
      expect(cb).toHaveFocus();
    });

    await userEvent.step("Press Space to check", async () => {
      await userEvent.keyboard(" ");
      const cb = canvas.getByRole("checkbox", { name: /subscribe/i });
      expect(cb).toBeChecked();
    });

    await userEvent.step("Press Space again to uncheck", async () => {
      await userEvent.keyboard(" ");
      const cb = canvas.getByRole("checkbox", { name: /subscribe/i });
      expect(cb).not.toBeChecked();
    });
  },
};

export const DisabledDoesNotCheck: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="disabled-check" disabled />
      <Label htmlFor="disabled-check">Locked option</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cb = canvas.getByRole("checkbox", { name: /locked/i });

    await userEvent.step("Checkbox is disabled", () => {
      expect(cb).toBeDisabled();
    });

    await userEvent.step("Clicking disabled checkbox has no effect", async () => {
      await userEvent.click(cb, { pointerEventsCheck: 0 });
      expect(cb).not.toBeChecked();
    });
  },
};

export const LabelClickChecksBox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-assoc" />
      <Label htmlFor="label-assoc">Remember me</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Checkbox is unchecked initially", () => {
      const cb = canvas.getByRole("checkbox");
      expect(cb).not.toBeChecked();
    });

    await userEvent.step("Clicking the Label checks the box (htmlFor association)", async () => {
      await userEvent.click(canvas.getByText("Remember me"));
      const cb = canvas.getByRole("checkbox");
      expect(cb).toBeChecked();
    });
  },
};
