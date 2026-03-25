import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useState } from "react";

import { ProjectSettingsModal } from "./ProjectSettingsModal";

const meta: Meta<typeof ProjectSettingsModal> = {
  title: "Components/Chat/Project Settings Modal",
  component: ProjectSettingsModal,
  tags: ["autodocs"],
  args: {
    memoryOption: "default",
    onClose: fn(),
    onDone: fn(),
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => {
    const [memoryOption, setMemoryOption] = useState<"default" | "project-only">(
      args.memoryOption ?? "default",
    );

    return (
      <div className="min-h-dvh bg-background p-6">
        <ProjectSettingsModal
          {...args}
          memoryOption={memoryOption}
          onSelectMemoryOption={setMemoryOption}
        />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof ProjectSettingsModal>;

export const Default: Story = {};

export const ProjectOnly: Story = {
  args: {
    memoryOption: "project-only",
  },
};
