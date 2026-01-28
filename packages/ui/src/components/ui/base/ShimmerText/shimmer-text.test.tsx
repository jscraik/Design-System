import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShimmerText, ShimmerInline } from "./ShimmerText";

describe("ShimmerText", () => {
  describe("Basic rendering", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<ShimmerText />);
      const shimmer = container.querySelector('[data-slot="shimmer-text"]');
      expect(shimmer).toBeInTheDocument();
    });

    it("renders default number of lines (3)", () => {
      const { container } = render(<ShimmerText />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBe(3);
    });

    it("renders custom number of lines", () => {
      const { container } = render(<ShimmerText lines={5} />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBe(5);
    });

    it("renders with line height sm", () => {
      const { container } = render(<ShimmerText lineHeight="sm" />);
      const skeletons = container.querySelectorAll(".h-3");
      expect(skeletons.length).toBe(3);
    });

    it("renders with line height md (default)", () => {
      const { container } = render(<ShimmerText lineHeight="md" />);
      const skeletons = container.querySelectorAll(".h-4");
      expect(skeletons.length).toBe(3);
    });

    it("renders with line height lg", () => {
      const { container } = render(<ShimmerText lineHeight="lg" />);
      const skeletons = container.querySelectorAll(".h-5");
      expect(skeletons.length).toBe(3);
    });

    it("applies custom className", () => {
      const { container } = render(<ShimmerText className="custom-shimmer" />);
      const shimmer = container.querySelector(".custom-shimmer");
      expect(shimmer).toBeInTheDocument();
    });
  });

  describe("Width calculation", () => {
    it("decreases width for each line", () => {
      const { container } = render(<ShimmerText lines={3} />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      const firstSkeleton = skeletons[0];
      const lastSkeleton = skeletons[2];

      // First line should be wider than last line
      const firstWidth = parseInt(firstSkeleton?.style.width || "0");
      const lastWidth = parseInt(lastSkeleton?.style.width || "0");
      expect(firstWidth).toBeGreaterThan(lastWidth);
    });
  });

  describe("Accessibility", () => {
    it("has role status", () => {
      const { container } = render(<ShimmerText />);
      const shimmer = container.querySelector('[role="status"]');
      expect(shimmer).toBeInTheDocument();
    });

    it("has aria-label", () => {
      const { container } = render(<ShimmerText />);
      const shimmer = container.querySelector('[aria-label="Loading content"]');
      expect(shimmer).toBeInTheDocument();
    });

    it("has screen reader text", () => {
      render(<ShimmerText />);
      const srText = screen.getByText("Loading...");
      expect(srText).toBeInTheDocument();
    });
  });

  describe("Props passthrough", () => {
    it("passes through div props", () => {
      const { container } = render(<ShimmerText data-testid="custom-shimmer" />);
      expect(container.querySelector('[data-testid="custom-shimmer"]')).toBeInTheDocument();
    });
  });
});

describe("ShimmerInline", () => {
  describe("Basic rendering", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<ShimmerInline />);
      const shimmer = container.querySelector('[data-slot="shimmer-inline"]');
      expect(shimmer).toBeInTheDocument();
    });

    it("renders with default width", () => {
      const { container } = render(<ShimmerInline />);
      const shimmer = container.querySelector('[data-slot="shimmer-inline"]');
      expect(shimmer).toHaveStyle({ width: "100%" });
    });

    it("renders with string width", () => {
      const { container } = render(<ShimmerInline width="50%" />);
      const shimmer = container.querySelector('[data-slot="shimmer-inline"]');
      expect(shimmer).toHaveStyle({ width: "50%" });
    });

    it("renders with number width (converted to px)", () => {
      const { container } = render(<ShimmerInline width={200} />);
      const shimmer = container.querySelector('[data-slot="shimmer-inline"]');
      expect(shimmer).toHaveStyle({ width: "200px" });
    });

    it("renders with default height", () => {
      const { container } = render(<ShimmerInline />);
      const shimmer = container.querySelector('[data-slot="shimmer-inline"]');
      expect(shimmer).toHaveStyle({ height: "1rem" });
    });

    it("renders with string height", () => {
      const { container } = render(<ShimmerInline height="2rem" />);
      const shimmer = container.querySelector('[data-slot="shimmer-inline"]');
      expect(shimmer).toHaveStyle({ height: "2rem" });
    });

    it("renders with number height (converted to px)", () => {
      const { container } = render(<ShimmerInline height={40} />);
      const shimmer = container.querySelector('[data-slot="shimmer-inline"]');
      expect(shimmer).toHaveStyle({ height: "40px" });
    });

    it("applies custom className", () => {
      const { container } = render(<ShimmerInline className="custom-inline" />);
      const shimmer = container.querySelector(".custom-inline");
      expect(shimmer).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has role status", () => {
      const { container } = render(<ShimmerInline />);
      const shimmer = container.querySelector('[role="status"]');
      expect(shimmer).toBeInTheDocument();
    });

    it("has aria-label", () => {
      const { container } = render(<ShimmerInline />);
      const shimmer = container.querySelector('[aria-label="Loading"]');
      expect(shimmer).toBeInTheDocument();
    });

    it("has screen reader text", () => {
      render(<ShimmerInline />);
      const srText = screen.getByText("Loading...");
      expect(srText).toBeInTheDocument();
    });
  });

  describe("Props passthrough", () => {
    it("passes through div props", () => {
      const { container } = render(<ShimmerInline data-testid="custom-inline" />);
      expect(container.querySelector('[data-testid="custom-inline"]')).toBeInTheDocument();
    });
  });
});
