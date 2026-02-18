import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";

import { DirectionProvider, useDirection } from "./fallback/DirectionProvider";

const meta: Meta<typeof DirectionProvider> = {
  title: "Components/UI/Base/Direction Provider",
  component: DirectionProvider,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

function DirectionDemo() {
  const { dir, isRTL } = useDirection();
  return (
    <div className="space-y-4 p-6 border border-foundation-bg-dark-3 rounded-lg min-w-[300px]">
      <div className="text-sm text-foundation-text-dark-tertiary">
        Direction: <span className="text-foundation-text-dark-primary font-medium">{dir}</span>
        {" | "}
        RTL:{" "}
        <span className="text-foundation-text-dark-primary font-medium">
          {isRTL ? "Yes" : "No"}
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>

      <div className="flex gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </div>
    </div>
  );
}

export const LTR: Story = {
  render: () => (
    <DirectionProvider dir="ltr">
      <DirectionDemo />
    </DirectionProvider>
  ),
};

export const RTL: Story = {
  render: () => (
    <DirectionProvider dir="rtl">
      <DirectionDemo />
    </DirectionProvider>
  ),
};

export const FromLocaleArabic: Story = {
  render: () => (
    <DirectionProvider locale="ar-SA">
      <DirectionDemo />
    </DirectionProvider>
  ),
};

export const FromLocaleHebrew: Story = {
  render: () => (
    <DirectionProvider locale="he-IL">
      <DirectionDemo />
    </DirectionProvider>
  ),
};

export const FromLocaleEnglish: Story = {
  render: () => (
    <DirectionProvider locale="en-US">
      <DirectionDemo />
    </DirectionProvider>
  ),
};

export const SideBySide: Story = {
  render: () => (
    <div className="flex gap-8">
      <div>
        <h3 className="text-sm font-medium text-foundation-text-dark-primary mb-2">
          LTR (English)
        </h3>
        <DirectionProvider dir="ltr">
          <DirectionDemo />
        </DirectionProvider>
      </div>
      <div>
        <h3 className="text-sm font-medium text-foundation-text-dark-primary mb-2">RTL (Arabic)</h3>
        <DirectionProvider dir="rtl">
          <DirectionDemo />
        </DirectionProvider>
      </div>
    </div>
  ),
};
