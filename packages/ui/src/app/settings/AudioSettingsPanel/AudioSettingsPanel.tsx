import { SettingsPanelShell } from "../shared/SettingsPanelShell";
import { SettingsPanelState } from "../shared/SettingsPanelState";
import type { SettingsPanelProps } from "../shared/types";

export function AudioSettingsPanel({ onBack }: SettingsPanelProps) {
  return (
    <SettingsPanelShell title="Audio Settings" onBack={onBack}>
      <SettingsPanelState
        state="empty"
        loadingLabel="Loading audio settings"
        emptyTitle="Audio settings are coming soon"
        emptyDescription="Voice and playback preferences will live here once the audio controls are ready."
        errorTitle="Audio settings are unavailable"
        errorDescription="We couldn't load audio settings right now."
      >
        <div />
      </SettingsPanelState>
    </SettingsPanelShell>
  );
}
