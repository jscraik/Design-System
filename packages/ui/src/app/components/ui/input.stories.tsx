import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => <Input className="w-64" placeholder="Search..." />,
};

export const WithValue: Story = {
  render: () => <Input className="w-64" defaultValue="hello@openai.com" />,
};