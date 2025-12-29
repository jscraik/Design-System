import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "UI/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup className="h-40 w-[420px] rounded-md border" direction="horizontal">
      <ResizablePanel defaultSize={50} className="p-4 text-sm">
        Left panel
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} className="p-4 text-sm">
        Right panel
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
