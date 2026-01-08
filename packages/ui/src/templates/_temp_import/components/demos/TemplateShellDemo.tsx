import { MessageSquare, Settings, User, PanelLeftClose, PanelRightClose } from "lucide-react";

import { TemplateShell, TemplateShellToggleButton, useTemplateShell } from "../TemplateShell";

// Inner component that has access to the TemplateShell context
function DemoContent() {
  const { sidebarCollapsed, detailCollapsed } = useTemplateShell();

  return (
    <div className="h-full p-6 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with info and toggle buttons */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
              Template Shell Demo
            </h1>
            <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
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
          <div className="p-4 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
            <div className="flex items-center gap-2 mb-2">
              <PanelLeftClose className="size-5 text-foundation-accent-blue" />
              <h3 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Collapsible Sidebar
              </h3>
            </div>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Status: <span className="font-medium">{sidebarCollapsed ? "Collapsed" : "Expanded"}</span>
            </p>
          </div>

          <div className="p-4 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
            <div className="flex items-center gap-2 mb-2">
              <PanelRightClose className="size-5 text-foundation-accent-blue" />
              <h3 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Collapsible Detail Panel
              </h3>
            </div>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Status: <span className="font-medium">{detailCollapsed ? "Collapsed" : "Expanded"}</span>
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <h2 className="text-lg text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Key Features
          </h2>
          <ul className="space-y-2 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            <li className="flex items-start gap-2">
              <span className="text-foundation-accent-green mt-1">✓</span>
              <span><strong>Collapsible panels</strong> - Toggle sidebar and detail panel visibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foundation-accent-green mt-1">✓</span>
              <span><strong>Smooth animations</strong> - Animated transitions with configurable timing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foundation-accent-green mt-1">✓</span>
              <span><strong>ScrollArea integration</strong> - Body content scrolls independently</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foundation-accent-green mt-1">✓</span>
              <span><strong>Context API</strong> - Access shell state from any child component</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foundation-accent-green mt-1">✓</span>
              <span><strong>Configurable widths</strong> - Set custom widths for sidebar and detail panel</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foundation-accent-green mt-1">✓</span>
              <span><strong>ARIA support</strong> - Built-in accessibility attributes</span>
            </li>
          </ul>
        </div>

        {/* Sample Content */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3"
          >
            <h3 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Content Block {i + 1}
            </h3>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              This demonstrates scrollable content in the body section. The sidebar and detail panel remain fixed while this content scrolls.
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
            <h3 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Navigation
            </h3>
            <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Try collapsing this panel
            </p>
          </div>
          <nav className="space-y-1 flex-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary transition-colors">
              <MessageSquare className="size-5 shrink-0" />
              <span>Chats</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary transition-colors">
              <User className="size-5 shrink-0" />
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary transition-colors">
              <Settings className="size-5 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      }
      header={
        <div className="h-14 px-6 flex items-center justify-between">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Header Section
          </h2>
          <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
            Fixed header with divider
          </div>
        </div>
      }
      body={<DemoContent />}
      footer={
        <div className="h-16 px-6 flex items-center justify-between">
          <span className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Footer Section
          </span>
          <button className="px-4 py-2 bg-foundation-accent-blue text-white rounded-lg hover:bg-foundation-accent-blue/90 transition-colors">
            Action Button
          </button>
        </div>
      }
      detail={
        <div className="h-full p-4 flex flex-col">
          <div className="mb-4">
            <h3 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Details
            </h3>
            <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Additional information panel
            </p>
          </div>
          <div className="space-y-3 flex-1">
            <div className="p-3 rounded-lg bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-2">
              <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mb-1">
                Panel Width
              </div>
              <div className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                280px
              </div>
            </div>
            <div className="p-3 rounded-lg bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-2">
              <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mb-1">
                Animation
              </div>
              <div className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Enabled (200ms)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-2">
              <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mb-1">
                Scroll Mode
              </div>
              <div className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Body only
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}