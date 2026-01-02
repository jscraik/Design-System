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
  title: "Components/Icons/ChatGPT Icons",
  component: Icons.IconOpenAILogo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Recommended sizes: xs 12, sm 16, md 20, lg 24, key 32, toggle 44x24. React export: chatGPTIconSizes. Swift: ChatGPTIconSize.",
      },
    },
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
            iconClassName="size-6 text-foundation-text-dark-primary"
            labelClassName="text-xs text-foundation-text-dark-secondary"
            cardClassName="flex items-center gap-3 rounded-md border border-foundation-text-light-primary/10 dark:border-foundation-text-dark-primary/10 bg-foundation-bg-dark-1 px-3 py-2"
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
        <p className="text-sm text-foundation-text-dark-secondary">
          Suggested scale: 12/16/20/24, key 32, toggle 44x24. Use{" "}
          <code className="rounded bg-foundation-bg-dark-2 px-1">chatGPTIconSizes</code> for numeric
          values.
        </p>
        {sizes.map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-4">
            <span className="w-16 text-xs font-medium text-foundation-text-dark-tertiary">
              {size}
            </span>
            <div className="flex flex-wrap items-center gap-4">
              {sizeSamples.map(([name, Icon]) => (
                <div
                  key={`${size}-${name}`}
                  className="flex items-center gap-2 rounded-md border border-foundation-text-light-primary/10 dark:border-foundation-text-dark-primary/10 bg-foundation-bg-dark-1 px-3 py-2"
                >
                  <Icon className={`${size} text-foundation-text-dark-primary`} />
                  <span className="text-xs text-foundation-text-dark-secondary">{name}</span>
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
    <div className="w-full max-w-6xl rounded-lg bg-foundation-bg-dark-1 p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedIcons.map(([name, Icon]) => (
          <IconTile
            key={name}
            name={name}
            Icon={Icon}
            iconClassName="size-6 text-foundation-text-dark-secondary"
            labelClassName="text-xs text-foundation-text-dark-secondary"
            cardClassName="flex items-center gap-3 rounded-md border border-foundation-text-dark-primary/10 bg-foundation-bg-dark-2 px-3 py-2"
          />
        ))}
      </div>
    </div>
  ),
};

