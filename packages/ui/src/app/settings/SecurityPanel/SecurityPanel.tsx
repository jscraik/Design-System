import { useState } from "react";

import { Spinner } from "../../../components/ui/feedback/Spinner/Spinner";
import { SettingToggle } from "../SettingToggle";
import { SettingsPanelShell } from "../shared/SettingsPanelShell";
import { SettingsPanelState } from "../shared/SettingsPanelState";
import type { SettingsAsyncState, SettingsPanelProps } from "../shared/types";

export interface SecurityPanelProps extends SettingsPanelProps {
  state?: Exclude<SettingsAsyncState, "empty">;
  busy?: boolean;
  initialMfaEnabled?: boolean;
  errorDescription?: string;
}

export function SecurityPanel({
  onBack,
  state = "ready",
  busy = false,
  initialMfaEnabled = true,
  errorDescription = "We couldn't load your security settings. Try again in a moment.",
}: SecurityPanelProps) {
  const [mfaEnabled, setMfaEnabled] = useState(initialMfaEnabled);

  return (
    <SettingsPanelShell title="Security" onBack={onBack}>
      <SettingsPanelState
        state={state}
        loadingLabel="Loading security settings"
        emptyTitle="Security settings unavailable"
        emptyDescription="Security controls will appear here once your account finishes provisioning."
        errorTitle="Couldn't load security settings"
        errorDescription={errorDescription}
      >
        {busy ? (
          <div
            className="mb-4 flex items-center gap-2 px-3 text-caption text-muted-foreground"
            role="status"
          >
            <Spinner size="sm" variant="muted" label="Saving security settings" />
            <span>Saving security settings…</span>
          </div>
        ) : null}
        <SettingToggle
          label="Multi-factor authentication"
          checked={mfaEnabled}
          onCheckedChange={setMfaEnabled}
          description="You'll only be able to log in using Google while this is on."
          disabled={busy}
        />
        <div className="mt-1 px-3">
          <button
            type="button"
            disabled={busy}
            className="text-caption text-interactive transition-colors hover:text-interactive-hover hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            Learn more
          </button>
        </div>
      </SettingsPanelState>
    </SettingsPanelShell>
  );
}
