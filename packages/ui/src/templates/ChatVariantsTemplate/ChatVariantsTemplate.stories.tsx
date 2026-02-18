import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatVariantsTemplate } from "./ChatVariantsTemplate";

const meta: Meta<typeof ChatVariantsTemplate> = {
  title: "Components/Templates/Chat/Chat Variants",
  component: ChatVariantsTemplate,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ChatVariantsTemplate>;

export const Default: Story = {};
