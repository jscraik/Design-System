import { ProductSection } from "../../../components/ui/layout/ProductComposition";
import { IconChevronRightMd } from "../../../icons/ChatGPTIcons";
import { SettingsPanelShell } from "../shared/SettingsPanelShell";
import { SettingsPanelState } from "../shared/SettingsPanelState";
import type { SettingsAsyncState, SettingsPanelProps } from "../shared/types";

interface AppsPanelItem {
  name: string;
  icon: string;
  toneClass: string;
  textClass?: string;
}

export interface AppsPanelProps extends SettingsPanelProps {
  state?: SettingsAsyncState;
  enabledApps?: AppsPanelItem[];
  errorDescription?: string;
}

const DEFAULT_ENABLED_APPS: AppsPanelItem[] = [
  { name: "Canva", icon: "C", toneClass: "bg-accent-green" },
  { name: "Code for Slack", icon: "S", toneClass: "bg-accent-orange" },
  { name: "Dropbox", icon: "D", toneClass: "bg-accent-blue" },
  { name: "Figma", icon: "F", toneClass: "bg-status-error" },
  {
    name: "GitHub",
    icon: "G",
    toneClass: "bg-secondary border border-border",
    textClass: "text-foreground",
  },
  { name: "Linear", icon: "L", toneClass: "bg-accent-blue" },
  { name: "Linear Coder Agent", icon: "L", toneClass: "bg-accent-blue" },
  {
    name: "Notion",
    icon: "N",
    toneClass: "bg-secondary border border-border",
    textClass: "text-foreground",
  },
  { name: "Outlook Calendar", icon: "O", toneClass: "bg-accent-blue" },
  { name: "Outlook Email", icon: "O", toneClass: "bg-accent-blue" },
  { name: "PEER", icon: "P", toneClass: "bg-muted-foreground" },
  { name: "SharePoint", icon: "S", toneClass: "bg-accent-blue" },
  { name: "Shopping research", icon: "S", toneClass: "bg-accent-green" },
  { name: "Slack", icon: "S", toneClass: "bg-accent-orange" },
  {
    name: "Sora",
    icon: "S",
    toneClass: "bg-secondary border border-border",
    textClass: "text-foreground",
  },
  { name: "Teams", icon: "T", toneClass: "bg-accent-blue" },
  { name: "todo", icon: "T", toneClass: "bg-accent-blue" },
  { name: "Your 'app with ChatGPT'", icon: "Y", toneClass: "bg-accent-orange" },
];

function AppIcon({
  children,
  toneClass,
  textClass = "text-text-body-on-color",
}: {
  children: React.ReactNode;
  toneClass: string;
  textClass?: string;
}) {
  return (
    <div className={`flex size-5 shrink-0 items-center justify-center rounded ${toneClass}`}>
      <span className={`${textClass} text-caption font-semibold`}>{children}</span>
    </div>
  );
}

function BrowseAppsButton() {
  return (
    <button
      type="button"
      className="rounded-md bg-secondary px-4 py-2 text-body-small text-foreground transition-colors hover:bg-secondary/80"
    >
      Browse Apps
    </button>
  );
}

export function AppsPanel({
  onBack,
  state = "ready",
  enabledApps = DEFAULT_ENABLED_APPS,
  errorDescription = "We couldn't load your app connections right now. Try refreshing this panel.",
}: AppsPanelProps) {
  const effectiveState = state === "ready" && enabledApps.length === 0 ? "empty" : state;

  return (
    <SettingsPanelShell title="Apps" onBack={onBack}>
      <SettingsPanelState
        state={effectiveState}
        loadingLabel="Loading apps"
        emptyTitle="No apps enabled yet"
        emptyDescription="Connect an app to let ChatGPT work with your files, docs, and tools."
        emptyAction={<BrowseAppsButton />}
        errorTitle="Couldn't load apps"
        errorDescription={errorDescription}
      >
        <div className="space-y-6">
          <ProductSection title="Enabled apps" density="compact">
            <div className="space-y-0.5">
              {enabledApps.map((app) => (
                <button
                  type="button"
                  key={app.name}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon toneClass={app.toneClass} textClass={app.textClass}>
                      {app.icon}
                    </AppIcon>
                    <span className="text-body-small text-foreground">{app.name}</span>
                  </div>
                  <IconChevronRightMd className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>

            <div className="px-3">
              <p className="text-caption text-muted-foreground">
                ChatGPT can access information from connected apps. Your permissions are always
                respected.{" "}
                <button
                  type="button"
                  className="text-interactive transition-colors hover:text-interactive-hover hover:underline"
                >
                  Learn more
                </button>
              </p>
            </div>
          </ProductSection>

          <ProductSection title="All apps" density="compact">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-center gap-3">
                <div className="bg-muted flex size-5 items-center justify-center rounded">
                  <svg
                    className="size-3 text-text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                <span className="text-body-small text-foreground">Browse Apps</span>
              </div>
              <IconChevronRightMd className="size-4 text-muted-foreground" />
            </button>
          </ProductSection>
        </div>
      </SettingsPanelState>
    </SettingsPanelShell>
  );
}
