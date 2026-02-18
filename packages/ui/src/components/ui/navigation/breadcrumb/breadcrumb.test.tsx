import { describe, expect, it } from "vitest";

import { render, screen } from "../../../../testing/utils";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./fallback/Breadcrumb";

describe("Breadcrumb", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("navigation")).toHaveAttribute("data-slot", "breadcrumb");
    });

    it("has aria-label Breadcrumb", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Breadcrumb");
    });
  });

  describe("BreadcrumbList", () => {
    it("renders as ordered list", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("list")).toHaveAttribute("data-slot", "breadcrumb-list");
    });

    it("applies custom className", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList className="custom-class">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("list")).toHaveClass("custom-class");
    });
  });

  describe("BreadcrumbItem", () => {
    it("renders as list item", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("listitem")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("listitem")).toHaveAttribute("data-slot", "breadcrumb-item");
    });
  });

  describe("BreadcrumbLink", () => {
    it("renders as anchor", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test">Test</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("link")).toHaveAttribute("href", "/test");
    });

    it("renders with data-slot attribute", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("link")).toHaveAttribute("data-slot", "breadcrumb-link");
    });

    it("supports asChild prop", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button type="button">Custom</button>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("BreadcrumbPage", () => {
    it("renders current page", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByText("Current")).toBeInTheDocument();
    });

    it("has aria-current page", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByText("Current")).toHaveAttribute("aria-current", "page");
    });

    it("has aria-disabled true", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByText("Current")).toHaveAttribute("aria-disabled", "true");
    });

    it("renders with data-slot attribute", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByText("Current")).toHaveAttribute("data-slot", "breadcrumb-page");
    });
  });

  describe("BreadcrumbSeparator", () => {
    it("renders separator", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(2); // Separator has role="presentation"
    });

    it("has aria-hidden true", () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator data-testid="separator" />
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(container.querySelector("[data-testid='separator']")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    it("renders custom separator content", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByText("/")).toBeInTheDocument();
    });
  });

  describe("BreadcrumbEllipsis", () => {
    it("renders ellipsis", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByText("More")).toBeInTheDocument();
    });

    it("has aria-hidden true", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis data-testid="ellipsis" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByTestId("ellipsis")).toHaveAttribute("aria-hidden", "true");
    });

    it("has sr-only text for screen readers", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByText("More")).toHaveClass("sr-only");
    });
  });

  describe("complete breadcrumb", () => {
    it("renders a complete breadcrumb trail", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
      expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/products");
      expect(screen.getByText("Current Product")).toHaveAttribute("aria-current", "page");
    });
  });
});
