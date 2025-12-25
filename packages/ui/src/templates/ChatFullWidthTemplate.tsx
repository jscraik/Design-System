import type { ReactNode } from "react";

export interface ChatFullWidthTemplateProps {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

export function ChatFullWidthTemplate({
  header,
  body,
  footer,
}: ChatFullWidthTemplateProps) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      {header ? <div className="shrink-0">{header}</div> : null}
      {body ? <div className="flex-1 min-h-0">{body}</div> : null}
      {footer ? <div className="shrink-0">{footer}</div> : null}
    </div>
  );
}