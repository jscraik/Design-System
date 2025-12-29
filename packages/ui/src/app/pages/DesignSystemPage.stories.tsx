import type { Meta, StoryObj } from "@storybook/react-vite";

import { DesignSystemPage } from "./DesignSystemPage";

const meta: Meta<typeof DesignSystemPage> = {
  title: "Pages/DesignSystemPage",
  component: DesignSystemPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof DesignSystemPage>;

export const Default: Story = {
  render: () => <DesignSystemPage />,
};
