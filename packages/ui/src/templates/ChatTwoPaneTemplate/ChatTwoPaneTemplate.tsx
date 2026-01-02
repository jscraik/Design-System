import type { ReactNode } from "react";

/**
 * Props for the two-pane chat layout.
 */
export interface ChatTwoPaneTemplateProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  detailsPanel?: ReactNode;
}

/**
 * Render a two-pane layout with optional sidebar and details panel.
 * @param props - Layout slot props.
 * @returns The two-pane template element.
 */
export function ChatTwoPaneTemplate({
  sidebar,
  header,
  body,
  footer,
  detailsPanel,
}: ChatTwoPaneTemplateProps) {
  return (
    <div className="flex h-full w-full min-h-0">
      {sidebar ? <div className="shrink-0 h-full">{sidebar}</div> : null}
      <div className="flex-1 min-w-0 flex flex-col min-h-0">
        {header ? <div className="shrink-0">{header}</div> : null}
        {body ? <div className="flex-1 min-h-0">{body}</div> : null}
        {footer ? <div className="shrink-0">{footer}</div> : null}
      </div>
      {detailsPanel ? <div className="shrink-0 h-full">{detailsPanel}</div> : null}
    </div>
  );
}
