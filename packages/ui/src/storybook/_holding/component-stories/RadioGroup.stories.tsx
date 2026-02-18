import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "../Label";

import { RadioGroup, RadioGroupItem } from "./fallback/RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/UI/Base/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

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
