import { describe, expect, it } from "vitest";

import { render, screen } from "../../../../test/utils";

import { Badge } from "./badge";

describe("Badge", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText("New")).toHaveAttribute("data-slot", "badge");
    });

    it("applies custom className", () => {
      render(<Badge className="custom-class">New</Badge>);
      expect(screen.getByText("New")).toHaveClass("custom-class");
    });

    it("renders as span by default", () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText("New").tagName).toBe("SPAN");
    });
  });

  describe("variants", () => {
    it("renders default variant with correct styles", () => {
      render(<Badge variant="default">Default</Badge>);
      expect(screen.getByText("Default")).toHaveClass("bg-foundation-accent-blue");
    });

    it("renders secondary variant with correct styles", () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText("Secondary")).toHaveClass("bg-foundation-bg-light-2");
    });

    it("renders destructive variant with correct styles", () => {
      render(<Badge variant="destructive">Destructive</Badge>);
      expect(screen.getByText("Destructive")).toHaveClass("bg-foundation-accent-red");
    });

    it("renders outline variant with correct styles", () => {
      render(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText("Outline")).toHaveClass("border-foundation-bg-light-3");
    });
  });

  describe("asChild", () => {
    it("renders as child element when asChild is true", () => {
      render(
        <Badge asChild>
          <a href="/test">Link Badge</a>
        </Badge>,
      );
      const link = screen.getByRole("link", { name: "Link Badge" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("applies badge styles to child element", () => {
      render(
        <Badge asChild variant="destructive">
          <button type="button">Button Badge</button>
        </Badge>,
      );
      expect(screen.getByRole("button")).toHaveClass("bg-foundation-accent-red");
    });
  });

  describe("accessibility", () => {
    it("supports aria-label", () => {
      render(<Badge aria-label="Status: New">New</Badge>);
      expect(screen.getByText("New")).toHaveAttribute("aria-label", "Status: New");
    });

    it("has visible focus indicator styles when focusable", () => {
      render(
        <Badge asChild>
          <button type="button">Focusable</button>
        </Badge>,
      );
      expect(screen.getByRole("button")).toHaveClass("focus-visible:ring-2");
    });
  });

  describe("content", () => {
    it("renders with icon", () => {
      render(
        <Badge>
          <span data-testid="icon">✓</span>
          Success
        </Badge>,
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Success")).toBeInTheDocument();
    });

    it("truncates long content", () => {
      render(<Badge>Very long badge content that should be truncated</Badge>);
      expect(screen.getByText("Very long badge content that should be truncated")).toHaveClass(
        "overflow-hidden",
      );
    });
  });
});
