import type { Meta, StoryObj } from "@storybook/react-vite";

import { TypographyShowcase } from "./TypographyShowcase";

const meta: Meta<typeof TypographyShowcase> = {
  title: "DesignSystem/TypographyShowcase",
  component: TypographyShowcase,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof TypographyShowcase>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen">
      <TypographyShowcase />
    </div>
  ),
};
