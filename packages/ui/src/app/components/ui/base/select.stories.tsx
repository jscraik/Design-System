import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { expect, userEvent, within } from "@storybook/test";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

type SelectStoryArgs = React.ComponentProps<typeof Select> & {
  triggerSize: "sm" | "default";
  disabled: boolean;
  placeholder: string;
};

const meta: Meta<SelectStoryArgs> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    triggerSize: {
      control: "select",
      options: ["sm", "default"],
      description: "Size of the select trigger",
    },
    disabled: {
      control: "boolean",
      description: "Disable the select trigger",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    defaultValue: {
      control: "text",
      description: "Initial selected value",
    },
  },
  args: {
    triggerSize: "default",
    disabled: false,
    placeholder: "Choose plan",
    defaultValue: "starter",
  },
};

export default meta;

type Story = StoryObj<SelectStoryArgs>;

export const Default: Story = {
  render: (args) => (
    <Select defaultValue={args.defaultValue} disabled={args.disabled}>
      <SelectTrigger className="w-[220px]" size={args.triggerSize} disabled={args.disabled}>
        <SelectValue placeholder={args.placeholder} />
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");
    await userEvent.click(trigger);
    const menu = within(canvasElement.ownerDocument.body);
    await userEvent.click(menu.getByRole("option", { name: "Pro" }));
    await expect(trigger).toHaveTextContent("Pro");
  },
};
