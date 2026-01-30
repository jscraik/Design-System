import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "../Input";

import { Label } from "./fallback/Label";

const meta: Meta<typeof Label> = {
  title: "Components/UI/Base/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" className="w-64" placeholder="name@company.com" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-2 group" data-disabled="true">
      <Label htmlFor="disabled-input">Disabled</Label>
      <Input id="disabled-input" className="w-64" placeholder="Unavailable" disabled />
    </div>
  ),
};
