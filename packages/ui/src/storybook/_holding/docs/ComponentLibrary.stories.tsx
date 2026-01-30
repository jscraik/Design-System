import type { Meta, StoryObj } from "@storybook/react-vite";

const Stub = () => null;

const meta = {
  title: "Overview/Component Library",
  component: Stub,
  parameters: {
    docs: {
      page: null,
    },
  },
} satisfies Meta<typeof Stub>;

export default meta;

type Story = StoryObj<typeof Stub>;

export const Page: Story = {};
