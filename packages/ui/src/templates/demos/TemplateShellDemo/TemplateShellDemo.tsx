import { IconChat, IconSettings, IconSidebar, IconUser } from "../../../icons";
import {
  TemplateShell,
  TemplateShellToggleButton,
  useTemplateShell,
} from "../../blocks/TemplateShell";

// Inner component that has access to the TemplateShell context
function DemoContent() {
  const { sidebarCollapsed, detailCollapsed } = useTemplateShell();

  return (
    <div className="h-full p-6 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with info and toggle buttons */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl text-foreground mb-2">Template Shell Demo</h1>
            <p className="text-text-secondary">
              A flexible layout component with collapsible sidebars, animations, and scroll areas.
            </p>
          </div>
          <div className="flex gap-2">
            <TemplateShellToggleButton panel="sidebar" />
            <TemplateShellToggleButton panel="detail" />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-secondary border border-border">
            <div className="flex items-center gap-2 mb-2">
              <IconSidebar className="size-5 text-accent-blue" />
              <h3 className="text-foreground">Collapsible Sidebar</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Status:{" "}
              <span className="font-medium">{sidebarCollapsed ? "Collapsed" : "Expanded"}</span>
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary border border-border">
            <div className="flex items-center gap-2 mb-2">
              <IconSidebar className="size-5 text-accent-blue rotate-180" />
              <h3 className="text-foreground">Collapsible Detail Panel</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Status:{" "}
              <span className="font-medium">{detailCollapsed ? "Collapsed" : "Expanded"}</span>
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <h2 className="text-lg text-foreground">Key Features</h2>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>
                <strong>Collapsible panels</strong> - Toggle sidebar and detail panel visibility
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>
                <strong>Smooth animations</strong> - Animated transitions with configurable timing
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>
                <strong>ScrollArea integration</strong> - Body content scrolls independently
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>
                <strong>Context API</strong> - Access shell state from any child component
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>
                <strong>Configurable widths</strong> - Set custom widths for sidebar and detail
                panel
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>
                <strong>ARIA support</strong> - Built-in accessibility attributes
              </span>
            </li>
          </ul>
        </div>

        {/* Sample Content */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-secondary border border-border">
            <h3 className="text-foreground mb-1">Content Block {i + 1}</h3>
            <p className="text-sm text-text-secondary">
              This demonstrates scrollable content in the body section. The sidebar and detail panel
              remain fixed while this content scrolls.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TemplateShellDemo() {
  return (
    <TemplateShell
      sidebarWidth={260}
      detailWidth={280}
      animated={true}
      showDividers={true}
      bodyScrollable={true}
      sidebar={
        <div className="h-full p-4 flex flex-col">
          <div className="mb-6">
            <h3 className="text-foreground mb-1">Navigation</h3>
            <p className="text-xs text-muted-foreground">Try collapsing this panel</p>
          </div>
          <nav className="space-y-1 flex-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
              <IconChat className="size-5 shrink-0" />
              <span>Chats</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
              <IconUser className="size-5 shrink-0" />
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
              <IconSettings className="size-5 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      }
      header={
        <div className="h-14 px-6 flex items-center justify-between">
          <h2 className="text-foreground">Header Section</h2>
          <div className="text-xs text-muted-foreground">Fixed header with divider</div>
        </div>
      }
      body={<DemoContent />}
      footer={
        <div className="h-16 px-6 flex items-center justify-between">
          <span className="text-sm text-text-secondary">Footer Section</span>
          <button className="px-4 py-2 bg-accent-blue text-accent-foreground rounded-lg hover:bg-accent-blue/90 transition-colors">
            Action Button
          </button>
        </div>
      }
      detail={
        <div className="h-full p-4 flex flex-col">
          <div className="mb-4">
            <h3 className="text-foreground mb-1">Details</h3>
            <p className="text-xs text-muted-foreground">Additional information panel</p>
          </div>
          <div className="space-y-3 flex-1">
            <div className="p-3 rounded-lg bg-muted dark:bg-secondary">
              <div className="text-xs text-muted-foreground mb-1">Panel Width</div>
              <div className="text-sm text-foreground">280px</div>
            </div>
            <div className="p-3 rounded-lg bg-muted dark:bg-secondary">
              <div className="text-xs text-muted-foreground mb-1">Animation</div>
              <div className="text-sm text-foreground">Enabled (200ms)</div>
            </div>
            <div className="p-3 rounded-lg bg-muted dark:bg-secondary">
              <div className="text-xs text-muted-foreground mb-1">Scroll Mode</div>
              <div className="text-sm text-foreground">Body only</div>
            </div>
          </div>
        </div>
      }
    />
  );
}
