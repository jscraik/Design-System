import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => <Textarea className="w-72" placeholder="Write a note..." />,
};

export const WithValue: Story = {
  render: () => <Textarea className="w-72" defaultValue="This is a pre-filled message." />,
};
