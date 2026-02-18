import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TextLink } from "./TextLink";

describe("TextLink", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<TextLink href="/test">Link</TextLink>);
      const link = container.querySelector('[data-slot="text-link"]');
      expect(link).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(<TextLink href="/test">Test Link</TextLink>);
      expect(screen.getByText("Test Link")).toBeInTheDocument();
    });

    it("renders as anchor tag", () => {
      const { container } = render(<TextLink href="/test">Link</TextLink>);
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
    });

    it("renders with href", () => {
      const { container } = render(<TextLink href="/test">Link</TextLink>);
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("href", "/test");
    });

    it("applies custom className", () => {
      const { container } = render(
        <TextLink href="/test" className="custom-link">
          Link
        </TextLink>,
      );
      const link = container.querySelector(".custom-link");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("renders with default variant", () => {
      const { container } = render(<TextLink href="/test">Link</TextLink>);
      const link = container.querySelector('[data-slot="text-link"]');
      expect(link).toHaveClass("text-interactive");
    });

    it("renders with subtle variant", () => {
      const { container } = render(
        <TextLink href="/test" variant="subtle">
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-slot="text-link"]');
      expect(link).toHaveClass("text-muted-foreground");
    });

    it("renders with inline variant", () => {
      const { container } = render(
        <TextLink href="/test" variant="inline">
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-slot="text-link"]');
      expect(link).toHaveClass("underline");
    });

    it("renders with nav variant", () => {
      const { container } = render(
        <TextLink href="/test" variant="nav">
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-slot="text-link"]');
      expect(link).toHaveClass("no-underline");
    });

    it("renders with destructive variant", () => {
      const { container } = render(
        <TextLink href="/test" variant="destructive">
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-slot="text-link"]');
      expect(link).toHaveClass("text-status-error");
    });
  });

  describe("Sizes", () => {
    it("renders with sm size", () => {
      const { container } = render(
        <TextLink href="/test" size="sm">
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-slot="text-link"]');
      expect(link).toHaveClass("text-sm");
    });

    it("renders with md size (default)", () => {
      const { container } = render(<TextLink href="/test">Link</TextLink>);
      const link = container.querySelector('[data-slot="text-link"]');
      expect(link).toHaveClass("text-base");
    });

    it("renders with lg size", () => {
      const { container } = render(
        <TextLink href="/test" size="lg">
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-slot="text-link"]');
      expect(link).toHaveClass("text-lg");
    });
  });

  describe("External link behavior", () => {
    it("adds target and rel for external links when external is true", () => {
      const { container } = render(
        <TextLink href="http://example.com" external>
          Link
        </TextLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("adds target and rel for http links", () => {
      const { container } = render(<TextLink href="http://example.com">Link</TextLink>);
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("adds target and rel for https links", () => {
      const { container } = render(<TextLink href="https://example.com">Link</TextLink>);
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("does not add target and rel for relative links", () => {
      const { container } = render(<TextLink href="/test">Link</TextLink>);
      const link = container.querySelector("a");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });

    it("enforces security attributes when target is manually set to _blank", () => {
      const { container } = render(
        <TextLink href="/test" target="_blank">
          Link
        </TextLink>,
      );
      const link = container.querySelector("a");
      // Security: target="_blank" should always have rel="noopener noreferrer"
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("External icon", () => {
    it("shows external icon when showExternalIcon is true for external link", () => {
      const { container } = render(
        <TextLink href="https://example.com" showExternalIcon>
          Link
        </TextLink>,
      );
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("does not show external icon when showExternalIcon is false", () => {
      const { container } = render(
        <TextLink href="https://example.com" showExternalIcon={false}>
          Link
        </TextLink>,
      );
      const icon = container.querySelector("svg");
      expect(icon).not.toBeInTheDocument();
    });

    it("does not show external icon for relative links", () => {
      const { container } = render(
        <TextLink href="/test" showExternalIcon>
          Link
        </TextLink>,
      );
      const icon = container.querySelector("svg");
      expect(icon).not.toBeInTheDocument();
    });

    it("external icon renders correctly", () => {
      const { container } = render(
        <TextLink href="https://example.com" showExternalIcon>
          Link
        </TextLink>,
      );
      // IconArrowTopRightSm wraps svg in a div with the className
      const iconWrapper = container.querySelector("div.size-3\\.5");
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("shows loading state", () => {
      const { container } = render(
        <TextLink href="/test" loading>
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-state="loading"]');
      expect(link).toBeInTheDocument();
    });

    it("calls onStateChange with 'loading'", async () => {
      render(
        <TextLink href="/test" loading onStateChange={mockOnStateChange}>
          Link
        </TextLink>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("shows error state", () => {
      const { container } = render(
        <TextLink href="/test" error="Error">
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-state="error"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("data-error", "true");
    });

    it("applies error styling", () => {
      const { container } = render(
        <TextLink href="/test" error="Error">
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-state="error"]');
      expect(link).toHaveClass("text-status-error");
    });

    it("sets aria-invalid when error", () => {
      const { container } = render(
        <TextLink href="/test" error="Error">
          Link
        </TextLink>,
      );
      const link = container.querySelector('[aria-invalid="true"]');
      expect(link).toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("shows disabled state", () => {
      const { container } = render(
        <TextLink href="/test" disabled>
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-state="disabled"]');
      expect(link).toBeInTheDocument();
    });

    it("removes href when disabled", () => {
      const { container } = render(
        <TextLink href="/test" disabled>
          Link
        </TextLink>,
      );
      const link = container.querySelector("a");
      expect(link).not.toHaveAttribute("href");
    });

    it("applies disabled styling", () => {
      const { container } = render(
        <TextLink href="/test" disabled>
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-state="disabled"]');
      expect(link).toHaveClass("pointer-events-none");
      expect(link).toHaveClass("opacity-50");
    });

    it("sets aria-disabled when disabled", () => {
      const { container } = render(
        <TextLink href="/test" disabled>
          Link
        </TextLink>,
      );
      const link = container.querySelector('[aria-disabled="true"]');
      expect(link).toBeInTheDocument();
    });

    it("does not show external icon when disabled", () => {
      const { container } = render(
        <TextLink href="https://example.com" showExternalIcon disabled>
          Link
        </TextLink>,
      );
      const icon = container.querySelector("svg");
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Required", () => {
    it("sets required data attribute", () => {
      const { container } = render(
        <TextLink href="/test" required>
          Link
        </TextLink>,
      );
      const link = container.querySelector('[data-required="true"]');
      expect(link).toBeInTheDocument();
    });

    it("sets aria-required when required", () => {
      const { container } = render(
        <TextLink href="/test" required>
          Link
        </TextLink>,
      );
      const link = container.querySelector('[aria-required="true"]');
      expect(link).toBeInTheDocument();
    });

    it("sets aria-invalid to false when required but no error", () => {
      const { container } = render(
        <TextLink href="/test" required>
          Link
        </TextLink>,
      );
      const link = container.querySelector('[aria-invalid="false"]');
      expect(link).toBeInTheDocument();
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <TextLink href="/test" loading error="Error" disabled onStateChange={mockOnStateChange}>
          Link
        </TextLink>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <TextLink href="/test" error="Error" disabled onStateChange={mockOnStateChange}>
          Link
        </TextLink>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Keyboard navigation", () => {
    it("can be focused with keyboard", () => {
      const { container } = render(<TextLink href="/test">Link</TextLink>);
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("href");
    });

    it("disabled link cannot be focused", () => {
      const { container } = render(
        <TextLink href="/test" disabled>
          Link
        </TextLink>,
      );
      const link = container.querySelector("a");
      // Disabled links have href removed
      expect(link).not.toHaveAttribute("href");
    });
  });

  describe("Accessibility", () => {
    it("has accessible name from link text", () => {
      render(<TextLink href="/test">Read documentation</TextLink>);
      const link = screen.getByRole("link", { name: "Read documentation" });
      expect(link).toBeInTheDocument();
    });

    it("external links have security attributes", () => {
      render(<TextLink href="https://example.com">External</TextLink>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("disabled links have aria-disabled", () => {
      const { container } = render(
        <TextLink href="/test" disabled>
          Link
        </TextLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to anchor element", () => {
      const ref = createRef<HTMLAnchorElement>();
      render(
        <TextLink href="/test" ref={ref}>
          Link
        </TextLink>,
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });
});
