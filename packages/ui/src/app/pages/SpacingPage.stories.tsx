import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpacingPage } from "./SpacingPage";

const meta: Meta<typeof SpacingPage> = {
  title: "Pages/SpacingPage",
  component: SpacingPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof SpacingPage>;

export const Default: Story = {
  render: () => <SpacingPage />,
};
