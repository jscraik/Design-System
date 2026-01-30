import type { Meta, StoryObj } from "@storybook/react-vite";

import { TypographyPage } from "./TypographyPage";

const meta: Meta<typeof TypographyPage> = {
  title: "Overview/Pages/Typography",
  component: TypographyPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof TypographyPage>;

export const Default: Story = {
  render: () => <TypographyPage />,
};
