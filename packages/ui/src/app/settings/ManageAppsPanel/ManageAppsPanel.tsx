import { IconChevronRightMd } from "../../../icons/ChatGPTIcons";
import { SettingsPanelShell } from "../shared/SettingsPanelShell";
import { SettingsPanelState } from "../shared/SettingsPanelState";
import type { SettingsAsyncState, SettingsPanelProps } from "../shared/types";

interface ManagedApp {
  name: string;
  status: string;
  toneClass: string;
  textClass?: string;
}

export interface ManageAppsPanelProps extends SettingsPanelProps {
  state?: SettingsAsyncState;
  connectedApps?: ManagedApp[];
  availableApps?: ManagedApp[];
  errorDescription?: string;
}

const DEFAULT_CONNECTED_APPS: ManagedApp[] = [
  { name: "Notes", status: "Enabled via Accessibility", toneClass: "bg-accent-orange" },
  { name: "Script Editor", status: "Enabled via Accessibility", toneClass: "bg-muted-foreground" },
  {
    name: "Terminal",
    status: "Enabled via Accessibility",
    toneClass: "bg-secondary border border-border",
    textClass: "text-foreground",
  },
  { name: "TextEdit", status: "Enabled via Accessibility", toneClass: "bg-accent-blue" },
  { name: "Warp", status: "Enabled via Accessibility", toneClass: "bg-accent-green" },
];

const DEFAULT_AVAILABLE_APPS: ManagedApp[] = [
  { name: "Code", status: "Requires extension", toneClass: "bg-accent-blue" },
  { name: "Code - Insiders", status: "Requires extension", toneClass: "bg-accent-green" },
];

function AppIcon({
  name,
  toneClass,
  textClass = "text-text-body-on-color",
}: {
  name: string;
  toneClass: string;
  textClass?: string;
}) {
  return (
    <div className={`flex size-5 shrink-0 items-center justify-center rounded ${toneClass}`}>
      <span className={`${textClass} text-caption font-semibold`}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function ConnectAppsAction() {
  return (
    <button
      type="button"
      className="rounded-md bg-secondary px-4 py-2 text-body-small text-foreground transition-colors hover:bg-secondary/80"
    >
      Explore app connections
    </button>
  );
}

export function ManageAppsPanel({
  onBack,
  state = "ready",
  connectedApps = DEFAULT_CONNECTED_APPS,
  availableApps = DEFAULT_AVAILABLE_APPS,
  errorDescription = "We couldn't load your app connection status. Try again in a moment.",
}: ManageAppsPanelProps) {
  const effectiveState =
    state === "ready" && connectedApps.length === 0 && availableApps.length === 0 ? "empty" : state;

  return (
    <SettingsPanelShell title="Manage Apps" onBack={onBack}>
      <SettingsPanelState
        state={effectiveState}
        loadingLabel="Loading app management"
        emptyTitle="No app connections yet"
        emptyDescription="Connect an editor or tool so ChatGPT can work with your apps directly."
        emptyAction={<ConnectAppsAction />}
        errorTitle="Couldn't load app management"
        errorDescription={errorDescription}
      >
        <div className="mb-6">
          <h3 className="mb-1 text-body-small font-semibold text-foreground">Work with Apps</h3>
          <p className="mb-4 text-caption text-muted-foreground">
            Allow ChatGPT to work with code and text editors.
          </p>

          <div className="mb-6">
            <h4 className="mb-2 px-3 text-caption font-semibold text-muted-foreground">
              Connected apps
            </h4>
            <div className="space-y-0.5">
              {connectedApps.map((app) => (
                <button
                  type="button"
                  key={app.name}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon name={app.name} toneClass={app.toneClass} textClass={app.textClass} />
                    <div>
                      <div className="text-body-small text-foreground">{app.name}</div>
                      <div className="text-caption text-accent-green">{app.status}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-body-small text-text-secondary">Manage</span>
                    <IconChevronRightMd className="size-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 px-3 text-caption font-semibold text-muted-foreground">
              Available to Connect
            </h4>
            <div className="space-y-0.5">
              {availableApps.map((app) => (
                <button
                  type="button"
                  key={app.name}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon name={app.name} toneClass={app.toneClass} textClass={app.textClass} />
                    <div>
                      <div className="text-body-small text-foreground">{app.name}</div>
                      <div className="text-caption text-muted-foreground">{app.status}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-body-small text-text-secondary">Install Extension</span>
                    <IconChevronRightMd className="size-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsPanelState>
    </SettingsPanelShell>
  );
}
