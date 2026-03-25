import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "@storybook/test";

import {
  sampleCategories,
  sampleCategoryColors,
  sampleCategoryIconColors,
  sampleCategoryIcons,
  sampleChatHistory,
  sampleGroupChats,
  sampleProjects,
  sampleUser,
} from "../../../fixtures/sample-data";

import { ChatSidebar } from "./ChatSidebar";

const meta: Meta<typeof ChatSidebar> = {
  title: "Components/Chat/Chat Sidebar",
  component: ChatSidebar,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onToggle: fn(),
    onProjectSelect: fn(),
    projects: sampleProjects,
    chatHistory: sampleChatHistory,
    groupChats: sampleGroupChats,
    categories: sampleCategories,
    categoryIcons: sampleCategoryIcons,
    categoryColors: sampleCategoryColors,
    categoryIconColors: sampleCategoryIconColors,
    user: sampleUser,
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="min-h-dvh bg-background">
      <ChatSidebar {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatSidebar>;

export const DefaultOpen: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    error: "Connection failed",
  },
};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const OpenProjectSettingsFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.step("Open the new project modal from the sidebar", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "New project" }));
      await expect(
        body.findByText("Projects give ChatGPT shared context"),
      ).resolves.toBeInTheDocument();
    });

    await userEvent.step("Advance into project settings", async () => {
      await userEvent.click(await body.findByRole("button", { name: "More options" }));
      await expect(body.findByText("Project settings")).resolves.toBeInTheDocument();
      await expect(body.findByText("Project-only")).resolves.toBeInTheDocument();
    });
  },
};
