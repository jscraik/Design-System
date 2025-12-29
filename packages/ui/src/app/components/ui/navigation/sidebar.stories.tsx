import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { IconChat, IconFolder, IconSettings } from "../../../../icons";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "./sidebar";

const meta: Meta<typeof SidebarProvider> = {
  title: "UI/Sidebar",
  component: SidebarProvider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof SidebarProvider>;

export const Default: Story = {
  render: () => (
    <SidebarProvider defaultOpen>
      <div className="h-[340px] w-[680px] overflow-hidden rounded-lg border bg-background">
        <Sidebar>
          <SidebarHeader>
            <SidebarInput placeholder="Search" />
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <IconChat className="size-4" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconFolder className="size-4" />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconSettings className="size-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="text-xs text-muted-foreground">Team Workspace</SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <SidebarTrigger className="h-8 w-8" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="p-4 text-sm text-muted-foreground">Main content goes here.</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: /toggle sidebar/i });
    await userEvent.click(toggle);
    await expect(toggle).toBeInTheDocument();
  },
};
