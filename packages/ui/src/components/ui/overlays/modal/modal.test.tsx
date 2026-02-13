import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../../testing/utils";
import { ModalBody, ModalDialog, ModalFooter, ModalHeader } from "./Modal";

describe("ModalDialog", () => {
  const mockOnClose = vi.fn();
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders modal dialog when isOpen is true", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Modal Content</div>
        </ModalDialog>,
      );
      expect(screen.getByText("Modal Content")).toBeInTheDocument();
    });

    it("does not render modal dialog when isOpen is false", () => {
      render(
        <ModalDialog isOpen={false} onClose={mockOnClose} title="Test Modal">
          <div>Modal Content</div>
        </ModalDialog>,
      );
      expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
    });

    it("renders modal with data-slot attribute", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </ModalDialog>,
      );
      const modal = container.querySelector('[data-slot="modal"]');
      expect(modal).toBeInTheDocument();
    });

    it("renders dialog with role='dialog'", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    it("renders overlay by default", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </ModalDialog>,
      );
      const overlay = container.querySelector('[aria-hidden="true"]');
      expect(overlay).toBeInTheDocument();
    });

    it("does not render overlay when showOverlay is false", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Modal" showOverlay={false}>
          <div>Content</div>
        </ModalDialog>,
      );
      const overlay = container.querySelector('[aria-hidden="true"]');
      expect(overlay).not.toBeInTheDocument();
    });

    it("renders with custom maxWidth", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Modal" maxWidth="800px">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveAttribute("style", expect.stringContaining("max-width: 800px"));
    });
  });

  describe("Open/Close state transitions", () => {
    it("renders when isOpen changes from false to true", () => {
      const { rerender } = render(
        <ModalDialog isOpen={false} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </ModalDialog>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();

      rerender(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </ModalDialog>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("removes from DOM when isOpen changes to false", () => {
      const { rerender } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </ModalDialog>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();

      rerender(
        <ModalDialog isOpen={false} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </ModalDialog>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <ModalDialog
          isOpen={true}
          onClose={mockOnClose}
          loading
          onStateChange={mockOnStateChange}
          title="Test"
        >
          <div>Content</div>
        </ModalDialog>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("shows loading overlay when loading", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} loading title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("sets aria-busy when loading", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} loading title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const modal = container.querySelector('[aria-busy="true"]');
      expect(modal).toBeInTheDocument();
    });

    it("applies pulse animation when loading", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} loading title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass("animate-pulse");
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <ModalDialog
          isOpen={true}
          onClose={mockOnClose}
          error="Error message"
          onStateChange={mockOnStateChange}
          title="Test"
        >
          <div>Content</div>
        </ModalDialog>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("shows error message when error", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} error="Something went wrong" title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("sets aria-invalid when error", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} error="Error" title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const modal = container.querySelector('[aria-invalid="true"]');
      expect(modal).toBeInTheDocument();
    });

    it("sets data-error attribute when error", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} error="Error" title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const modal = container.querySelector('[data-error="true"]');
      expect(modal).toBeInTheDocument();
    });

    it("applies error ring when error", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} error="Error" title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass("ring-2");
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <ModalDialog
          isOpen={true}
          onClose={mockOnClose}
          disabled
          onStateChange={mockOnStateChange}
          title="Test"
        >
          <div>Content</div>
        </ModalDialog>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("sets aria-disabled when disabled", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} disabled title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const modal = container.querySelector('[aria-disabled="true"]');
      expect(modal).toBeInTheDocument();
    });

    it("applies reduced opacity when disabled", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} disabled title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass("opacity-50");
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <ModalDialog
          isOpen={true}
          onClose={mockOnClose}
          required
          onStateChange={mockOnStateChange}
          title="Test"
        >
          <div>Content</div>
        </ModalDialog>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });

    it("sets data-required attribute when required", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} required title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const modal = container.querySelector('[data-required="true"]');
      expect(modal).toBeInTheDocument();
    });

    it("sets aria-required when required", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} required title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const modal = container.querySelector('[aria-required="true"]');
      expect(modal).toBeInTheDocument();
    });

    it("sets aria-invalid to false when required but no error", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} required title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const modal = container.querySelector('[aria-invalid="false"]');
      expect(modal).toBeInTheDocument();
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <ModalDialog
          isOpen={true}
          onClose={mockOnClose}
          loading
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
          title="Test"
        >
          <div>Content</div>
        </ModalDialog>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <ModalDialog
          isOpen={true}
          onClose={mockOnClose}
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
          title="Test"
        >
          <div>Content</div>
        </ModalDialog>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("sets aria-modal to true", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[aria-modal="true"]');
      expect(dialog).toBeInTheDocument();
    });

    it("generates titleId from title prop", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="My Modal Title">
          <div>Content</div>
        </ModalDialog>,
      );
      const title = screen.getByText("My Modal Title");
      expect(title).toHaveAttribute("id");
      expect(title?.id).toMatch(/^modal-title-/);
    });

    it("uses provided titleId when given", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test" titleId="custom-title-id">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveAttribute("aria-labelledby", "custom-title-id");
    });

    it("generates descriptionId from description prop", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} description="Modal description">
          <div>Content</div>
        </ModalDialog>,
      );
      const description = screen.getByText("Modal description");
      expect(description?.id).toMatch(/^modal-description-/);
    });

    it("links aria-labelledby to title", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="My Title">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[role="dialog"]');
      const title = screen.getByText("My Title");
      expect(dialog).toHaveAttribute("aria-labelledby", title?.id);
    });

    it("links aria-describedby to description", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} description="My Description">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[role="dialog"]');
      const description = screen.getByText("My Description");
      expect(dialog).toHaveAttribute("aria-describedby", description?.id);
    });
  });

  describe("Custom styling", () => {
    it("applies custom className to dialog", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test" className="custom-dialog">
          <div>Content</div>
        </ModalDialog>,
      );
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass("custom-dialog");
    });

    it("applies custom overlayClassName", () => {
      const { container } = render(
        <ModalDialog
          isOpen={true}
          onClose={mockOnClose}
          title="Test"
          overlayClassName="custom-overlay"
        >
          <div>Content</div>
        </ModalDialog>,
      );
      const overlay = container.querySelector('[aria-hidden="true"]');
      expect(overlay).toHaveClass("custom-overlay");
    });

    it("renders with complex content structure", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Complex Modal">
          <div className="custom-content">
            <h3>Section Title</h3>
            <p>Detailed content</p>
            <button>Action</button>
          </div>
        </ModalDialog>,
      );
      expect(screen.getByText("Section Title")).toBeInTheDocument();
      expect(screen.getByText("Detailed content")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });
  });

  describe("ModalHeader", () => {
    it("renders header with title", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <ModalHeader title="Header Title" />
        </ModalDialog>,
      );
      expect(screen.getByText("Header Title")).toBeInTheDocument();
    });

    it("renders header with subtitle", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <ModalHeader title="Header Title" subtitle="Subtitle text" />
        </ModalDialog>,
      );
      expect(screen.getByText("Subtitle text")).toBeInTheDocument();
    });

    it("renders close button when showClose and onClose provided", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <ModalHeader title="Test" showClose={true} onClose={mockOnClose} />
        </ModalDialog>,
      );
      const closeButton = screen.getByTitle("Close dialog");
      expect(closeButton).toBeInTheDocument();
    });

    it("does not render close button when showClose is false", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <ModalHeader title="Test" showClose={false} onClose={mockOnClose} />
        </ModalDialog>,
      );
      const closeButton = screen.queryByTitle("Close dialog");
      expect(closeButton).not.toBeInTheDocument();
    });

    it("renders header actions when provided", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <ModalHeader title="Test" actions={<button type="button">Action Button</button>} />
        </ModalDialog>,
      );
      expect(screen.getByText("Action Button")).toBeInTheDocument();
    });
  });

  describe("ModalBody", () => {
    it("renders body content", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <ModalBody>Body Content</ModalBody>
        </ModalDialog>,
      );
      expect(screen.getByText("Body Content")).toBeInTheDocument();
    });

    it("applies custom className to body", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <ModalBody className="custom-body">Content</ModalBody>
        </ModalDialog>,
      );
      const body = container.querySelector(".custom-body");
      expect(body).toBeInTheDocument();
    });
  });

  describe("ModalFooter", () => {
    it("renders footer content", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <ModalFooter>Footer Content</ModalFooter>
        </ModalDialog>,
      );
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });

    it("applies custom className to footer", () => {
      const { container } = render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test">
          <ModalFooter className="custom-footer">Content</ModalFooter>
        </ModalDialog>,
      );
      const footer = container.querySelector(".custom-footer");
      expect(footer).toBeInTheDocument();
    });
  });

  describe("Complete modal structure", () => {
    it("renders modal with all components", () => {
      render(
        <ModalDialog isOpen={true} onClose={mockOnClose} title="Test Modal">
          <ModalHeader title="Modal Title" subtitle="Modal Subtitle" />
          <ModalBody>Modal Body Content</ModalBody>
          <ModalFooter>
            <button type="button">Cancel</button>
            <button type="button">Confirm</button>
          </ModalFooter>
        </ModalDialog>,
      );
      expect(screen.getByText("Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Modal Subtitle")).toBeInTheDocument();
      expect(screen.getByText("Modal Body Content")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });
  });
});
