import { Button, ProductDataView, ProductPageShell, ProductPanel } from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ProductDataView> = {
  title: "Components/UI/Layout/Product Composition",
  component: ProductDataView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ProductDataView>;

const runs = [
  { name: "Design lint", status: "Passed", owner: "Agent design" },
  { name: "Exemplar evaluation", status: "Queued", owner: "Policy" },
  { name: "Visual review", status: "Ready", owner: "Storybook" },
];

function RunRows() {
  return (
    <div className="divide-y divide-border rounded-md border border-border">
      {runs.map((run) => (
        <div key={run.name} className="grid gap-1 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-body font-medium text-foreground">{run.name}</p>
            <p className="text-body-small text-text-secondary">{run.owner}</p>
          </div>
          <span className="text-body-small text-muted-foreground">{run.status}</span>
        </div>
      ))}
    </div>
  );
}

export const DataViewReady: Story = {
  render: () => (
    <ProductDataView title="Agent runs" description="Recent verification work">
      <RunRows />
    </ProductDataView>
  ),
};

export const DataViewLoading: Story = {
  render: () => (
    <ProductDataView
      title="Agent runs"
      description="Recent verification work"
      state="loading"
      loadingLabel="Loading agent runs"
    >
      <RunRows />
    </ProductDataView>
  ),
};

export const DataViewEmpty: Story = {
  render: () => (
    <ProductDataView
      title="Agent runs"
      description="Recent verification work"
      state="empty"
      emptyTitle="No runs yet"
      emptyDescription="Verification runs will appear here after the first agent pass."
    >
      <RunRows />
    </ProductDataView>
  ),
};

export const DataViewError: Story = {
  render: () => (
    <ProductDataView
      title="Agent runs"
      description="Recent verification work"
      state="error"
      errorTitle="Could not load runs"
      errorDescription="Retry after the current validation job finishes."
      action={<Button size="sm">Retry</Button>}
    >
      <RunRows />
    </ProductDataView>
  ),
};

export const PageShellWithSidebarAndFooter: Story = {
  render: () => (
    <ProductPageShell
      title="Agent design workspace"
      description="A full product shell with navigation, data view, and status footer."
      sidebar={
        <ProductPanel title="Review lanes" density="compact" tone="muted">
          <nav aria-label="Review lanes" className="grid gap-2 text-body-small">
            <a className="ds-focusable text-interactive" href="#active">
              Active
            </a>
            <a className="ds-focusable text-muted-foreground" href="#blocked">
              Blocked
            </a>
            <a className="ds-focusable text-muted-foreground" href="#done">
              Done
            </a>
          </nav>
        </ProductPanel>
      }
      footer={
        <div className="text-body-small text-text-secondary">
          Last checked by the agent design contract.
        </div>
      }
    >
      <ProductPanel title="Verification" description="Current quality gate status">
        <ProductDataView title="Agent runs" description="Recent verification work">
          <RunRows />
        </ProductDataView>
      </ProductPanel>
    </ProductPageShell>
  ),
};
