import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../../../testing/utils";

import { Toast, ToastContainer } from "./toast";

describe("Toast", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Toast title="Test Toast" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Toast title="Test Toast" />);
      expect(screen.getByRole("alert")).toHaveAttribute("data-slot", "toast");
    });

    it("renders title", () => {
      render(<Toast title="Success!" />);
      expect(screen.getByText("Success!")).toBeInTheDocument();
    });

    it("renders description", () => {
      render(<Toast title="Title" description="This is a description" />);
      expect(screen.getByText("This is a description")).toBeInTheDocument();
    });

    it("renders icon", () => {
      render(<Toast title="Title" icon={<span data-testid="icon">✓</span>} />);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders action", () => {
      render(<Toast title="Title" action={<button>Undo</button>} />);
      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Toast title="Title" className="custom-class" />);
      expect(screen.getByRole("alert")).toHaveClass("custom-class");
    });
  });

  describe("variants", () => {
    it("renders default variant", () => {
      render(<Toast variant="default" title="Default" />);
      expect(screen.getByRole("alert")).toHaveClass("bg-card");
    });

    it("renders success variant", () => {
      render(<Toast variant="success" title="Success" />);
      expect(screen.getByRole("alert")).toHaveClass("bg-status-success-muted/10");
    });

    it("renders error variant", () => {
      render(<Toast variant="error" title="Error" />);
      expect(screen.getByRole("alert")).toHaveClass("bg-status-error-muted/10");
    });

    it("renders warning variant", () => {
      render(<Toast variant="warning" title="Warning" />);
      expect(screen.getByRole("alert")).toHaveClass("bg-status-warning/10");
    });

    it("renders info variant", () => {
      render(<Toast variant="info" title="Info" />);
      expect(screen.getByRole("alert")).toHaveClass("bg-interactive/10");
    });
  });

  describe("open state", () => {
    it("renders when open is true", () => {
      render(<Toast title="Title" open={true} />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("does not render when open is false", () => {
      render(<Toast title="Title" open={false} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("close button", () => {
    it("renders close button when onClose is provided", () => {
      render(<Toast title="Title" onClose={() => {}} />);
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", async () => {
      const onClose = vi.fn();
      const { user } = render(<Toast title="Title" onClose={onClose} />);

      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("auto-dismiss", () => {
    it("calls onClose after duration", async () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      render(<Toast title="Title" onClose={onClose} duration={1000} />);

      expect(onClose).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);

      expect(onClose).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it("does not auto-dismiss when duration is 0", async () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      render(<Toast title="Title" onClose={onClose} duration={0} />);

      vi.advanceTimersByTime(10000);

      expect(onClose).not.toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe("accessibility", () => {
    it("has correct alert role", () => {
      render(<Toast title="Title" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("has aria-live polite", () => {
      render(<Toast title="Title" />);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");
    });

    it("close button has accessible name", () => {
      render(<Toast title="Title" onClose={() => {}} />);
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });
  });
});

describe("ToastContainer", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(
        <ToastContainer>
          <Toast title="Toast 1" />
          <Toast title="Toast 2" />
        </ToastContainer>,
      );
      expect(screen.getAllByRole("alert")).toHaveLength(2);
    });

    it("renders with data-slot attribute", () => {
      const { container } = render(
        <ToastContainer>
          <Toast title="Toast" />
        </ToastContainer>,
      );
      expect(container.querySelector("[data-slot='toast-container']")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <ToastContainer className="custom-class">
          <Toast title="Toast" />
        </ToastContainer>,
      );
      expect(container.querySelector("[data-slot='toast-container']")).toHaveClass("custom-class");
    });
  });

  describe("positions", () => {
    it.each([
      ["top-left", "top-0 left-0"],
      ["top-center", "top-0 left-1/2"],
      ["top-right", "top-0 right-0"],
      ["bottom-left", "bottom-0 left-0"],
      ["bottom-center", "bottom-0 left-1/2"],
      ["bottom-right", "bottom-0 right-0"],
    ] as const)("renders %s position correctly", (position, expectedClasses) => {
      const { container } = render(
        <ToastContainer position={position}>
          <Toast title="Toast" />
        </ToastContainer>,
      );
      const toastContainer = container.querySelector("[data-slot='toast-container']");
      expectedClasses.split(" ").forEach((cls) => {
        expect(toastContainer).toHaveClass(cls);
      });
    });
  });
});
