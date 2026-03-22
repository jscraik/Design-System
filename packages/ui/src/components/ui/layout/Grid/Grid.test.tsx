import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Grid, GridItem } from "./Grid";

describe("Grid", () => {
  it("renders with data-slot attribute", () => {
    render(<Grid>content</Grid>);
    expect(document.querySelector('[data-slot="grid"]')).toBeInTheDocument();
  });

  it("applies grid class", () => {
    const { container } = render(<Grid>content</Grid>);
    expect(container.firstChild).toHaveClass("grid");
  });

  it("applies cols class", () => {
    const { container } = render(<Grid cols={3}>content</Grid>);
    expect(container.firstChild).toHaveClass("grid-cols-3");
  });

  it("applies gap class", () => {
    const { container } = render(<Grid gap="6">content</Grid>);
    expect(container.firstChild).toHaveClass("gap-6");
  });

  it("merges custom className", () => {
    const { container } = render(<Grid className="mt-4">content</Grid>);
    expect(container.firstChild).toHaveClass("mt-4");
  });

  it("renders as a different element with as prop", () => {
    const { container } = render(<Grid as="section">content</Grid>);
    expect(container.querySelector("section")).toBeInTheDocument();
  });
});

describe("GridItem", () => {
  it("renders with data-slot attribute", () => {
    render(<GridItem>content</GridItem>);
    expect(document.querySelector('[data-slot="grid-item"]')).toBeInTheDocument();
  });

  it("applies col-span class", () => {
    const { container } = render(<GridItem colSpan={2}>content</GridItem>);
    expect(container.firstChild).toHaveClass("col-span-2");
  });

  it("applies row-span class", () => {
    const { container } = render(<GridItem rowSpan={3}>content</GridItem>);
    expect(container.firstChild).toHaveClass("row-span-3");
  });
});
