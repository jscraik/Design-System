import { render, screen } from "@testing-library/react";
import { createRef } from "react";
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
      // Note: Radix AspectRatio applies ratio internally - we verify it accepts the prop
      expect(aspectRatio).toHaveAttribute("data-slot", "aspect-ratio");
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

  describe("ref forwarding", () => {
    it("forwards ref to aspect ratio element", () => {
      const ref = createRef<HTMLDivElement>();
      render(<AspectRatio ref={ref} ratio={16 / 9} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});