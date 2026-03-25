import type { ReactNode } from "react";

import { EmptyMessage } from "../../../components/ui/data-display/EmptyMessage/EmptyMessage";
import { Spinner } from "../../../components/ui/feedback/Spinner/Spinner";
import type { SettingsAsyncState } from "./types";

interface SettingsPanelStateProps {
  state?: SettingsAsyncState;
  loadingLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: ReactNode;
  errorTitle: string;
  errorDescription: string;
  children: ReactNode;
}

export function SettingsPanelState({
  state = "ready",
  loadingLabel,
  emptyTitle,
  emptyDescription,
  emptyAction,
  errorTitle,
  errorDescription,
  children,
}: SettingsPanelStateProps) {
  if (state === "loading") {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-3 px-3 text-center">
        <Spinner size="lg" variant="muted" label={loadingLabel} />
        <p className="text-body-small text-muted-foreground">{loadingLabel}</p>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <EmptyMessage
        variant="inbox"
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  if (state === "error") {
    return <EmptyMessage variant="error" title={errorTitle} description={errorDescription} />;
  }

  return children;
}
