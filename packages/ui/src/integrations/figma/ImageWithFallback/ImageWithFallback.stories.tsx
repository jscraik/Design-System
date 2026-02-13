import type { Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";

import { ImageWithFallback } from "./ImageWithFallback";

const meta: Meta<typeof ImageWithFallback> = {
  title: "Documentation/Integrations/Figma/Image With Fallback",
  component: ImageWithFallback,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ImageWithFallback>;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-foundation-bg-dark-1 border border-foundation-text-light-primary/10 dark:border-foundation-text-dark-primary/10 rounded-md shadow-sm p-4"
      style={{ width: 220 }}
    >
      {children}
    </div>
  );
}

export const ValidImage: Story = {
  render: () => (
    <Card>
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=320&h=320&q=80"
        alt="Sample landscape"
        style={{ width: 160, height: 160, objectFit: "cover" }}
      />
    </Card>
  ),
};

export const FallbackImage: Story = {
  render: () => (
    <Card>
      <ImageWithFallback
        src="https://example.com/does-not-exist.png"
        alt="Broken image fallback"
        style={{ width: 160, height: 160, objectFit: "cover" }}
      />
    </Card>
  ),
};
