import type { Meta, StoryObj } from "@storybook/react-vite";

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
