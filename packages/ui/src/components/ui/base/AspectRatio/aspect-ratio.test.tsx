import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AspectRatio } from "./fallback/AspectRatio";

describe("AspectRatio", () => {
  describe("Basic rendering", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<AspectRatio ratio={16 / 9} />);
      const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]');
      expect(aspectRatio).toBeInTheDocument();
    });

    it("passes ratio prop to Radix primitive", () => {
      const { container } = render(<AspectRatio ratio={16 / 9} />);
      const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]');
      expect(aspectRatio).toBeInTheDocument();
    });

    it("renders children content", () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <div data-testid="content">Content</div>
        </AspectRatio>
      );
      expect(container.querySelector('[data-testid="content"]')).toBeInTheDocument();
    });
  });

  describe("Props passthrough", () => {
    it("applies custom className", () => {
      const { container } = render(<AspectRatio ratio={16 / 9} className="custom-class" />);
      const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]');
      expect(aspectRatio).toHaveClass("custom-class");
    });

    it("passes through other div props", () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9} data-testid="custom-aspect-ratio" />
      );
      expect(container.querySelector('[data-testid="custom-aspect-ratio"]')).toBeInTheDocument();
    });
  });
});
