import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  describe("Rendering", () => {
    it("renders with data-slot attribute", () => {
      render(<Spinner />);
      expect(document.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
    });

    it("renders with role=status", () => {
      render(<Spinner />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("renders with default aria-label", () => {
      render(<Spinner />);
      expect(screen.getByLabelText("Loading…")).toBeInTheDocument();
    });

    it("renders with custom aria-label", () => {
      render(<Spinner label="Fetching data…" />);
      expect(screen.getByLabelText("Fetching data…")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("applies size class", () => {
      render(<Spinner size="lg" />);
      expect(screen.getByRole("status")).toHaveClass("size-8");
    });

    it("applies variant class", () => {
      render(<Spinner variant="primary" />);
      expect(screen.getByRole("status")).toHaveClass("text-interactive");
    });

    it("merges custom className", () => {
      render(<Spinner className="my-custom-class" />);
      expect(screen.getByRole("status")).toHaveClass("my-custom-class");
    });
  });

  describe("Accessibility", () => {
    it("has motion-reduce class for reduced motion support", () => {
      render(<Spinner />);
      expect(screen.getByRole("status")).toHaveClass("motion-reduce:animate-none");
    });
  });
});
