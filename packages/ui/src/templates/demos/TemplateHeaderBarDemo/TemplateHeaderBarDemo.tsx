import {
  IconChevronLeftMd,
  IconDotsHorizontal,
  IconDownload,
  IconNotification,
  IconPlusLg,
  IconSearch,
  IconSettings,
  IconShare,
} from "../../../icons";
import { TemplateHeaderBar } from "../../blocks/TemplateHeaderBar";

export function TemplateHeaderBarDemo() {
  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Intro Section */}
        <div className="space-y-3 pb-6 border-b border-border">
          <h1 className="text-2xl font-semibold text-foreground">Header Bar Component</h1>
          <p className="text-text-secondary">
            A flexible header component with multiple variants, sizes, and compound components for
            common patterns.
          </p>
        </div>

        {/* Basic Examples */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-1">Basic Header Bar</h2>
            <p className="text-sm text-text-secondary">Simple header with just a title</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <TemplateHeaderBar title="Dashboard" />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-1">With Leading Icon</h2>
            <p className="text-sm text-text-secondary">Back button and title</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <TemplateHeaderBar
              title="Settings"
              leading={
                <button className="p-1.5 -ml-1 hover:bg-muted rounded-lg transition-colors">
                  <IconChevronLeftMd className="w-5 h-5 text-text-secondary" />
                </button>
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-1">With Trailing Actions</h2>
            <p className="text-sm text-text-secondary">Title with action buttons on the right</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <TemplateHeaderBar
              title="Projects"
              trailing={
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <IconSearch className="w-5 h-5 text-text-secondary" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <IconNotification className="w-5 h-5 text-text-secondary" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <IconSettings className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-1">With Leading and Trailing</h2>
            <p className="text-sm text-text-secondary">
              Full navigation header with actions on both sides
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <TemplateHeaderBar
              title="Document Editor"
              leading={
                <button className="p-1.5 -ml-1 hover:bg-muted rounded-lg transition-colors">
                  <IconChevronLeftMd className="w-5 h-5 text-text-secondary" />
                </button>
              }
              trailing={
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg hover:bg-muted text-sm text-text-secondary flex items-center gap-2 transition-colors">
                    <IconDownload className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button className="px-3 py-1.5 rounded-lg hover:bg-muted text-sm text-text-secondary flex items-center gap-2 transition-colors">
                    <IconShare className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <IconDotsHorizontal className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-1">With Primary Action Button</h2>
            <p className="text-sm text-text-secondary">Header with a prominent CTA button</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <TemplateHeaderBar
              title="My Tasks"
              trailing={
                <button className="px-4 py-2 bg-button-primary-bg-light dark:bg-button-primary-bg-dark text-button-primary-text-light dark:text-button-primary-text-dark rounded-lg hover:bg-button-primary-bg-light-hover dark:hover:bg-button-primary-bg-dark-hover flex items-center gap-2 font-medium shadow-sm transition-all">
                  <IconPlusLg className="w-4 h-4" />
                  <span>New Task</span>
                </button>
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-1">Elevated Variant</h2>
            <p className="text-sm text-text-secondary">Header with subtle shadow for depth</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-border">
            <TemplateHeaderBar
              title="Custom Header"
              variant="elevated"
              trailing={
                <button className="text-sm font-medium text-button-primary-bg-light dark:text-button-primary-bg-dark hover:underline">
                  View All
                </button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
