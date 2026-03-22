import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ColumnDef } from "./DataTable";
import { DataTable } from "./DataTable";

type Row = { id: number; name: string; role: string };

const columns: ColumnDef<Row>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "role", header: "Role" },
];

const data: Row[] = [
  { id: 1, name: "Alice", role: "Admin" },
  { id: 2, name: "Charlie", role: "User" },
  { id: 3, name: "Bob", role: "Editor" },
];

describe("DataTable", () => {
  describe("Rendering", () => {
    it("renders with data-slot attribute", () => {
      render(<DataTable columns={columns} data={data} />);
      expect(document.querySelector('[data-slot="data-table"]')).toBeInTheDocument();
    });

    it("renders column headers", () => {
      render(<DataTable columns={columns} data={data} />);
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
    });

    it("renders row data", () => {
      render(<DataTable columns={columns} data={data} />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    it("renders empty message when data is empty", () => {
      render(<DataTable columns={columns} data={[]} emptyMessage="Nothing here" />);
      expect(screen.getByText("Nothing here")).toBeInTheDocument();
    });

    it("renders loading spinner when loading=true", () => {
      render(<DataTable columns={columns} data={data} loading />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("Sorting", () => {
    it("sorts ascending on first click of a sortable column", () => {
      render(<DataTable columns={columns} data={data} />);
      fireEvent.click(screen.getByText("Name"));
      const cells = screen.getAllByRole("cell");
      const names = cells
        .map((c) => c.textContent)
        .filter((t) => ["Alice", "Bob", "Charlie"].includes(t ?? ""));
      expect(names).toEqual(["Alice", "Bob", "Charlie"]);
    });

    it("sorts descending on second click", () => {
      render(<DataTable columns={columns} data={data} />);
      fireEvent.click(screen.getByText("Name"));
      fireEvent.click(screen.getByText("Name"));
      const cells = screen.getAllByRole("cell");
      const names = cells
        .map((c) => c.textContent)
        .filter((t) => ["Alice", "Bob", "Charlie"].includes(t ?? ""));
      expect(names).toEqual(["Charlie", "Bob", "Alice"]);
    });

    it("calls onSortChange in server mode", () => {
      const onSortChange = vi.fn();
      render(<DataTable columns={columns} data={data} onSortChange={onSortChange} />);
      fireEvent.click(screen.getByText("Name"));
      expect(onSortChange).toHaveBeenCalledWith({ key: "name", direction: "asc" });
    });
  });

  describe("Pagination", () => {
    const manyRows: Row[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      role: "User",
    }));

    it("shows pagination controls when paginated=true", () => {
      render(<DataTable columns={columns} data={manyRows} paginated pageSize={10} />);
      expect(screen.getByLabelText("Next page")).toBeInTheDocument();
      expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
    });

    it("shows page 1 initially", () => {
      render(<DataTable columns={columns} data={manyRows} paginated pageSize={10} />);
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });

    it("advances to page 2 on next click", () => {
      render(<DataTable columns={columns} data={manyRows} paginated pageSize={10} />);
      fireEvent.click(screen.getByLabelText("Next page"));
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    it("disables previous button on first page", () => {
      render(<DataTable columns={columns} data={manyRows} paginated pageSize={10} />);
      expect(screen.getByLabelText("Previous page")).toBeDisabled();
    });
  });
});
