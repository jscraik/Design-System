/**
 * HybridComponent.tsx
 *
 * A hybrid component supporting both props-based AND compound APIs.
 *
 * Use case: Components that benefit from flexibility but have sensible defaults
 *
 * Props API: 80% of use cases (simple, quick)
 * Compound API: 20% of use cases (complex, custom layouts)
 */

import type React from "react";
import { createContext, useContext, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface HybridComponentProps {
  // Variant selection
  variant?: "default" | "compound";

  // Props-based API (default mode)
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showIcon?: boolean;

  // Compound API slots (only used in compound mode)
  children?: React.ReactNode;
}

// ============================================================================
// CONTEXT (only active in compound mode)
// ============================================================================

interface HybridContextValue {
  title: string;
  description: string;
  onAction: () => void;
}

const HybridContext = createContext<HybridContextValue | null>(null);

const useHybridContext = () => {
  const context = useContext(HybridContext);
  if (!context) {
    throw new Error(
      "HybridComponent sub-components must be used within HybridComponent in compound mode",
    );
  }
  return context;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * HybridComponent - Dual API Component
 *
 * Props mode (default):
 *   <HybridComponent
 *     title="Hello"
 *     description="World"
 *     actionLabel="Click me"
 *   />
 *
 * Compound mode:
 *   <HybridComponent variant="compound">
 *     <HybridComponent.Title>Hello</HybridComponent.Title>
 *     <HybridComponent.Description>World</HybridComponent.Description>
 *     <HybridComponent.Action>Click me</HybridComponent.Action>
 *   </HybridComponent>
 */
export const HybridComponent = ({
  variant = "default",
  title = "",
  description = "",
  actionLabel = "",
  onAction = () => {},
  showIcon = false,
  children,
}: HybridComponentProps) => {
  const [internalState] = useState({ clicked: false });

  // Default mode: Use internal state and props
  if (variant === "default") {
    return (
      <div className="hybrid-component">
        {showIcon && <span className="icon">✨</span>}
        {title && <h3 className="title">{title}</h3>}
        {description && <p className="description">{description}</p>}
        {actionLabel && (
          <button
            className="action"
            onClick={() => {
              onAction();
              internalState.clicked = true;
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  // Compound mode: Use context provider
  return (
    <HybridContext.Provider
      value={{
        title,
        description,
        onAction,
      }}
    >
      <div className="hybrid-component compound">{children}</div>
    </HybridContext.Provider>
  );
};

// ============================================================================
// COMPOUND SUB-COMPONENTS
// ============================================================================

/**
 * Title sub-component (compound mode only)
 */
HybridComponent.Title = ({ children }: { children: React.ReactNode }) => {
  const context = useHybridContext();
  return <h3 className="title">{children || context.title}</h3>;
};

/**
 * Description sub-component (compound mode only)
 */
HybridComponent.Description = ({ children }: { children: React.ReactNode }) => {
  const context = useHybridContext();
  return <p className="description">{children || context.description}</p>;
};

/**
 * Action sub-component (compound mode only)
 */
HybridComponent.Action = ({ children }: { children: React.ReactNode }) => {
  const context = useHybridContext();
  return (
    <button className="action" onClick={context.onAction}>
      {children}
    </button>
  );
};

// ============================================================================
// TYPE ASSERTIONS
// ============================================================================

// This ensures TypeScript recognizes the sub-components
HybridComponent.Title.displayName = "HybridComponent.Title";
HybridComponent.Description.displayName = "HybridComponent.Description";
HybridComponent.Action.displayName = "HybridComponent.Action";

// Code size: ~3KB (3x SimpleComponent)
// DX score: 4/5 (slightly more complex but still clear)
// Flexibility: 5/5 (both simple and complex use cases)
