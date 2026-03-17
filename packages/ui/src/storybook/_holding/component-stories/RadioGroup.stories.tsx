import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Label } from "@design-studio/ui";

import { RadioGroup, RadioGroupItem } from "@design-studio/ui";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/UI/Base/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="option-1" value="option-1" />
        <Label htmlFor="option-1">Option One</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="option-2" value="option-2" />
        <Label htmlFor="option-2">Option Two</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="option-3" value="option-3" />
        <Label htmlFor="option-3">Enabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="option-4" value="option-4" disabled />
        <Label htmlFor="option-4">Disabled</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="sm" className="flex flex-row gap-4">
      {["xs", "sm", "md", "lg"].map((size) => (
        <div key={size} className="flex items-center gap-1.5">
          <RadioGroupItem id={`size-${size}`} value={size} />
          <Label htmlFor={`size-${size}`}>{size.toUpperCase()}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ClickToSelect: Story = {
  render: () => (
    <RadioGroup defaultValue="opt-a">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="opt-a" value="opt-a" />
        <Label htmlFor="opt-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="opt-b" value="opt-b" />
        <Label htmlFor="opt-b">Option B</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="opt-c" value="opt-c" />
        <Label htmlFor="opt-c">Option C</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Option A is selected by default", () => {
      const optA = canvas.getByRole("radio", { name: /option a/i });
      expect(optA).toBeChecked();
    });

    await userEvent.step("Click Option B to select it", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: /option b/i }));
    });

    await userEvent.step("Option B is now checked, Option A is unchecked", () => {
      expect(canvas.getByRole("radio", { name: /option b/i })).toBeChecked();
      expect(canvas.getByRole("radio", { name: /option a/i })).not.toBeChecked();
    });

    await userEvent.step("Only one option can be selected (radio group)", () => {
      const allRadios = canvas.getAllByRole("radio");
      const checkedCount = allRadios.filter((r) => (r as HTMLInputElement).checked).length;
      expect(checkedCount).toBe(1);
    });
  },
};

export const KeyboardArrowNavigation: Story = {
  render: () => (
    <RadioGroup>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="k-opt-1" value="k-opt-1" />
        <Label htmlFor="k-opt-1">First</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="k-opt-2" value="k-opt-2" />
        <Label htmlFor="k-opt-2">Second</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="k-opt-3" value="k-opt-3" />
        <Label htmlFor="k-opt-3">Third</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Tab to focus first radio button", async () => {
      await userEvent.tab();
      const first = canvas.getByRole("radio", { name: /first/i });
      expect(first).toHaveFocus();
    });

    await userEvent.step("ArrowDown selects next option", async () => {
      await userEvent.keyboard("{ArrowDown}");
      const second = canvas.getByRole("radio", { name: /second/i });
      expect(second).toBeChecked();
      expect(second).toHaveFocus();
    });

    await userEvent.step("ArrowDown again selects third option", async () => {
      await userEvent.keyboard("{ArrowDown}");
      const third = canvas.getByRole("radio", { name: /third/i });
      expect(third).toBeChecked();
    });

    await userEvent.step("ArrowUp moves back to second option", async () => {
      await userEvent.keyboard("{ArrowUp}");
      const second = canvas.getByRole("radio", { name: /second/i });
      expect(second).toBeChecked();
    });
  },
};

export const DisabledItemNotSelectable: Story = {
  render: () => (
    <RadioGroup defaultValue="enabled">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="radio-enabled" value="enabled" />
        <Label htmlFor="radio-enabled">Enabled option</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="radio-disabled" value="disabled-opt" disabled />
        <Label htmlFor="radio-disabled" className="opacity-50">Disabled option</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabled = canvas.getByRole("radio", { name: /disabled option/i });

    await userEvent.step("Disabled radio is not selectable", async () => {
      expect(disabled).toBeDisabled();
      await userEvent.click(disabled, { pointerEventsCheck: 0 });
      expect(disabled).not.toBeChecked();
    });

    await userEvent.step("Enabled option remains selected", () => {
      const enabled = canvas.getByRole("radio", { name: /enabled option/i });
      expect(enabled).toBeChecked();
    });
  },
};
