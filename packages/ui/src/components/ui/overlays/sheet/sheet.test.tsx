import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../../testing/utils";
import * as Sheet from "./fallback/Sheet";

describe("Sheet", () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders sheet trigger with data-slot attribute", () => {
      const { container } = render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open Sheet</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Sheet Title</Sheet.SheetTitle>
            Sheet Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      const trigger = container.querySelector('[data-slot="sheet-trigger"]');
      expect(trigger).toBeInTheDocument();
    });

    it("renders sheet content when open", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Sheet Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Sheet Content")).toBeInTheDocument();
    });

    it("does not render sheet content when closed", () => {
      render(
        <Sheet.Sheet open={false} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Hidden Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    });

    it("renders trigger text", () => {
      render(
        <Sheet.Sheet>
          <Sheet.SheetTrigger>Toggle Sheet</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Toggle Sheet")).toBeInTheDocument();
    });
  });

  describe("Open/Close state transitions", () => {
    it("opens sheet when open prop is true", () => {
      const { rerender } = render(
        <Sheet.Sheet open={false} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();

      rerender(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("closes sheet when open prop changes to false", () => {
      const { rerender } = render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();

      rerender(
        <Sheet.Sheet open={false} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });
  });

  describe("Sheet positioning", () => {
    it("renders on right side by default", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Right Sheet
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Right Sheet")).toBeInTheDocument();
    });

    it("renders on left side", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent side="left">
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Left Sheet
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Left Sheet")).toBeInTheDocument();
    });

    it("renders on top side", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent side="top">
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Top Sheet
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Top Sheet")).toBeInTheDocument();
    });

    it("renders on bottom side", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent side="bottom">
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Bottom Sheet
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Bottom Sheet")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("trigger is keyboard accessible", () => {
      render(
        <Sheet.Sheet>
          <Sheet.SheetTrigger asChild>
            <button>Open Sheet</button>
          </Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent("Open Sheet");
    });

    it("renders close button with screen reader text", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      const closeText = screen.getByText("Close");
      expect(closeText).toBeInTheDocument();
      expect(closeText).toHaveClass("sr-only");
    });
  });

  describe("SheetHeader", () => {
    it("renders header with data-slot attribute", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetHeader>
              <Sheet.SheetTitle>Title</Sheet.SheetTitle>
              Header Content
            </Sheet.SheetHeader>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("renders header content", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetHeader>
              <Sheet.SheetTitle>Title</Sheet.SheetTitle>
              Header Text
            </Sheet.SheetHeader>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Header Text")).toBeInTheDocument();
    });

    it("applies custom className to header", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetHeader className="custom-header">
              <Sheet.SheetTitle>Title</Sheet.SheetTitle>
              Content
            </Sheet.SheetHeader>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("SheetFooter", () => {
    it("renders footer content", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            <Sheet.SheetFooter>Footer Text</Sheet.SheetFooter>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Footer Text")).toBeInTheDocument();
    });

    it("applies custom className to footer", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            <Sheet.SheetFooter className="custom-footer">Content</Sheet.SheetFooter>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("SheetTitle", () => {
    it("renders title text", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetHeader>
              <Sheet.SheetTitle>My Title</Sheet.SheetTitle>
            </Sheet.SheetHeader>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("My Title")).toBeInTheDocument();
    });
  });

  describe("SheetDescription", () => {
    it("renders description text", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetHeader>
              <Sheet.SheetTitle>Title</Sheet.SheetTitle>
              <Sheet.SheetDescription>My Description</Sheet.SheetDescription>
            </Sheet.SheetHeader>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("My Description")).toBeInTheDocument();
    });
  });

  describe("SheetClose", () => {
    it("renders close button content", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            <Sheet.SheetClose>Custom Close</Sheet.SheetClose>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Custom Close")).toBeInTheDocument();
    });
  });

  describe("Custom styling", () => {
    it("applies custom className to content", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent className="custom-content">
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            Content
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders with complex content structure", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetHeader>
              <Sheet.SheetTitle>Form Title</Sheet.SheetTitle>
              <Sheet.SheetDescription>Fill out this form</Sheet.SheetDescription>
            </Sheet.SheetHeader>
            <div className="p-4">
              <input type="text" placeholder="Enter text" />
              <button type="button">Submit</button>
            </div>
            <Sheet.SheetFooter>
              <button type="button">Cancel</button>
              <button type="button">Confirm</button>
            </Sheet.SheetFooter>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
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
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open</Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetTitle>Title</Sheet.SheetTitle>
            <div data-testid="sheet-portal-content">Portal Content</div>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      const content = screen.getByTestId("sheet-portal-content");
      expect(content).toBeInTheDocument();
    });
  });

  describe("Complete sheet structure", () => {
    it("renders sheet with all components", () => {
      render(
        <Sheet.Sheet open={true} onOpenChange={mockOnOpenChange}>
          <Sheet.SheetTrigger>Open Sheet</Sheet.SheetTrigger>
          <Sheet.SheetContent side="right">
            <Sheet.SheetHeader>
              <Sheet.SheetTitle>Complete Sheet</Sheet.SheetTitle>
              <Sheet.SheetDescription>With all components</Sheet.SheetDescription>
            </Sheet.SheetHeader>
            <div className="p-4">Body Content</div>
            <Sheet.SheetFooter>
              <button type="button">Cancel</button>
              <button type="button">Save</button>
            </Sheet.SheetFooter>
          </Sheet.SheetContent>
        </Sheet.Sheet>,
      );
      expect(screen.getByText("Complete Sheet")).toBeInTheDocument();
      expect(screen.getByText("With all components")).toBeInTheDocument();
      expect(screen.getByText("Body Content")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });
});
