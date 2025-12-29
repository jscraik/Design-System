import type { Meta, StoryObj } from "@storybook/react-vite";

import App from "./App";

const meta: Meta<typeof App> = {
  title: "Pages/ChatUIApp",
  component: App,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof App>;

export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <App />
    </div>
  ),
};