export const KeyboardShortcuts: Story = {
  render: () => {
    const keyboardIcons: IconEntry[] = [
      ["IconKeyEscape", Icons.IconKeyEscape as IconComponent],
      ["IconKeyShift", Icons.IconKeyShift as IconComponent],
      ["IconKeyCommand", Icons.IconKeyCommand as IconComponent],
      ["IconKeyOption", Icons.IconKeyOption as IconComponent],
      ["IconKeyControl", Icons.IconKeyControl as IconComponent],
      ["IconKeyTab", Icons.IconKeyTab as IconComponent],
      ["IconKeyCapsLock", Icons.IconKeyCapsLock as IconComponent],
      ["IconKeyReturn", Icons.IconKeyReturn as IconComponent],
      ["IconKeyDelete", Icons.IconKeyDelete as IconComponent],
      ["IconKeyBackspace", Icons.IconKeyBackspace as IconComponent],
      ["IconKeySpace", Icons.IconKeySpace as IconComponent],
      ["IconKeyFn", Icons.IconKeyFn as IconComponent],
      ["IconKeyUp", Icons.IconKeyUp as IconComponent],
      ["IconKeyDown", Icons.IconKeyDown as IconComponent],
      ["IconKeyLeft", Icons.IconKeyLeft as IconComponent],
      ["IconKeyRight", Icons.IconKeyRight as IconComponent],
      ["IconKeyHome", Icons.IconKeyHome as IconComponent],
      ["IconKeyEnd", Icons.IconKeyEnd as IconComponent],
      ["IconKeyPageUp", Icons.IconKeyPageUp as IconComponent],
      ["IconKeyPageDown", Icons.IconKeyPageDown as IconComponent],
      ["IconKeyArrowUp", Icons.IconKeyArrowUp as IconComponent],
      ["IconKeyArrowDown", Icons.IconKeyArrowDown as IconComponent],
      ["IconKeyArrowLeft", Icons.IconKeyArrowLeft as IconComponent],
      ["IconKeyArrowRight", Icons.IconKeyArrowRight as IconComponent],
      ["IconKeyBacktick", Icons.IconKeyBacktick as IconComponent],
      ["IconKeyMinus", Icons.IconKeyMinus as IconComponent],
      ["IconKeyEquals", Icons.IconKeyEquals as IconComponent],
      ["IconKeyBracketLeft", Icons.IconKeyBracketLeft as IconComponent],
      ["IconKeyBracketRight", Icons.IconKeyBracketRight as IconComponent],
      ["IconKeyBackslash", Icons.IconKeyBackslash as IconComponent],
      ["IconKeySemicolon", Icons.IconKeySemicolon as IconComponent],
      ["IconKeyQuote", Icons.IconKeyQuote as IconComponent],
      ["IconKeyEnter", Icons.IconKeyEnter as IconComponent],
      ["IconKeyComma", Icons.IconKeyComma as IconComponent],
      ["IconKeyPeriod", Icons.IconKeyPeriod as IconComponent],
      ["IconKeySlash", Icons.IconKeySlash as IconComponent],
      ["IconKeyLeftAlt", Icons.IconKeyLeftAlt as IconComponent],
      ["IconKeyRightAlt", Icons.IconKeyRightAlt as IconComponent],
      ["IconKeyLeftMeta", Icons.IconKeyLeftMeta as IconComponent],
      ["IconKeyRightMeta", Icons.IconKeyRightMeta as IconComponent],
      ["IconKeyLeftWindows", Icons.IconKeyLeftWindows as IconComponent],
      ["IconKeyRightWindows", Icons.IconKeyRightWindows as IconComponent],
      ["IconKeyExclamation", Icons.IconKeyExclamation as IconComponent],
      ["IconKeyAt", Icons.IconKeyAt as IconComponent],
      ["IconKeyHash", Icons.IconKeyHash as IconComponent],
      ["IconKeyDollar", Icons.IconKeyDollar as IconComponent],
      ["IconKeyPercent", Icons.IconKeyPercent as IconComponent],
      ["IconKeyCaret", Icons.IconKeyCaret as IconComponent],
      ["IconKeyAmpersand", Icons.IconKeyAmpersand as IconComponent],
      ["IconKeyAsterisk", Icons.IconKeyAsterisk as IconComponent],
      ["IconKeyParenLeft", Icons.IconKeyParenLeft as IconComponent],
      ["IconKeyParenRight", Icons.IconKeyParenRight as IconComponent],
      ["IconKeyUnderscore", Icons.IconKeyUnderscore as IconComponent],
      ["IconKeyPlus", Icons.IconKeyPlus as IconComponent],
      ["IconKeyBraceLeft", Icons.IconKeyBraceLeft as IconComponent],
      ["IconKeyBraceRight", Icons.IconKeyBraceRight as IconComponent],
      ["IconKeyPipe", Icons.IconKeyPipe as IconComponent],
      ["IconKeyColon", Icons.IconKeyColon as IconComponent],
      ["IconKeyDoubleQuote", Icons.IconKeyDoubleQuote as IconComponent],
      ["IconKeyQuestion", Icons.IconKeyQuestion as IconComponent],
    ];

    return (
      <div className="w-full max-w-6xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foundation-text-dark-primary">
            Keyboard Shortcut Icons
          </h3>
          <p className="text-sm text-foundation-text-dark-secondary">
            Icons for keyboard keys and modifiers used in shortcut displays
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {keyboardIcons.map(([name, Icon]) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 rounded-md border border-foundation-text-light-primary/10 dark:border-foundation-text-dark-primary/10 bg-foundation-bg-dark-1 p-3"
            >
              <Icon className="size-8 text-foundation-text-dark-primary" />
              <span className="text-xs text-foundation-text-dark-secondary">{name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
