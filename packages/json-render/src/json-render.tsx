import { Fragment, type ReactElement, type ReactNode } from "react";

import { defaultRegistry } from "./default-registry";
import type { ComponentSchema, JsonRenderProps } from "./types";

function renderSchema(
  schema: ComponentSchema,
  registry = defaultRegistry,
  key?: string | number,
): ReactElement | null {
  const Component = registry.get(schema.component);

  if (!Component) {
    // Component not found in registry - return null to skip rendering
    return null;
  }

  const { children, ...props } = schema.props || {};

  let renderedChildren: ReactNode = null;

  if (schema.children) {
    if (typeof schema.children === "string") {
      renderedChildren = schema.children;
    } else if (Array.isArray(schema.children)) {
      renderedChildren = schema.children.map((child, index) =>
        renderSchema(child, registry, index),
      );
    }
  } else if (children) {
    if (typeof children === "string") {
      renderedChildren = children;
    } else if (Array.isArray(children)) {
      renderedChildren = children.map((child: ComponentSchema, index: number) =>
        renderSchema(child, registry, index),
      );
    }
  }

  return (
    <Component key={key} {...props}>
      {renderedChildren}
    </Component>
  );
}

export function JsonRender({
  schema,
  registry = defaultRegistry,
  fallback = null,
}: JsonRenderProps): ReactElement | null {
  try {
    if (Array.isArray(schema)) {
      return <Fragment>{schema.map((s, index) => renderSchema(s, registry, index))}</Fragment>;
    }
    return renderSchema(schema, registry);
  } catch {
    // Error rendering JSON schema - return fallback
    return <>{fallback}</>;
  }
}
