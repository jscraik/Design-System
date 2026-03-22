import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Stack } from "./Stack";

describe("Stack", () => {
  it("renders with data-slot attribute", () => {
    render(<Stack>content</Stack>);
    expect(document.querySelector('[data-slot="stack"]')).toBeInTheDocument();
  });

  it("defaults to column direction", () => {
    const { container } = render(<Stack>content</Stack>);
    expect(container.firstChild).toHaveClass("flex-col");
  });

  it("applies row direction", () => {
    const { container } = render(<Stack direction="row">content</Stack>);
    expect(container.firstChild).toHaveClass("flex-row");
  });

  it("applies gap class", () => {
    const { container } = render(<Stack gap="6">content</Stack>);
    expect(container.firstChild).toHaveClass("gap-6");
  });

  it("applies align class", () => {
    const { container } = render(<Stack align="center">content</Stack>);
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("applies justify class", () => {
    const { container } = render(<Stack justify="between">content</Stack>);
    expect(container.firstChild).toHaveClass("justify-between");
  });

  it("applies wrap class when wrap=true", () => {
    const { container } = render(<Stack wrap>content</Stack>);
    expect(container.firstChild).toHaveClass("flex-wrap");
  });

  it("renders as a different element with as prop", () => {
    const { container } = render(
      <Stack as="ul">
        <li>item</li>
      </Stack>,
    );
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<Stack className="mt-8">content</Stack>);
    expect(container.firstChild).toHaveClass("mt-8");
  });
});
