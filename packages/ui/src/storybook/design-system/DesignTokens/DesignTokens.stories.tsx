import type { Meta, StoryObj } from "@storybook/react-vite";

import { borderRadius, colors, spacing } from "../../../utils/theme";

const meta: Meta = {
  title: "Documentation/Design System/Design Tokens",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Design tokens used throughout the ChatUI component library. These tokens ensure consistency across all components and enable easy theming.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foundation-text-dark-primary mb-4">Color Tokens</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foundation-text-dark-primary mb-3">
              Background Colors
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colors.bg).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border border-foundation-text-light-primary/10 dark:border-foundation-text-dark-primary/10"
                    style={{ backgroundColor: value }}
                  />
                  <div>
                    <div className="text-foundation-text-dark-primary font-medium">bg.{key}</div>
                    <div className="text-foundation-text-dark-tertiary text-sm font-mono">
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foundation-text-dark-primary mb-3">
              Text Colors
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colors.text).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border border-foundation-text-light-primary/10 dark:border-foundation-text-dark-primary/10 flex items-center justify-center bg-foundation-bg-dark-2">
                    <span style={{ color: value }}>Aa</span>
                  </div>
                  <div>
                    <div className="text-foundation-text-dark-primary font-medium">text.{key}</div>
                    <div className="text-foundation-text-dark-tertiary text-sm font-mono">
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foundation-text-dark-primary mb-3">
              Accent Colors
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colors.accent).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: value }} />
                  <div>
                    <div className="text-foundation-text-dark-primary font-medium">
                      accent.{key}
                    </div>
                    <div className="text-foundation-text-dark-tertiary text-sm font-mono">
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foundation-text-dark-primary mb-4">
          Spacing Tokens
        </h2>
        <div className="space-y-4">
          {Object.entries(spacing).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-20 text-foundation-text-dark-primary font-medium">
                spacing.{key}
              </div>
              <div className="text-foundation-text-dark-tertiary text-sm font-mono w-16">
                {value}
              </div>
              <div className="bg-foundation-accent-blue h-4" style={{ width: value }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foundation-text-dark-primary mb-4">
          Border Radius Tokens
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(borderRadius).map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className="w-16 h-16 bg-foundation-accent-green mx-auto mb-2"
                style={{ borderRadius: value }}
              />
              <div className="text-foundation-text-dark-primary font-medium">radius.{key}</div>
              <div className="text-foundation-text-dark-tertiary text-sm font-mono">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Usage: Story = {
  render: () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foundation-text-dark-primary mb-4">
          Usage Examples
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foundation-text-dark-primary mb-3">
              In Components
            </h3>
            <pre className="bg-foundation-bg-dark-2 p-4 rounded-lg text-foundation-text-dark-secondary text-sm overflow-x-auto">
              {`import { colors, spacing } from "@chatui/ui";

const styles = {
  backgroundColor: colors.bg.dark1,
  color: colors.text.darkPrimary,
  padding: spacing.md,
  borderRadius: borderRadius.lg,
};`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foundation-text-dark-primary mb-3">
              CSS Custom Properties
            </h3>
            <pre className="bg-foundation-bg-dark-2 p-4 rounded-lg text-foundation-text-dark-secondary text-sm overflow-x-auto">
              {`.my-component {
  background-color: var(--foundation-bg-dark-1);
  color: var(--foundation-text-dark-primary);
  border: 1px solid var(--foundation-accent-blue);
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foundation-text-dark-primary mb-3">
              Tailwind Classes
            </h3>
            <pre className="bg-foundation-bg-dark-2 p-4 rounded-lg text-foundation-text-dark-secondary text-sm overflow-x-auto">
              {`<div className="bg-[var(--foundation-bg-dark-1)] text-[var(--foundation-text-dark-primary)] p-4 rounded-lg">
  Content with design tokens
</div>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  ),
};
