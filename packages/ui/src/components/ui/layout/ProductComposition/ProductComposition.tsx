import type * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "../../base/alert";
import { SectionHeader } from "../../base/SectionHeader";
import { EmptyMessage } from "../../data-display/EmptyMessage";
import { Spinner } from "../../feedback/Spinner";
import { cn } from "../../utils";
import { type GapValue, Stack } from "../Stack";

type ProductDensity = "compact" | "default" | "spacious";
type ProductTone = "default" | "muted" | "elevated";
type ProductState = "ready" | "loading" | "empty" | "error" | "busy";

const pageDensityClasses: Record<ProductDensity, string> = {
  compact: "gap-4 px-4 py-4",
  default: "gap-6 px-6 py-6",
  spacious: "gap-8 px-8 py-8",
};

const panelDensityClasses: Record<ProductDensity, string> = {
  compact: "gap-3 p-3",
  default: "gap-4 p-4",
  spacious: "gap-6 p-6",
};

const sectionGap: Record<ProductDensity, GapValue> = {
  compact: "3",
  default: "4",
  spacious: "6",
};

const panelToneClasses: Record<ProductTone, string> = {
  default: "border-border bg-background",
  muted: "border-border bg-muted/30",
  elevated: "border-border bg-card shadow-sm",
};

export interface ProductPageShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  density?: ProductDensity;
  sidebarClassName?: string;
  mainClassName?: string;
}

export function ProductPageShell({
  title,
  description,
  actions,
  sidebar,
  footer,
  density = "default",
  sidebarClassName,
  mainClassName,
  className,
  children,
  ...props
}: ProductPageShellProps) {
  return (
    <div
      data-slot="page-shell"
      className={cn(
        "flex min-h-dvh flex-col bg-background text-foreground",
        pageDensityClasses[density],
        className,
      )}
      {...props}
    >
      {(title || description || actions) && (
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            {title && <h1 className="text-title-2 font-semibold tracking-body">{title}</h1>}
            {description && (
              <p className="max-w-3xl text-body-small text-text-secondary">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}

      <div className={cn("flex min-h-0 flex-1 flex-col gap-6", sidebar && "lg:flex-row")}>
        {sidebar && (
          <aside
            data-slot="page-shell-sidebar"
            className={cn("min-h-0 lg:w-64 lg:shrink-0", sidebarClassName)}
          >
            {sidebar}
          </aside>
        )}
        <main data-slot="page-shell-main" className={cn("min-w-0 flex-1", mainClassName)}>
          {children}
        </main>
      </div>

      {footer && <footer data-slot="page-shell-footer">{footer}</footer>}
    </div>
  );
}

export interface ProductPanelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  density?: ProductDensity;
  tone?: ProductTone;
  as?: "article" | "aside" | "div" | "section";
  bodyClassName?: string;
}

export function ProductPanel({
  title,
  description,
  actions,
  footer,
  density = "default",
  tone = "default",
  as: Component = "section",
  bodyClassName,
  className,
  children,
  ...props
}: ProductPanelProps) {
  return (
    <Component
      data-slot="product-panel"
      className={cn(
        "flex min-w-0 flex-col rounded-lg border",
        panelToneClasses[tone],
        panelDensityClasses[density],
        className,
      )}
      {...props}
    >
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-4">
          {title && <SectionHeader title={title} description={description} />}
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div data-slot="product-panel-body" className={cn("min-w-0", bodyClassName)}>
        {children}
      </div>
      {footer && (
        <div data-slot="product-panel-footer" className="border-border border-t pt-4">
          {footer}
        </div>
      )}
    </Component>
  );
}

export interface ProductSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  density?: ProductDensity;
  as?: "div" | "section";
}

export function ProductSection({
  title,
  description,
  actions,
  density = "default",
  as: Component = "section",
  className,
  children,
  ...props
}: ProductSectionProps) {
  return (
    <Component data-slot="product-section" className={cn("min-w-0", className)} {...props}>
      <Stack gap={sectionGap[density]}>
        <SectionHeader title={title} description={description} right={actions} />
        {children}
      </Stack>
    </Component>
  );
}

export interface ProductStateWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: ProductState;
  loadingLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function ProductStateWrapper({
  state = "ready",
  loadingLabel = "Loading content",
  emptyTitle = "Nothing here yet",
  emptyDescription = "When content is available, it will appear here.",
  errorTitle = "Something went wrong",
  errorDescription = "Try again or check the surrounding context.",
  action,
  className,
  children,
  ...props
}: ProductStateWrapperProps) {
  if (state === "ready") {
    return (
      <div data-slot="state-wrapper" className={className} {...props}>
        {children}
      </div>
    );
  }

  if (state === "loading" || state === "busy") {
    return (
      <div
        data-slot="state-wrapper"
        aria-busy="true"
        className={cn(
          "flex min-h-48 items-center justify-center rounded-md border border-border bg-background p-6",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3 text-muted-foreground">
          <Spinner size="sm" label={loadingLabel} />
          <span className="text-body-small">{loadingLabel}</span>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <Alert data-slot="state-wrapper" variant="destructive" className={className} {...props}>
        <AlertTitle>{errorTitle}</AlertTitle>
        <AlertDescription>{errorDescription}</AlertDescription>
        {action && <div className="mt-4">{action}</div>}
      </Alert>
    );
  }

  return (
    <EmptyMessage
      data-slot="state-wrapper"
      title={emptyTitle}
      description={emptyDescription}
      action={action}
      className={className}
      {...props}
    />
  );
}

export interface ProductDataViewProps extends ProductStateWrapperProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function ProductDataView({
  title,
  description,
  actions,
  state = "ready",
  children,
  className,
  ...props
}: ProductDataViewProps) {
  return (
    <ProductSection
      data-slot="data-view"
      title={title ?? "Data view"}
      description={description}
      actions={actions}
      className={className}
    >
      <ProductStateWrapper state={state} {...props}>
        {children}
      </ProductStateWrapper>
    </ProductSection>
  );
}

export type { ProductDensity, ProductState, ProductTone };
