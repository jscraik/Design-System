import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton } from "./icon-button";

// Mock icons for the story
const CopyIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75A1.125 1.125 0 013.75 20.625V9.375c0-.621.504-1.125 1.125-1.125H8.25m6.75 0V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H16.5"
    />
  </svg>
);

const HeartIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: "UI/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["ghost", "outline", "solid"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <CopyIcon />,
    title: "Copy to clipboard",
  },
};

export const Ghost: Story = {
  args: {
    icon: <CopyIcon />,
    variant: "ghost",
    title: "Ghost variant",
  },
};

export const Outline: Story = {
  args: {
    icon: <CopyIcon />,
    variant: "outline",
    title: "Outline variant",
  },
};

export const Solid: Story = {
  args: {
    icon: <CopyIcon />,
    variant: "solid",
    title: "Solid variant",
  },
};

export const Small: Story = {
  args: {
    icon: <CopyIcon />,
    size: "sm",
    title: "Small size",
  },
};

export const Medium: Story = {
  args: {
    icon: <CopyIcon />,
    size: "md",
    title: "Medium size",
  },
};

export const Large: Story = {
  args: {
    icon: <CopyIcon />,
    size: "lg",
    title: "Large size",
  },
};

export const Active: Story = {
  args: {
    icon: <HeartIcon />,
    active: true,
    activeColor: "var(--foundation-accent-red)",
    title: "Active state",
  },
};

export const Disabled: Story = {
  args: {
    icon: <CopyIcon />,
    disabled: true,
    title: "Disabled state",
  },
};
