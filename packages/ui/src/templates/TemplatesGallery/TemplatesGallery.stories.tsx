import type { Meta, StoryObj } from "@storybook/react-vite";

import { blockRegistry } from "../blocks/registry";
import { templateRegistry } from "../registry";

const meta: Meta = {
  title: "Components/Templates/Gallery",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const Gallery: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background p-6 text-foreground">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10">
        <section className="space-y-4">
          <header className="space-y-1">
            <h2 className="text-lg font-semibold">Templates</h2>
            <p className="text-sm text-text-secondary">
              Registry-driven gallery of full templates.
            </p>
          </header>
          <div className="space-y-6">
            {templateRegistry.map(({ id, title, description, Component }) => (
              <div
                key={id}
                className="overflow-hidden rounded-2xl border border-border bg-secondary"
              >
                <div className="border-b border-border px-4 py-3">
                  <div className="text-sm font-semibold">{title}</div>
                  <p className="text-xs text-text-secondary">{description}</p>
                </div>
                <div className="h-[360px] w-full overflow-hidden">
                  <Component />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <header className="space-y-1">
            <h2 className="text-lg font-semibold">Blocks</h2>
            <p className="text-sm text-text-secondary">
              Reusable block building pieces from the block registry.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blockRegistry.map(({ id, title, description, Component }) => (
              <div key={id} className="rounded-2xl border border-border bg-secondary p-4">
                <div className="mb-3 space-y-1">
                  <div className="text-sm font-semibold">{title}</div>
                  <p className="text-xs text-text-secondary">{description}</p>
                </div>
                <div className="min-h-[140px] rounded-xl border border-border bg-background p-3">
                  <Component />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  ),
};
