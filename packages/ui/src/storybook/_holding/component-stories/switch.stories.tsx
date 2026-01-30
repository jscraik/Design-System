import type { Meta, StoryObj } from "@storybook/react-vite";

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
