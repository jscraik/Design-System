import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="starter">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Choose plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Plans</SelectLabel>
          <SelectItem value="starter">Starter</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
