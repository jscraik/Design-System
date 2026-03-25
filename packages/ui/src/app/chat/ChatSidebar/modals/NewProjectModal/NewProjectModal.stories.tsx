import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useState } from "react";

import {
  sampleCategories,
  sampleCategoryColors,
  sampleCategoryIconColors,
  sampleCategoryIcons,
} from "../../../../../fixtures/sample-data";

import { NewProjectModal } from "./NewProjectModal";

const meta: Meta<typeof NewProjectModal> = {
  title: "Components/Chat/New Project Modal",
  component: NewProjectModal,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    projectName: "",
    newProjectIcon: "folder",
    newProjectColor: "text-muted-foreground",
    selectedCategories: ["Coding"],
    categories: sampleCategories,
    categoryIcons: sampleCategoryIcons,
    categoryColors: sampleCategoryColors,
    categoryIconColors: sampleCategoryIconColors,
    onCreateProject: fn(),
    onIconPickerOpen: fn(),
    onMoreOptions: fn(),
    onClose: fn(),
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => {
    const [projectName, setProjectName] = useState(args.projectName);
    const [selectedCategories, setSelectedCategories] = useState(args.selectedCategories ?? []);

    return (
      <div className="min-h-dvh bg-background p-6">
        <NewProjectModal
          {...args}
          projectName={projectName}
          selectedCategories={selectedCategories}
          onProjectNameChange={setProjectName}
          onToggleCategory={(category) => {
            setSelectedCategories((prev) =>
              prev.includes(category)
                ? prev.filter((entry) => entry !== category)
                : [...prev, category],
            );
          }}
        />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof NewProjectModal>;

export const Default: Story = {};

export const ReadyToCreate: Story = {
  args: {
    projectName: "Release planning",
    selectedCategories: ["Writing", "Research"],
  },
};
