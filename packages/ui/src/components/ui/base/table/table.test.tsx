import { describe, expect, it } from "vitest";

import { render, screen } from "../../../../testing/utils";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

describe("Table", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("table")).toHaveAttribute("data-slot", "table");
    });

    it("applies custom className", () => {
      render(
        <Table className="custom-class">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("table")).toHaveClass("custom-class");
    });

    it("wraps table in scrollable container", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("table").parentElement).toHaveAttribute(
        "data-slot",
        "table-container",
      );
    });
  });

  describe("TableHeader", () => {
    it("renders header section", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      expect(screen.getByRole("rowgroup")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      expect(screen.getByRole("rowgroup")).toHaveAttribute("data-slot", "table-header");
    });

    it("applies custom className", () => {
      render(
        <Table>
          <TableHeader className="custom-header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      expect(screen.getByRole("rowgroup")).toHaveClass("custom-header");
    });
  });

  describe("TableBody", () => {
    it("renders body section", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("rowgroup")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("rowgroup")).toHaveAttribute("data-slot", "table-body");
    });
  });

  describe("TableFooter", () => {
    it("renders footer section", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>,
      );
      const rowgroups = screen.getAllByRole("rowgroup");
      expect(rowgroups).toHaveLength(2);
    });

    it("renders with data-slot attribute", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter data-testid="footer">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>,
      );
      expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "table-footer");
    });
  });

  describe("TableRow", () => {
    it("renders row", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("row")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("row")).toHaveAttribute("data-slot", "table-row");
    });

    it("applies custom className", () => {
      render(
        <Table>
          <TableBody>
            <TableRow className="custom-row">
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("row")).toHaveClass("custom-row");
    });

    it("has hover styles", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("row")).toHaveClass("hover:bg-muted/50");
    });
  });

  describe("TableHead", () => {
    it("renders header cell", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      expect(screen.getByRole("columnheader")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      expect(screen.getByRole("columnheader")).toHaveAttribute("data-slot", "table-head");
    });

    it("has font-medium style", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      expect(screen.getByRole("columnheader")).toHaveClass("font-medium");
    });
  });

  describe("TableCell", () => {
    it("renders cell", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell content</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("cell")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell content</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("cell")).toHaveAttribute("data-slot", "table-cell");
    });

    it("applies custom className", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell">Cell content</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByRole("cell")).toHaveClass("custom-cell");
    });
  });

  describe("TableCaption", () => {
    it("renders caption", () => {
      render(
        <Table>
          <TableCaption>Table caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByText("Table caption")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Table>
          <TableCaption>Table caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(screen.getByText("Table caption")).toHaveAttribute("data-slot", "table-caption");
    });
  });

  describe("complete table", () => {
    it("renders a complete table structure", () => {
      render(
        <Table>
          <TableCaption>User list</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total: 2 users</TableCell>
            </TableRow>
          </TableFooter>
        </Table>,
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("User list")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(2);
      expect(screen.getAllByRole("row")).toHaveLength(4);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Total: 2 users")).toBeInTheDocument();
    });
  });
});
