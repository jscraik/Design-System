/**
 * ComplexComponent.tsx
 *
 * A compound-only component for maximum flexibility.
 *
 * Use case: Complex layouts with multiple slots, custom rendering, or designer needs
 *
 * Compound API only: 100% of use cases
 */

import type React from "react";
import { createContext, useContext } from "react";

// ============================================================================
// TYPES
// ============================================================================

interface ComplexContextValue {
  layout: "horizontal" | "vertical";
  spacing: "sm" | "md" | "lg";
}

interface ComplexComponentProps {
  layout?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ComplexContext = createContext<ComplexContextValue | null>(null);

const _useComplexContext = () => {
  const context = useContext(ComplexContext);
  if (!context) {
    throw new Error("ComplexComponent sub-components must be used within ComplexComponent");
  }
  return context;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ComplexComponent - Compound Only
 *
 * This component has NO props-based API because:
 * - Too many configuration options
 * - Custom layouts are common
 * - Designer flexibility is priority
 *
 * Usage:
 *   <ComplexComponent layout="horizontal" spacing="md">
 *     <ComplexComponent.Header>
 *       <ComplexComponent.Title>Header</ComplexComponent.Title>
 *       <ComplexComponent.Subtitle>Subtitle</ComplexComponent.Subtitle>
 *     </ComplexComponent.Header>
 *     <ComplexComponent.Body>
 *       Content here
 *     </ComplexComponent.Body>
 *     <ComplexComponent.Footer>
 *       <ComplexComponent.Action primary>Save</ComplexComponent.Action>
 *       <ComplexComponent.Action>Cancel</ComplexComponent.Action>
 *     </ComplexComponent.Footer>
 *   </ComplexComponent>
 */
export const ComplexComponent = ({
  layout = "horizontal",
  spacing = "md",
  children,
}: ComplexComponentProps) => {
  return (
    <ComplexContext.Provider value={{ layout, spacing }}>
      <div
        className={`complex-component layout-${layout} spacing-${spacing}`}
        data-layout={layout}
        data-spacing={spacing}
      >
        {children}
      </div>
    </ComplexContext.Provider>
  );
};

// ============================================================================
// HEADER SUB-COMPONENT
// ============================================================================

interface HeaderProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}

ComplexComponent.Header = ({ children, align = "left" }: HeaderProps) => {
  return <header className={`complex-header align-${align}`}>{children}</header>;
};

// ============================================================================
// TITLE SUB-COMPONENT
// ============================================================================

interface TitleProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3";
}

ComplexComponent.Title = ({ children, variant = "h2" }: TitleProps) => {
  const Tag = variant;
  return <Tag className="complex-title">{children}</Tag>;
};

// ============================================================================
// SUBTITLE SUB-COMPONENT
// ============================================================================

ComplexComponent.Subtitle = ({ children }: { children: React.ReactNode }) => {
  return <p className="complex-subtitle">{children}</p>;
};

// ============================================================================
// BODY SUB-COMPONENT
// ============================================================================

interface BodyProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

ComplexComponent.Body = ({ children, scrollable = false }: BodyProps) => {
  return <div className={`complex-body ${scrollable ? "scrollable" : ""}`}>{children}</div>;
};

// ============================================================================
// FOOTER SUB-COMPONENT
// ============================================================================

interface FooterProps {
  children: React.ReactNode;
  position?: "left" | "center" | "right";
  sticky?: boolean;
}

ComplexComponent.Footer = ({ children, position = "right", sticky = false }: FooterProps) => {
  return (
    <footer className={`complex-footer position-${position} ${sticky ? "sticky" : ""}`}>
      {children}
    </footer>
  );
};

// ============================================================================
// ACTION SUB-COMPONENT
// ============================================================================

interface ActionProps {
  children: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

ComplexComponent.Action = ({
  children,
  primary = false,
  disabled = false,
  onClick,
}: ActionProps) => {
  return (
    <button
      className={`complex-action ${primary ? "primary" : ""} ${disabled ? "disabled" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ============================================================================
// TYPE ASSERTIONS
// ============================================================================

ComplexComponent.Header.displayName = "ComplexComponent.Header";
ComplexComponent.Title.displayName = "ComplexComponent.Title";
ComplexComponent.Subtitle.displayName = "ComplexComponent.Subtitle";
ComplexComponent.Body.displayName = "ComplexComponent.Body";
ComplexComponent.Footer.displayName = "ComplexComponent.Footer";
ComplexComponent.Action.displayName = "ComplexComponent.Action";

// Code size: ~5KB (5x SimpleComponent)
// DX score: 3/5 (more complex, requires learning compound pattern)
// Flexibility: 5/5 (maximum customization)
