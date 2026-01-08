import { useState } from "react";

import {
  IconCheckCircle,
  IconCheckmark,
  IconDownload,
  IconNotebook,
  IconQuestion,
  IconShare,
} from "../../../icons";
import {
  TemplateFooterBar,
  TemplateFooterButton,
  TemplateFooterLink,
  TemplateFooterText,
  TemplateFooterDivider,
} from "../../blocks/TemplateFooterBar";

export function TemplateFooterBarDemo() {
  const [progress, setProgress] = useState(65);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSave = () => {
    setSaveLoading(true);
    setTimeout(() => setSaveLoading(false), 2000);
  };

  return (
    <div className="h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Intro Section */}
        <div className="space-y-3 pb-6 border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
          <h1 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Footer Bar Component
          </h1>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            A flexible footer component with variants, status indicators, progress tracking, and compound components.
          </p>
        </div>

        {/* Basic Footer */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Basic Footer Bar
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Simple footer with leading and trailing content
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="h-48 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Content Area
            </div>
            <TemplateFooterBar
              leading={
                <TemplateFooterLink icon={<IconQuestion className="w-3.5 h-3.5" />}>
                  Help
                </TemplateFooterLink>
              }
              trailing={
                <TemplateFooterButton variant="primary" icon={<IconCheckmark className="w-3.5 h-3.5" />}>
                  Save Changes
                </TemplateFooterButton>
              }
            />
          </div>
        </div>

        {/* With Compound Components */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              With Compound Components
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Using TemplateFooterButton, TemplateFooterLink, and TemplateFooterDivider
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="h-48 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Form Content
            </div>
            <TemplateFooterBar
              leading={
                <>
                  <TemplateFooterLink icon={<IconQuestion className="w-3.5 h-3.5" />}>
                    Documentation
                  </TemplateFooterLink>
                  <TemplateFooterDivider />
                  <TemplateFooterText variant="muted">Last saved 2 min ago</TemplateFooterText>
                </>
              }
              trailing={
                <>
                  <TemplateFooterButton variant="ghost">Cancel</TemplateFooterButton>
                  <TemplateFooterButton
                    variant="primary"
                    loading={saveLoading}
                    onClick={handleSave}
                  >
                    Save
                  </TemplateFooterButton>
                </>
              }
            />
          </div>
        </div>

        {/* Status States */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Status Indicators
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Built-in status types with icons
            </p>
          </div>
          <div className="space-y-4">
            {/* Success Status */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-32 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Success State
              </div>
              <TemplateFooterBar
                status={{ type: "success", message: "All changes saved successfully" }}
                trailing={
                  <TemplateFooterButton variant="ghost" size="sm">
                    Close
                  </TemplateFooterButton>
                }
              />
            </div>

            {/* Error Status */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-32 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Error State
              </div>
              <TemplateFooterBar
                status={{ type: "error", message: "Please fix 3 errors before submitting" }}
                trailing={
                  <TemplateFooterButton variant="default" disabled size="sm">
                    Submit
                  </TemplateFooterButton>
                }
              />
            </div>

            {/* Warning Status */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-32 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Warning State
              </div>
              <TemplateFooterBar
                status={{ type: "warning", message: "Unsaved changes will be lost" }}
                trailing={
                  <>
                    <TemplateFooterButton variant="ghost" size="sm">
                      Discard
                    </TemplateFooterButton>
                    <TemplateFooterButton variant="primary" size="sm">
                      Save
                    </TemplateFooterButton>
                  </>
                }
              />
            </div>

            {/* Info Status */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-32 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Info State
              </div>
              <TemplateFooterBar
                status={{ type: "info", message: "Auto-save is enabled" }}
                trailing={
                  <TemplateFooterLink>Settings</TemplateFooterLink>
                }
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Progress Indicator
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Built-in progress tracking with percentage
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="h-48 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center">
              <div className="space-y-4 w-full max-w-xs px-4">
                <div className="text-center text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary text-sm">
                  Upload Progress
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setProgress(Math.max(0, progress - 10))}
                    className="px-3 py-1.5 text-xs bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                    className="px-3 py-1.5 text-xs bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3"
                  >
                    +10%
                  </button>
                </div>
              </div>
            </div>
            <TemplateFooterBar
              progress={{
                value: progress,
                label: "Uploading",
                showPercentage: true,
              }}
              trailing={
                <TemplateFooterButton variant="ghost" size="sm">
                  Cancel
                </TemplateFooterButton>
              }
            />
          </div>
        </div>

        {/* Loading State */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Loading State
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Animated loading indicator
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="h-48 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center">
              <button
                onClick={() => setLoading(!loading)}
                className="px-4 py-2 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 text-sm"
              >
                {loading ? "Stop Loading" : "Start Loading"}
              </button>
            </div>
            <TemplateFooterBar
              loading={loading}
              trailing={
                <TemplateFooterButton variant="default" disabled={loading} size="sm">
                  Submit
                </TemplateFooterButton>
              }
            />
          </div>
        </div>

        {/* Keyboard Shortcut */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Keyboard Shortcut Hint
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Display keyboard shortcuts for quick actions
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="h-48 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Editor Content
            </div>
            <TemplateFooterBar
              leading={
                <TemplateFooterText icon={<IconCheckCircle className="w-3.5 h-3.5" />} variant="success">
                  All changes saved
                </TemplateFooterText>
              }
              shortcut={{ key: "⌘S", label: "to save" }}
              trailing={
                <TemplateFooterButton variant="primary" size="sm">
                  Publish
                </TemplateFooterButton>
              }
            />
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Footer Variants
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Different visual styles for various use cases
            </p>
          </div>
          <div className="space-y-4">
            {/* Default */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-32 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Default Variant
              </div>
              <TemplateFooterBar
                variant="default"
                leading={<TemplateFooterText variant="muted">Default footer</TemplateFooterText>}
                trailing={<TemplateFooterButton size="sm">Action</TemplateFooterButton>}
              />
            </div>

            {/* Elevated */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-32 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Elevated Variant
              </div>
              <TemplateFooterBar
                variant="elevated"
                leading={<TemplateFooterText variant="muted">Elevated with shadow</TemplateFooterText>}
                trailing={<TemplateFooterButton size="sm">Action</TemplateFooterButton>}
              />
            </div>

            {/* Subtle */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-32 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Subtle Variant
              </div>
              <TemplateFooterBar
                variant="subtle"
                leading={<TemplateFooterText variant="muted">Subtle with blur</TemplateFooterText>}
                trailing={<TemplateFooterButton size="sm">Action</TemplateFooterButton>}
              />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Different Sizes
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Small, medium, and large size variants
            </p>
          </div>
          <div className="space-y-4">
            {/* Small */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-24 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Small Size
              </div>
              <TemplateFooterBar
                size="sm"
                leading={<TemplateFooterText variant="muted">Compact footer</TemplateFooterText>}
                trailing={<TemplateFooterButton size="sm">Save</TemplateFooterButton>}
              />
            </div>

            {/* Medium */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-24 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Medium Size (Default)
              </div>
              <TemplateFooterBar
                size="md"
                leading={<TemplateFooterText variant="muted">Standard footer</TemplateFooterText>}
                trailing={<TemplateFooterButton size="sm">Save</TemplateFooterButton>}
              />
            </div>

            {/* Large */}
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
              <div className="h-24 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                Large Size
              </div>
              <TemplateFooterBar
                size="lg"
                leading={<TemplateFooterText variant="muted">Spacious footer</TemplateFooterText>}
                trailing={<TemplateFooterButton size="md">Save</TemplateFooterButton>}
              />
            </div>
          </div>
        </div>

        {/* Complex Example */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Complex Footer
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Multiple elements with center content
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="h-48 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 flex items-center justify-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Document Editor
            </div>
            <TemplateFooterBar
              leading={
                <>
                  <TemplateFooterText icon={<IconNotebook className="w-3.5 h-3.5" />}>
                    1,247 words
                  </TemplateFooterText>
                  <TemplateFooterDivider />
                  <TemplateFooterText variant="muted">Last saved 30s ago</TemplateFooterText>
                </>
              }
              center={
                <>
                  <TemplateFooterButton variant="ghost" size="sm" icon={<IconDownload className="w-3.5 h-3.5" />}>
                    Download
                  </TemplateFooterButton>
                  <TemplateFooterButton variant="ghost" size="sm" icon={<IconShare className="w-3.5 h-3.5" />}>
                    Share
                  </TemplateFooterButton>
                </>
              }
              trailing={
                <>
                  <TemplateFooterButton variant="ghost">Discard</TemplateFooterButton>
                  <TemplateFooterButton variant="primary">Publish</TemplateFooterButton>
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
