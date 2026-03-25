import { IconChevronRightMd } from "../../../icons/ChatGPTIcons";
import { SettingsPanelShell } from "../shared/SettingsPanelShell";
import { SettingsPanelState } from "../shared/SettingsPanelState";
import type { SettingsAsyncState, SettingsPanelProps } from "../shared/types";

interface NotificationRow {
  label: string;
  value: string;
}

export interface NotificationsPanelProps extends SettingsPanelProps {
  state?: SettingsAsyncState;
  notificationRows?: NotificationRow[];
  errorDescription?: string;
}

const DEFAULT_NOTIFICATION_ROWS: NotificationRow[] = [
  { label: "Responses", value: "Push" },
  { label: "Turn safety notifications", value: "Push, Email, SMS" },
  { label: "Group chats", value: "Push" },
  { label: "Pulse daily updates", value: "Push" },
  { label: "Pulse leaks", value: "Push, Email" },
  { label: "Projects", value: "Email" },
  { label: "Recommendations", value: "Push, Email" },
];

export function NotificationsPanel({
  onBack,
  state = "ready",
  notificationRows = DEFAULT_NOTIFICATION_ROWS,
  errorDescription = "We couldn't load your notification preferences. Try again in a moment.",
}: NotificationsPanelProps) {
  const effectiveState = state === "ready" && notificationRows.length === 0 ? "empty" : state;

  return (
    <SettingsPanelShell title="Notifications" onBack={onBack}>
      <SettingsPanelState
        state={effectiveState}
        loadingLabel="Loading notification preferences"
        emptyTitle="No notification preferences yet"
        emptyDescription="Your delivery settings will appear here once notification channels are available."
        errorTitle="Couldn't load notifications"
        errorDescription={errorDescription}
      >
        <div className="space-y-0.5">
          {notificationRows.map((row) => (
            <button
              key={row.label}
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
            >
              <span className="text-body-small font-normal text-foreground">{row.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-body-small font-normal text-text-secondary">{row.value}</span>
                <IconChevronRightMd className="size-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </SettingsPanelState>
    </SettingsPanelShell>
  );
}
