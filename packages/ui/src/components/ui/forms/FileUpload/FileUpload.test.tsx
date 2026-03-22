import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FileUpload } from "./FileUpload";

describe("FileUpload", () => {
  describe("Rendering", () => {
    it("renders with data-slot attribute", () => {
      render(<FileUpload />);
      expect(document.querySelector('[data-slot="file-upload"]')).toBeInTheDocument();
    });

    it("renders default label text", () => {
      render(<FileUpload />);
      expect(screen.getByText("or drag and drop")).toBeInTheDocument();
    });

    it("renders max size text when provided", () => {
      render(<FileUpload maxSize={5 * 1024 * 1024} />);
      expect(screen.getByText("Max size: 5 MB")).toBeInTheDocument();
    });

    it("renders accepted types when provided", () => {
      render(<FileUpload accept="image/*" />);
      expect(screen.getByText("Accepted: image/*")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has role=button", () => {
      render(<FileUpload />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("has aria-label", () => {
      render(<FileUpload />);
      expect(
        screen.getByLabelText("File upload area. Press Enter or Space to browse files."),
      ).toBeInTheDocument();
    });

    it("has tabIndex 0 when enabled", () => {
      render(<FileUpload />);
      expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
    });

    it("has tabIndex -1 and aria-disabled when disabled", () => {
      render(<FileUpload disabled />);
      const el = screen.getByRole("button");
      expect(el).toHaveAttribute("tabIndex", "-1");
      expect(el).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("File selection", () => {
    it("calls onFiles with selected files", () => {
      const onFiles = vi.fn();
      render(<FileUpload onFiles={onFiles} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      Object.defineProperty(input, "files", { value: [file] });
      fireEvent.change(input);

      expect(onFiles).toHaveBeenCalledWith([file]);
    });

    it("calls onReject when file exceeds maxSize", () => {
      const onReject = vi.fn();
      const onFiles = vi.fn();
      render(<FileUpload maxSize={100} onFiles={onFiles} onReject={onReject} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const bigFile = new File(["x".repeat(200)], "big.txt", { type: "text/plain" });
      Object.defineProperty(input, "files", { value: [bigFile] });
      fireEvent.change(input);

      expect(onReject).toHaveBeenCalledWith(bigFile, "size");
      expect(onFiles).not.toHaveBeenCalled();
    });
  });

  describe("Drag and drop", () => {
    it("sets data-drag-active on dragover", () => {
      render(<FileUpload />);
      const zone = screen.getByRole("button");
      fireEvent.dragOver(zone);
      expect(zone).toHaveAttribute("data-drag-active", "true");
    });

    it("clears data-drag-active on dragleave", () => {
      render(<FileUpload />);
      const zone = screen.getByRole("button");
      fireEvent.dragOver(zone);
      fireEvent.dragLeave(zone);
      expect(zone).not.toHaveAttribute("data-drag-active");
    });
  });
});
