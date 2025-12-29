import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";

import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "UI/Navigation/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
    },
    totalPages: {
      control: { type: "number", min: 1 },
    },
    siblingCount: {
      control: { type: "number", min: 0, max: 3 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />;
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />;
  },
};

export const FirstPage: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};

export const LastPage: Story = {
  render: () => {
    const [page, setPage] = useState(10);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};

export const MiddlePage: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};

export const WithoutFirstLast: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} showFirstLast={false} />
    );
  },
};

export const WithoutPrevNext: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} showPrevNext={false} />
    );
  },
};

export const MinimalControls: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
        showFirstLast={false}
        showPrevNext={false}
      />
    );
  },
};

export const MoreSiblings: Story = {
  render: () => {
    const [page, setPage] = useState(10);
    return (
      <Pagination currentPage={page} totalPages={20} onPageChange={setPage} siblingCount={2} />
    );
  },
};

export const SinglePage: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={1} onPageChange={setPage} />;
  },
};

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = 15;
    const itemsPerPage = 10;
    const totalItems = 142;

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm text-foundation-text-dark-tertiary">
          Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, totalItems)} of{" "}
          {totalItems} results
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextButton = canvas.getByRole("button", { name: /go to next page/i });
    await userEvent.click(nextButton);
    await expect(canvas.getByText("Showing 11 to 20 of 142 results")).toBeInTheDocument();
  },
};
