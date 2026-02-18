import type { ReactNode } from "react";

export interface DashboardTemplateProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  body?: ReactNode;
  detailsPanel?: ReactNode;
  footer?: ReactNode;
}

export function DashboardTemplate({
  header,
  sidebar,
  body,
  detailsPanel,
  footer,
}: DashboardTemplateProps) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      {header ? <div className="shrink-0">{header}</div> : null}
      <div className="flex-1 min-h-0 flex">
        {sidebar ? <div className="shrink-0 h-full">{sidebar}</div> : null}
        {body ? <div className="flex-1 min-w-0 min-h-0">{body}</div> : null}
        {detailsPanel ? <div className="shrink-0 h-full">{detailsPanel}</div> : null}
      </div>
      {footer ? <div className="shrink-0">{footer}</div> : null}
    </div>
  );
}
