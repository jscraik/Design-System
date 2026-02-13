/**
 * Prototype components for tree-shaking validation
 *
 * This simulates the DesignStudio package structure to test:
 * 1. Category imports
 * 2. Build-time tree-shaking
 * 3. Bundle size differences
 */

import React from "react";

// Base components
export const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return React.createElement("button", { onClick, className: "btn" }, children);
};

export const Input = ({ placeholder }: { placeholder?: string }) => {
  return React.createElement("input", { placeholder, className: "input" });
};

export const Card = ({ children }: { children: React.ReactNode }) => {
  return React.createElement("div", { className: "card" }, children);
};

// Navigation components
export const Tabs = ({ children }: { children: React.ReactNode }) => {
  return React.createElement("div", { className: "tabs" }, children);
};

export const Breadcrumb = ({ children }: { children: React.ReactNode }) => {
  return React.createElement("nav", { className: "breadcrumb" }, children);
};

// Overlay components
export const Modal = ({ children, open }: { children: React.ReactNode; open?: boolean }) => {
  return open ? React.createElement("div", { className: "modal" }, children) : null;
};

export const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  return React.createElement("div", { className: "tooltip", "data-content": content }, children);
};

// Form components
export const Select = ({ options }: { options: string[] }) => {
  return React.createElement(
    "select",
    { className: "select" },
    options.map((opt) => React.createElement("option", { key: opt }, opt)),
  );
};

export const Checkbox = ({ label }: { label?: string }) => {
  return React.createElement(
    "label",
    { className: "checkbox" },
    React.createElement("input", { type: "checkbox" }),
    label,
  );
};

// Chat components
export const ChatInput = ({ placeholder }: { placeholder?: string }) => {
  return React.createElement("input", { placeholder, className: "chat-input" });
};

export const ChatMessage = ({ message }: { message: string }) => {
  return React.createElement("div", { className: "chat-message" }, message);
};
