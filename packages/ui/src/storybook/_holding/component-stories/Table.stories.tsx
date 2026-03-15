import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

const meta: Meta<typeof Table> = {
  title: "Components/UI/Base/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table className="w-[420px]">
      <TableCaption>Recent projects</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Chat UI</TableCell>
          <TableCell>Active</TableCell>
          <TableCell className="text-right">2h ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Dashboard</TableCell>
          <TableCell>Draft</TableCell>
          <TableCell className="text-right">1d ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Design System</TableCell>
          <TableCell>Review</TableCell>
          <TableCell className="text-right">3d ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const TableRendersWithA11y: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Table identifying elements exist", () => {
      // Because it's an HTML table, it naturally has the table role
      // However radices sometimes don't bind this on generic <div>s if not using real <table>
      // Assuming Table component uses real HTML tables:
      expect(canvas.getByRole("table")).toBeInTheDocument();
      expect(canvas.getByRole("columnheader", { name: /project/i })).toBeInTheDocument();
      
      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1); // 1 header + body rows
    });
  },
};

