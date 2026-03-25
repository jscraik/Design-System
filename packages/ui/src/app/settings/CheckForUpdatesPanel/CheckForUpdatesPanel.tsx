import { SettingsPanelShell } from "../shared/SettingsPanelShell";
import { SettingsPanelState } from "../shared/SettingsPanelState";
import type { SettingsPanelProps } from "../shared/types";

export function CheckForUpdatesPanel({ onBack }: SettingsPanelProps) {
  return (
    <SettingsPanelShell title="Check for Updates" onBack={onBack}>
      <SettingsPanelState
        state="empty"
        loadingLabel="Checking for updates"
        emptyTitle="Update checks will live here"
        emptyDescription="This panel will show desktop version details, release notes, and manual update actions."
        errorTitle="Update details are unavailable"
        errorDescription="We couldn't load update details right now."
      >
        <div />
      </SettingsPanelState>
    </SettingsPanelShell>
  );
}
