import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../../../testing/utils";

import { Pagination } from "./pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("navigation")).toHaveAttribute("data-slot", "pagination");
    });

    it("has aria-label Pagination", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Pagination");
    });

    it("applies custom className", () => {
      render(<Pagination {...defaultProps} className="custom-class" />);
      expect(screen.getByRole("navigation")).toHaveClass("custom-class");
    });
  });

  describe("page buttons", () => {
    it("renders page number buttons", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
    });

    it("highlights current page", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);
      const currentButton = screen.getByRole("button", { name: "Go to page 5" });
      expect(currentButton).toHaveAttribute("aria-current", "page");
    });

    it("calls onPageChange when page button is clicked", async () => {
      const onPageChange = vi.fn();
      const { user } = render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

      await user.click(screen.getByRole("button", { name: "Go to page 2" }));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe("navigation buttons", () => {
    it("renders first page button", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Go to first page" })).toBeInTheDocument();
    });

    it("renders last page button", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Go to last page" })).toBeInTheDocument();
    });

    it("renders previous page button", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Go to previous page" })).toBeInTheDocument();
    });

    it("renders next page button", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Go to next page" })).toBeInTheDocument();
    });

    it("disables first and previous buttons on first page", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      expect(screen.getByRole("button", { name: "Go to first page" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Go to previous page" })).toBeDisabled();
    });

    it("disables last and next buttons on last page", () => {
      render(<Pagination {...defaultProps} currentPage={10} />);
      expect(screen.getByRole("button", { name: "Go to last page" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Go to next page" })).toBeDisabled();
    });

    it("calls onPageChange with 1 when first button is clicked", async () => {
      const onPageChange = vi.fn();
      const { user } = render(
        <Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />,
      );

      await user.click(screen.getByRole("button", { name: "Go to first page" }));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("calls onPageChange with totalPages when last button is clicked", async () => {
      const onPageChange = vi.fn();
      const { user } = render(
        <Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />,
      );

      await user.click(screen.getByRole("button", { name: "Go to last page" }));
      expect(onPageChange).toHaveBeenCalledWith(10);
    });

    it("calls onPageChange with currentPage - 1 when previous button is clicked", async () => {
      const onPageChange = vi.fn();
      const { user } = render(
        <Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />,
      );

      await user.click(screen.getByRole("button", { name: "Go to previous page" }));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("calls onPageChange with currentPage + 1 when next button is clicked", async () => {
      const onPageChange = vi.fn();
      const { user } = render(
        <Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />,
      );

      await user.click(screen.getByRole("button", { name: "Go to next page" }));
      expect(onPageChange).toHaveBeenCalledWith(6);
    });
  });

  describe("showFirstLast prop", () => {
    it("hides first/last buttons when showFirstLast is false", () => {
      render(<Pagination {...defaultProps} showFirstLast={false} />);
      expect(screen.queryByRole("button", { name: "Go to first page" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to last page" })).not.toBeInTheDocument();
    });
  });

  describe("showPrevNext prop", () => {
    it("hides prev/next buttons when showPrevNext is false", () => {
      render(<Pagination {...defaultProps} showPrevNext={false} />);
      expect(screen.queryByRole("button", { name: "Go to previous page" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Go to next page" })).not.toBeInTheDocument();
    });
  });

  describe("ellipsis", () => {
    it("shows ellipsis for many pages", () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);
      expect(screen.getAllByText("More pages")).toHaveLength(2);
    });

    it("does not show ellipsis for few pages", () => {
      render(<Pagination {...defaultProps} totalPages={5} />);
      expect(screen.queryByText("More pages")).not.toBeInTheDocument();
    });
  });

  describe("siblingCount prop", () => {
    it("shows more page buttons with higher siblingCount", () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={20} siblingCount={2} />);
      // Should show pages 8, 9, 10, 11, 12 around current
      expect(screen.getByRole("button", { name: "Go to page 8" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to page 12" })).toBeInTheDocument();
    });
  });

  describe("single page", () => {
    it("renders correctly with single page", () => {
      render(<Pagination {...defaultProps} totalPages={1} />);
      expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to first page" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Go to last page" })).toBeDisabled();
    });
  });

  describe("accessibility", () => {
    it("has correct navigation role", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("all buttons have accessible names", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName();
      });
    });

    it("current page has aria-current", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      expect(screen.getByRole("button", { name: "Go to page 3" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("ellipsis has aria-hidden", () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);
      const ellipses = screen.getAllByText("More pages");
      ellipses.forEach((ellipsis) => {
        expect(ellipsis.parentElement).toHaveAttribute("aria-hidden", "true");
      });
    });
  });
});
