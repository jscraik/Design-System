import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as Icons from "./ChatGPTIcons";

type IconComponent = React.ComponentType<{ className?: string }>;
type IconEntry = [string, IconComponent];

const iconEntries: IconEntry[] = Object.entries(Icons)
  .filter(([name]) => name.startsWith("Icon"))
  .map(([name, Component]) => [name, Component as IconComponent]);

const sortedIcons = [...iconEntries].sort(([a], [b]) => a.localeCompare(b));

const sizeSamples: IconEntry[] = [
  ["IconOpenAILogo", Icons.IconOpenAILogo as IconComponent],
  ["IconChat", Icons.IconChat as IconComponent],
  ["IconSettings", Icons.IconSettings as IconComponent],
];

const meta: Meta<typeof Icons.IconOpenAILogo> = {
  title: "Icons/ChatGPTIcons",
  component: Icons.IconOpenAILogo,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Icons.IconOpenAILogo>;

function IconTile({
  name,
  Icon,
  iconClassName,
  labelClassName,
  cardClassName,
}: {
  name: string;
  Icon: IconComponent;
  iconClassName: string;
  labelClassName: string;
  cardClassName: string;
}) {
  return (
    <div className={cardClassName}>
      <Icon className={iconClassName} />
      <span className={labelClassName}>{name}</span>
    </div>
  );
}

export const AllIcons: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedIcons.map(([name, Icon]) => (
          <IconTile
            key={name}
            name={name}
            Icon={Icon}
            iconClassName="size-6 text-gray-900"
            labelClassName="text-xs text-gray-600"
            cardClassName="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2"
          />
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => {
    const sizes = ["size-4", "size-6", "size-8"] as const;
    return (
      <div className="w-full max-w-4xl space-y-4">
        {sizes.map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-4">
            <span className="w-16 text-xs font-medium text-gray-500">{size}</span>
            <div className="flex flex-wrap items-center gap-4">
              {sizeSamples.map(([name, Icon]) => (
                <div
                  key={`${size}-${name}`}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2"
                >
                  <Icon className={`${size} text-gray-900`} />
                  <span className="text-xs text-gray-600">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const Muted: Story = {
  render: () => (
    <div className="w-full max-w-6xl rounded-lg bg-gray-900 p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedIcons.map(([name, Icon]) => (
          <IconTile
            key={name}
            name={name}
            Icon={Icon}
            iconClassName="size-6 text-white/60"
            labelClassName="text-xs text-white/60"
            cardClassName="flex items-center gap-3 rounded-md border border-white/10 bg-gray-900/60 px-3 py-2"
          />
        ))}
      </div>
    </div>
  ),
};