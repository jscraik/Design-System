import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppsPanelTemplate } from "../AppsPanelTemplate";
import { ArchivedChatsPanelTemplate } from "../ArchivedChatsPanelTemplate";
import { AudioSettingsPanelTemplate } from "../AudioSettingsPanelTemplate";
import { CheckForUpdatesPanelTemplate } from "../CheckForUpdatesPanelTemplate";
import { DataControlsPanelTemplate } from "../DataControlsPanelTemplate";
import { ManageAppsPanelTemplate } from "../ManageAppsPanelTemplate";
import { NotificationsPanelTemplate } from "../NotificationsPanelTemplate";
import { PersonalizationPanelTemplate } from "../PersonalizationPanelTemplate";
import { SecurityPanelTemplate } from "../SecurityPanelTemplate";

const meta: Meta = {
  title: "Components/Templates/Settings/Settings Panels",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const Apps: Story = {
  render: () => <AppsPanelTemplate />,
};

export const ArchivedChats: Story = {
  render: () => <ArchivedChatsPanelTemplate />,
};

export const Audio: Story = {
  render: () => <AudioSettingsPanelTemplate />,
};

export const CheckForUpdates: Story = {
  render: () => <CheckForUpdatesPanelTemplate />,
};

export const DataControls: Story = {
  render: () => <DataControlsPanelTemplate />,
};

export const ManageApps: Story = {
  render: () => <ManageAppsPanelTemplate />,
};

export const Notifications: Story = {
  render: () => <NotificationsPanelTemplate />,
};

export const Personalization: Story = {
  render: () => <PersonalizationPanelTemplate />,
};

export const Security: Story = {
  render: () => <SecurityPanelTemplate />,
};
