/**
 * SimpleComponent.tsx
 *
 * A props-based only component.
 * This is the simplest pattern - no compound API needed.
 *
 * Use case: 80% of components - simple configuration, standard use cases
 */

import React from "react";

export interface SimpleComponentProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * SimpleComponent - Props-based API only
 *
 * No compound pattern needed because:
 * - Single slot (children)
 * - Simple configuration
 * - No custom layout needs
 */
export const SimpleComponent = ({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  onClick,
}: SimpleComponentProps) => {
  const baseClasses = "simple-component";
  const variantClasses = `${baseClasses}--${variant}`;
  const sizeClasses = `${baseClasses}--${size}`;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

// Code size: ~1KB
// DX score: 5/5 (simple, clear)
// Flexibility: 3/5 (limited to props)
