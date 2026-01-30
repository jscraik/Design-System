import { render, screen, waitFor, fireEvent } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Image } from "./Image";

describe("Image", () => {
  const mockSrc = "https://example.com/image.jpg";
  const mockAlt = "Test image";
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders image with src and alt", () => {
      render(<Image src={mockSrc} alt={mockAlt} />);
      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", mockSrc);
      expect(img).toHaveAttribute("alt", mockAlt);
    });

    it("has data-slot attribute", () => {
      render(<Image src={mockSrc} alt={mockAlt} />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<Image src={mockSrc} alt={mockAlt} className="custom-class" />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toHaveClass("custom-class");
    });
  });

  describe("Aspect ratio", () => {
    it("applies square aspect ratio class", () => {
      render(<Image src={mockSrc} alt={mockAlt} aspectRatio="square" />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("aspect-square");
    });

    it("applies video aspect ratio class", () => {
      render(<Image src={mockSrc} alt={mockAlt} aspectRatio="video" />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("aspect-video");
    });

    it("does not apply aspect ratio class when auto", () => {
      render(<Image src={mockSrc} alt={mockAlt} aspectRatio="auto" />);
      const img = screen.getByRole("img");
      expect(img).not.toHaveClass("aspect-square");
      expect(img).not.toHaveClass("aspect-video");
    });

    it("applies aspect ratio to error state", () => {
      render(<Image src={mockSrc} alt={mockAlt} aspectRatio="square" error="Failed" />);
      const container = document.querySelector('[data-slot="image-error"]');
      expect(container).toHaveClass("aspect-square");
    });
  });

  describe("Object fit", () => {
    it("applies cover object fit class", () => {
      render(<Image src={mockSrc} alt={mockAlt} objectFit="cover" />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("object-cover");
    });

    it("applies contain object fit class", () => {
      render(<Image src={mockSrc} alt={mockAlt} objectFit="contain" />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("object-contain");
    });

    it("applies fill object fit class", () => {
      render(<Image src={mockSrc} alt={mockAlt} objectFit="fill" />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("object-fill");
    });

    it("applies none object fit class", () => {
      render(<Image src={mockSrc} alt={mockAlt} objectFit="none" />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("object-none");
    });
  });

  describe("Loading state", () => {
    it("shows shimmer when showLoadingState is true", () => {
      render(<Image src={mockSrc} alt={mockAlt} showLoadingState={true} />);
      // ShimmerInline renders a Skeleton with animate-pulse class
      const shimmer = document.querySelector('[data-slot="shimmer-inline"]');
      expect(shimmer).toBeInTheDocument();
    });

    it("does not show shimmer when showLoadingState is false", () => {
      render(<Image src={mockSrc} alt={mockAlt} showLoadingState={false} />);
      const shimmer = document.querySelector('[data-slot="shimmer-inline"]');
      expect(shimmer).not.toBeInTheDocument();
    });

    it("external loading overrides internal state", () => {
      render(<Image src={mockSrc} alt={mockAlt} loading={true} />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toHaveAttribute("data-state", "loading");
    });

    it("calls onLoad when image loads", async () => {
      const onLoad = vi.fn();
      render(<Image src={mockSrc} alt={mockAlt} onLoad={onLoad} />);
      const img = screen.getByRole("img");

      fireEvent.load(img);

      await waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });
    });

    it("removes shimmer after image loads", async () => {
      render(<Image src={mockSrc} alt={mockAlt} showLoadingState={true} />);
      const img = screen.getByRole("img");

      fireEvent.load(img);

      await waitFor(() => {
        expect(img).toHaveClass("opacity-100");
        expect(img).not.toHaveClass("opacity-0");
      });
    });
  });

  describe("Error state", () => {
    it("shows fallback when image fails to load", async () => {
      render(<Image src={mockSrc} alt={mockAlt} />);
      const img = screen.getByRole("img");

      fireEvent.error(img);

      await waitFor(() => {
        const container = document.querySelector('[data-slot="image-error"]');
        expect(container).toBeInTheDocument();
      });
    });

    it("calls onError when image fails", async () => {
      const onError = vi.fn();
      render(<Image src={mockSrc} alt={mockAlt} onError={onError} />);
      const img = screen.getByRole("img");

      fireEvent.error(img);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });

    it("shows default fallback icon", async () => {
      render(<Image src={mockSrc} alt={mockAlt} />);
      const img = screen.getByRole("img");

      fireEvent.error(img);

      await waitFor(() => {
        const icon = document.querySelector('[data-slot="image-error"] svg');
        expect(icon).toBeInTheDocument();
      });
    });

    it("shows custom fallback", async () => {
      const customFallback = <div data-testid="custom-fallback">Custom</div>;
      render(<Image src={mockSrc} alt={mockAlt} fallback={customFallback} />);
      const img = screen.getByRole("img");

      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
      });
    });

    it("external error overrides internal error", async () => {
      render(<Image src={mockSrc} alt={mockAlt} error="External error" />);
      const container = document.querySelector('[data-slot="image-error"]');

      await waitFor(() => {
        expect(container).toBeInTheDocument();
        expect(screen.getByText("External error")).toBeInTheDocument();
      });
    });

    it("uses external error message", () => {
      render(<Image src={mockSrc} alt={mockAlt} error="Failed to load" />);
      expect(screen.getByText("Failed to load")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(<Image src={mockSrc} alt={mockAlt} disabled onStateChange={mockOnStateChange} />);
      const img = screen.getByRole("img");

      // Fire load event to get past initial loading state
      fireEvent.load(img);

      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("has reduced opacity when disabled", () => {
      render(<Image src={mockSrc} alt={mockAlt} disabled />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toHaveClass("opacity-50");
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(<Image src={mockSrc} alt={mockAlt} required onStateChange={mockOnStateChange} />);
      const img = screen.getByRole("img");

      // Fire load event to get past initial loading state
      fireEvent.load(img);

      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("external loading takes priority over internal states", () => {
      render(<Image src={mockSrc} alt={mockAlt} loading={true} />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toHaveAttribute("data-state", "loading");
    });

    it("external error takes priority over internal loading", () => {
      render(<Image src={mockSrc} alt={mockAlt} error="External error" />);
      const container = document.querySelector('[data-slot="image-error"]');
      expect(container).toBeInTheDocument();
    });

    it("internal error takes priority over disabled", async () => {
      render(<Image src={mockSrc} alt={mockAlt} disabled />);
      const img = screen.getByRole("img");

      fireEvent.error(img);

      await waitFor(() => {
        const container = document.querySelector('[data-slot="image-error"]');
        expect(container).toHaveAttribute("data-state", "error");
      });
    });

    it("disabled takes priority over default", async () => {
      render(<Image src={mockSrc} alt={mockAlt} disabled />);
      const img = screen.getByRole("img");

      // Fire load event to get past initial loading state
      fireEvent.load(img);

      await waitFor(() => {
        const container = screen.getByRole("img").closest('[data-slot="image"]');
        expect(container).toHaveAttribute("data-state", "disabled");
      });
    });
  });

  describe("Accessibility", () => {
    it("has aria-disabled when disabled", () => {
      render(<Image src={mockSrc} alt={mockAlt} disabled />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toHaveAttribute("aria-disabled", "true");
    });

    it("has aria-invalid when error", () => {
      render(<Image src={mockSrc} alt={mockAlt} error="Failed" />);
      const container = document.querySelector('[data-slot="image-error"]');
      expect(container).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-busy when loading", () => {
      render(<Image src={mockSrc} alt={mockAlt} loading={true} />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-required when required", () => {
      render(<Image src={mockSrc} alt={mockAlt} required />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toHaveAttribute("aria-required", "true");
    });

    it("has data-state attribute reflecting current state", () => {
      render(<Image src={mockSrc} alt={mockAlt} loading={true} />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toHaveAttribute("data-state", "loading");
    });

    it("has data-error attribute when error", () => {
      render(<Image src={mockSrc} alt={mockAlt} error="Failed" />);
      const container = document.querySelector('[data-slot="image-error"]');
      expect(container).toHaveAttribute("data-error", "true");
    });

    it("has data-required attribute when required", () => {
      render(<Image src={mockSrc} alt={mockAlt} required />);
      const container = screen.getByRole("img").closest('[data-slot="image"]');
      expect(container).toHaveAttribute("data-required", "true");
    });

    it("passes through other HTML attributes", () => {
      render(<Image src={mockSrc} alt={mockAlt} data-testid="test-image" />);
      expect(screen.getByTestId("test-image")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("handles empty src", () => {
      render(<Image src="" alt={mockAlt} />);
      const img = screen.getByRole("img");
      // React doesn't render empty src attribute, so we just verify the img exists
      expect(img).toBeInTheDocument();
    });

    it("handles undefined src", () => {
      render(<Image src={undefined} alt={mockAlt} />);
      const img = screen.getByRole("img");
      // React doesn't render empty src attribute, so we just verify the img exists
      expect(img).toBeInTheDocument();
    });

    it("updates when src changes", () => {
      const { rerender } = render(<Image src={mockSrc} alt={mockAlt} />);
      const img = screen.getByRole("img");

      expect(img).toHaveAttribute("src", mockSrc);

      rerender(<Image src="https://example.com/new.jpg" alt={mockAlt} />);

      expect(img).toHaveAttribute("src", "https://example.com/new.jpg");
    });

    it("preserves internal state when src changes", async () => {
      const { rerender } = render(<Image src={mockSrc} alt={mockAlt} />);
      const img = screen.getByRole("img");

      // Simulate loading
      fireEvent.load(img);

      rerender(<Image src="https://example.com/new.jpg" alt={mockAlt} />);

      // Should be in loading state for new src
      expect(img).toHaveClass("opacity-0");
    });
  });
});
