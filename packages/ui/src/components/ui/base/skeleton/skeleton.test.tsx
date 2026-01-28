import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  describe("Basic rendering", () => {
    it("renders with data-slot attribute", () => {
      render(<Skeleton />);
      const skeleton = document.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it("renders with default styling classes", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstElementChild;
      expect(skeleton).toHaveClass("bg-accent");
      expect(skeleton).toHaveClass("animate-pulse");
      expect(skeleton).toHaveClass("rounded-md");
    });

    it("applies custom className", () => {
      const { container } = render(<Skeleton className="w-32 h-8" />);
      const skeleton = container.firstElementChild;
      expect(skeleton).toHaveClass("w-32");
      expect(skeleton).toHaveClass("h-8");
    });
  });

  describe("Accessibility", () => {
    it("respects motion-reduce for accessibility", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstElementChild;
      expect(skeleton).toHaveClass("motion-reduce:animate-none");
    });
  });

  describe("Props passthrough", () => {
    it("passes through div props", () => {
      const { container } = render(<Skeleton data-testid="custom-skeleton" />);
      expect(container.querySelector('[data-testid="custom-skeleton"]')).toBeInTheDocument();
    });

    it("applies custom width and height via style", () => {
      const { container } = render(<Skeleton style={{ width: "100px", height: "50px" }} />);
      const skeleton = container.firstElementChild;
      expect(skeleton).toHaveStyle({ width: "100px", height: "50px" });
    });
  });
});
