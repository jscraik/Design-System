import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ProductDataView,
  ProductPageShell,
  ProductPanel,
  ProductSection,
  ProductStateWrapper,
} from "./ProductComposition";

describe("ProductPageShell", () => {
  it("renders a semantic page shell with header and main slots", () => {
    render(
      <ProductPageShell title="Projects" description="Manage active work">
        <div>Project list</div>
      </ProductPageShell>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("Manage active work")).toHaveClass("text-text-secondary");
    expect(document.querySelector('[data-slot="page-shell"]')).toHaveClass("min-h-dvh");
    expect(document.querySelector('[data-slot="page-shell-main"]')).toHaveTextContent(
      "Project list",
    );
  });

  it("renders sidebar and footer slots when provided", () => {
    render(
      <ProductPageShell
        sidebar={<nav>Filters</nav>}
        sidebarClassName="lg:w-80"
        mainClassName="overflow-hidden"
        footer={<span>Status</span>}
      >
        <div>Content</div>
      </ProductPageShell>,
    );

    expect(document.querySelector('[data-slot="page-shell-sidebar"]')).toHaveTextContent("Filters");
    expect(document.querySelector('[data-slot="page-shell-sidebar"]')).toHaveClass("lg:w-80");
    expect(document.querySelector('[data-slot="page-shell-main"]')).toHaveClass("overflow-hidden");
    expect(document.querySelector('[data-slot="page-shell-footer"]')).toHaveTextContent("Status");
  });
});

describe("ProductPanel", () => {
  it("renders panel title, body, and footer slots", () => {
    render(
      <ProductPanel
        title="Usage"
        description="Current month"
        bodyClassName="grid"
        footer={<button type="button">Export</button>}
      >
        <p>Usage table</p>
      </ProductPanel>,
    );

    expect(document.querySelector('[data-slot="product-panel"]')).toHaveClass("rounded-lg");
    expect(screen.getByRole("heading", { level: 3, name: "Usage" })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="product-panel-body"]')).toHaveTextContent(
      "Usage table",
    );
    expect(document.querySelector('[data-slot="product-panel-body"]')).toHaveClass("grid");
    expect(document.querySelector('[data-slot="product-panel-footer"]')).toHaveTextContent(
      "Export",
    );
  });
});

describe("ProductSection", () => {
  it("renders a named section with agent-safe spacing", () => {
    render(
      <ProductSection title="Security" description="Protect the account">
        <div>Rows</div>
      </ProductSection>,
    );

    expect(document.querySelector('[data-slot="product-section"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Security" })).toBeInTheDocument();
  });
});

describe("ProductStateWrapper", () => {
  it("renders children for the ready state", () => {
    render(<ProductStateWrapper>Loaded content</ProductStateWrapper>);
    expect(document.querySelector('[data-slot="state-wrapper"]')).toHaveTextContent(
      "Loaded content",
    );
  });

  it("renders an accessible loading state", () => {
    render(
      <ProductStateWrapper state="loading" loadingLabel="Loading projects">
        Loaded content
      </ProductStateWrapper>,
    );
    expect(document.querySelector('[data-slot="state-wrapper"]')).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByRole("status", { name: "Loading projects" })).toBeInTheDocument();
  });

  it("renders an error alert", () => {
    render(
      <ProductStateWrapper
        state="error"
        errorTitle="Could not load projects"
        errorDescription="Refresh the page"
      >
        Loaded content
      </ProductStateWrapper>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Could not load projects");
    expect(screen.getByRole("alert")).toHaveTextContent("Refresh the page");
  });

  it("renders an empty state", () => {
    render(
      <ProductStateWrapper
        state="empty"
        emptyTitle="No projects"
        emptyDescription="Create one to begin"
      >
        Loaded content
      </ProductStateWrapper>,
    );

    expect(document.querySelector('[data-slot="state-wrapper"]')).toHaveTextContent("No projects");
    expect(document.querySelector('[data-slot="state-wrapper"]')).toHaveTextContent(
      "Create one to begin",
    );
  });
});

describe("ProductDataView", () => {
  it("combines section hierarchy with state handling", () => {
    render(
      <ProductDataView title="Runs" description="Recent jobs">
        <div>Run table</div>
      </ProductDataView>,
    );

    expect(document.querySelector('[data-slot="data-view"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Runs" })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="state-wrapper"]')).toHaveTextContent("Run table");
  });
});
