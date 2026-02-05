import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../../testing/utils";
import * as Drawer from "./Drawer";

describe("Drawer", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders drawer trigger with data-slot attribute", () => {
      const { container } = render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open Drawer</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Drawer Title</Drawer.DrawerTitle>
            Drawer Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      const trigger = container.querySelector('[data-slot="drawer-trigger"]');
      expect(trigger).toBeInTheDocument();
    });

    it("renders drawer content when open", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Drawer Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Drawer Content")).toBeInTheDocument();
    });

    it("does not render drawer content when closed", () => {
      render(
        <Drawer.Drawer open={false} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Hidden Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    });

    it("renders trigger text", () => {
      render(
        <Drawer.Drawer>
          <Drawer.DrawerTrigger>Toggle Drawer</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Toggle Drawer")).toBeInTheDocument();
    });
  });

  describe("Open/Close state transitions", () => {
    it("opens drawer when open prop is true", () => {
      const { rerender } = render(
        <Drawer.Drawer open={false} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();

      rerender(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("closes drawer when open prop changes to false", () => {
      const { rerender } = render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();

      rerender(
        <Drawer.Drawer open={false} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <Drawer.Drawer
          open={true}
          onOpenChange={mockOnOpenChange}
          loading
          onStateChange={mockOnStateChange}
        >
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <Drawer.Drawer
          open={true}
          onOpenChange={mockOnOpenChange}
          error="Error message"
          onStateChange={mockOnStateChange}
        >
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <Drawer.Drawer
          open={true}
          onOpenChange={mockOnOpenChange}
          disabled
          onStateChange={mockOnStateChange}
        >
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <Drawer.Drawer
          open={true}
          onOpenChange={mockOnOpenChange}
          required
          onStateChange={mockOnStateChange}
        >
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <Drawer.Drawer
          open={true}
          onOpenChange={mockOnOpenChange}
          loading
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        >
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <Drawer.Drawer
          open={true}
          onOpenChange={mockOnOpenChange}
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        >
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("trigger is keyboard accessible", () => {
      render(
        <Drawer.Drawer>
          <Drawer.DrawerTrigger asChild>
            <button>Open Drawer</button>
          </Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent("Open Drawer");
    });
  });

  describe("DrawerHeader", () => {
    it("renders header content", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerHeader>
              <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
              Header Text
            </Drawer.DrawerHeader>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Header Text")).toBeInTheDocument();
    });

    it("applies custom className to header", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerHeader className="custom-header">
              <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
              Content
            </Drawer.DrawerHeader>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("DrawerFooter", () => {
    it("renders footer content", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            <Drawer.DrawerFooter>Footer Text</Drawer.DrawerFooter>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Footer Text")).toBeInTheDocument();
    });

    it("applies custom className to footer", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            <Drawer.DrawerFooter className="custom-footer">Content</Drawer.DrawerFooter>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("DrawerTitle", () => {
    it("renders title text", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerHeader>
              <Drawer.DrawerTitle>My Title</Drawer.DrawerTitle>
            </Drawer.DrawerHeader>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("My Title")).toBeInTheDocument();
    });
  });

  describe("DrawerDescription", () => {
    it("renders description text", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerHeader>
              <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
              <Drawer.DrawerDescription>My Description</Drawer.DrawerDescription>
            </Drawer.DrawerHeader>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("My Description")).toBeInTheDocument();
    });
  });

  describe("DrawerClose", () => {
    it("renders close button content", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            <Drawer.DrawerClose>Custom Close</Drawer.DrawerClose>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Custom Close")).toBeInTheDocument();
    });
  });

  describe("Custom styling", () => {
    it("applies custom className to content", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent className="custom-content">
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Content
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders with complex content structure", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerHeader>
              <Drawer.DrawerTitle>Form Title</Drawer.DrawerTitle>
              <Drawer.DrawerDescription>Fill out this form</Drawer.DrawerDescription>
            </Drawer.DrawerHeader>
            <div className="p-4">
              <input type="text" placeholder="Enter text" />
              <button type="button">Submit</button>
            </div>
            <Drawer.DrawerFooter>
              <button type="button">Cancel</button>
              <button type="button">Confirm</button>
            </Drawer.DrawerFooter>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Form Title")).toBeInTheDocument();
      expect(screen.getByText("Fill out this form")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
      expect(screen.getByText("Submit")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });
  });

  describe("Portal rendering", () => {
    it("renders content in portal", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            <div data-testid="drawer-portal-content">Portal Content</div>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      const content = screen.getByTestId("drawer-portal-content");
      expect(content).toBeInTheDocument();
    });
  });

  describe("Complete drawer structure", () => {
    it("renders drawer with all components", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange}>
          <Drawer.DrawerTrigger>Open Drawer</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerHeader>
              <Drawer.DrawerTitle>Complete Drawer</Drawer.DrawerTitle>
              <Drawer.DrawerDescription>With all components</Drawer.DrawerDescription>
            </Drawer.DrawerHeader>
            <div className="p-4">Body Content</div>
            <Drawer.DrawerFooter>
              <button type="button">Cancel</button>
              <button type="button">Save</button>
            </Drawer.DrawerFooter>
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Complete Drawer")).toBeInTheDocument();
      expect(screen.getByText("With all components")).toBeInTheDocument();
      expect(screen.getByText("Body Content")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });

  describe("Drawer direction", () => {
    it("renders from top by default", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange} direction="top">
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Top Drawer
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Top Drawer")).toBeInTheDocument();
    });

    it("renders from bottom", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange} direction="bottom">
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Bottom Drawer
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Bottom Drawer")).toBeInTheDocument();
    });

    it("renders from left", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange} direction="left">
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Left Drawer
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Left Drawer")).toBeInTheDocument();
    });

    it("renders from right", () => {
      render(
        <Drawer.Drawer open={true} onOpenChange={mockOnOpenChange} direction="right">
          <Drawer.DrawerTrigger>Open</Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerTitle>Title</Drawer.DrawerTitle>
            Right Drawer
          </Drawer.DrawerContent>
        </Drawer.Drawer>,
      );
      expect(screen.getByText("Right Drawer")).toBeInTheDocument();
    });
  });
});
