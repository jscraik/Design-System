import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
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
