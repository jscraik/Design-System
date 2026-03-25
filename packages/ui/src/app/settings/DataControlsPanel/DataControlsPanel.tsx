import { useState } from "react";

import { SectionHeader } from "../../../components/ui/base/SectionHeader";
import { Spinner } from "../../../components/ui/feedback/Spinner/Spinner";
import { SettingToggle } from "../SettingToggle";
import { SettingsPanelShell } from "../shared/SettingsPanelShell";
import { SettingsPanelState } from "../shared/SettingsPanelState";
import type { SettingsAsyncState, SettingsPanelProps } from "../shared/types";

export interface DataControlsPanelProps extends SettingsPanelProps {
  state?: Exclude<SettingsAsyncState, "empty">;
  busy?: boolean;
  initialImproveModel?: boolean;
  initialIncludeAudioRecordings?: boolean;
  initialIncludeVideoRecordings?: boolean;
  errorDescription?: string;
}

export function DataControlsPanel({
  onBack,
  state = "ready",
  busy = false,
  initialImproveModel = true,
  initialIncludeAudioRecordings = true,
  initialIncludeVideoRecordings = true,
  errorDescription = "We couldn't load your data controls. Try again in a moment.",
}: DataControlsPanelProps) {
  const [improveModel, setImproveModel] = useState(initialImproveModel);
  const [includeAudioRecordings, setIncludeAudioRecordings] = useState(
    initialIncludeAudioRecordings,
  );
  const [includeVideoRecordings, setIncludeVideoRecordings] = useState(
    initialIncludeVideoRecordings,
  );

  return (
    <SettingsPanelShell title="Data controls" onBack={onBack}>
      <SettingsPanelState
        state={state}
        loadingLabel="Loading data controls"
        emptyTitle="Data controls unavailable"
        emptyDescription="Data controls will appear here once your workspace finishes provisioning."
        errorTitle="Couldn't load data controls"
        errorDescription={errorDescription}
      >
        <div className="space-y-6">
          {busy ? (
            <div
              className="mb-4 flex items-center gap-2 px-3 text-caption text-muted-foreground"
              role="status"
            >
              <Spinner size="sm" variant="muted" label="Saving data controls" />
              <span>Saving data controls…</span>
            </div>
          ) : null}

          <div>
            <SettingToggle
              checked={improveModel}
              onCheckedChange={setImproveModel}
              label="Improve the model for everyone"
              description="Allow your content to be used to train our models, which makes ChatGPT better for you and everyone who uses it. We take steps to protect your privacy."
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
          </div>

          <div className="space-y-3">
            <SectionHeader title="Voice mode" size="md" className="px-3" />

            <div>
              <SettingToggle
                checked={includeAudioRecordings}
                onCheckedChange={setIncludeAudioRecordings}
                label="Include audio recordings"
                disabled={busy}
              />
            </div>

            <div>
              <SettingToggle
                checked={includeVideoRecordings}
                onCheckedChange={setIncludeVideoRecordings}
                label="Include video recordings"
                description="Include your audio or video recordings from Voice Mode to train our models. Transcripts and other data are covered by Improve the model for everyone."
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
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-body-small font-normal text-foreground">Archive all chats</span>
              <button
                type="button"
                disabled={busy}
                className="rounded-md bg-muted px-3 py-1.5 text-body-small font-normal text-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Archive
              </button>
            </div>

            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-body-small font-normal text-foreground">Delete all chats</span>
              <button
                type="button"
                disabled={busy}
                className="rounded-md bg-status-error px-3 py-1.5 text-body-small font-normal text-text-body-on-color transition-colors hover:bg-status-error/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete all
              </button>
            </div>

            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-body-small font-normal text-foreground">Export data</span>
              <button
                type="button"
                disabled={busy}
                className="rounded-md bg-muted px-3 py-1.5 text-body-small font-normal text-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Export
              </button>
            </div>
          </div>

          <div className="px-3">
            <button
              type="button"
              disabled={busy}
              className="text-body-small font-normal text-status-error transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete account
            </button>
          </div>
        </div>
      </SettingsPanelState>
    </SettingsPanelShell>
  );
}
