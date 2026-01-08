import { useState } from "react";

import {
  IconCamera,
  IconCategory,
  IconChevronRightMd,
  IconCreditCard,
  IconDownload,
  IconEmail,
  IconError,
  IconGlobe,
  IconGrid3x3,
  IconHeadphones,
  IconImage,
  IconInfo,
  IconLock,
  IconNotebook,
  IconNotification,
  IconQuestion,
  IconRefresh,
  IconShare,
  IconSparkles,
  IconStar,
  IconTelescope,
  IconUser,
  IconUserLock,
  IconPhone,
  IconFolder,
  IconSettings,
} from "../../../icons";
import {
  SettingRowBlock,
  SettingRowValue,
  SettingRowBadge,
  SettingRowGroup,
  SettingRowDivider,
} from "../../blocks/SettingRowBlock";

export function SettingRowBlockDemo() {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [loadingRow, setLoadingRow] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setSelectedRow(id);
    console.log(`Clicked: ${id}`);
  };

  const handleLoadingClick = (id: string) => {
    setLoadingRow(id);
    setTimeout(() => setLoadingRow(null), 2000);
  };

  return (
    <div className="h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Introduction */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Setting Row Block
          </h1>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Comprehensive settings row component with 4 variants, 3 sizes, badges, loading states,
            keyboard shortcuts, and full accessibility support.
          </p>
        </div>

        {/* 1. Variants */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              1. Variants
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Four visual variants: default, card, compact, and danger
            </p>
          </div>

          <div className="space-y-4">
            {/* Default Variant */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Default
              </h3>
              <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
                <SettingRowBlock
                  variant="default"
                  icon={<IconUser />}
                  label="Profile Settings"
                  description="Manage your profile information and preferences"
                  onClick={() => handleClick("profile")}
                />
                <SettingRowBlock
                  variant="default"
                  icon={<IconEmail />}
                  label="Email Notifications"
                  description="Control how you receive email updates"
                  onClick={() => handleClick("email")}
                />
              </div>
            </div>

            {/* Card Variant */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Card
              </h3>
              <div className="space-y-2">
                <SettingRowBlock
                  variant="card"
                  icon={<IconUserLock />}
                  label="Security Settings"
                  description="Configure authentication and security features"
                  onClick={() => handleClick("security")}
                />
                <SettingRowBlock
                  variant="card"
                  icon={<IconNotification />}
                  label="Push Notifications"
                  description="Manage mobile and desktop notifications"
                  onClick={() => handleClick("push")}
                />
              </div>
            </div>

            {/* Compact Variant */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Compact
              </h3>
              <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
                <SettingRowBlock
                  variant="compact"
                  icon={<IconSparkles />}
                  label="Theme"
                  onClick={() => handleClick("theme")}
                  right={<SettingRowValue variant="muted">Dark</SettingRowValue>}
                />
                <SettingRowBlock
                  variant="compact"
                  icon={<IconGlobe />}
                  label="Language"
                  onClick={() => handleClick("language")}
                  right={<SettingRowValue variant="muted">English (US)</SettingRowValue>}
                />
              </div>
            </div>

            {/* Danger Variant */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Danger
              </h3>
              <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
                <SettingRowBlock
                  variant="danger"
                  icon={<IconError />}
                  label="Delete Account"
                  description="Permanently delete your account and all associated data"
                  onClick={() => handleClick("delete")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Sizes */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              2. Sizes
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Three size presets: small, medium, and large
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingRowBlock
              size="sm"
              icon={<IconSettings />}
              label="Small Size"
              description="Compact spacing for dense layouts"
              onClick={() => handleClick("size-sm")}
            />
            <SettingRowBlock
              size="md"
              icon={<IconSettings />}
              label="Medium Size (Default)"
              description="Standard spacing for most use cases"
              onClick={() => handleClick("size-md")}
            />
            <SettingRowBlock
              size="lg"
              icon={<IconSettings />}
              label="Large Size"
              description="Generous spacing for prominent settings"
              onClick={() => handleClick("size-lg")}
            />
          </div>
        </div>

        {/* 3. Badges */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              3. Badges
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Status badges in multiple variants
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingRowBlock
              icon={<IconSparkles />}
              label="AI Features"
              description="Enable advanced AI-powered capabilities"
              badge={<SettingRowBadge variant="new">New</SettingRowBadge>}
              onClick={() => handleClick("ai")}
            />
            <SettingRowBlock
              icon={<IconSparkles />}
              label="Performance Mode"
              description="Optimize for speed and efficiency"
              badge={<SettingRowBadge variant="primary">Pro</SettingRowBadge>}
              onClick={() => handleClick("performance")}
            />
            <SettingRowBlock
              icon={<IconRefresh />}
              label="Beta Features"
              description="Try experimental features before release"
              badge={<SettingRowBadge variant="warning">Beta</SettingRowBadge>}
              onClick={() => handleClick("beta")}
            />
            <SettingRowBlock
              icon={<IconStar />}
              label="Premium Access"
              description="Unlock exclusive premium features"
              badge={<SettingRowBadge variant="success">Active</SettingRowBadge>}
              onClick={() => handleClick("premium")}
            />
          </div>
        </div>

        {/* 4. States */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              4. States
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Loading, disabled, and selected states
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingRowBlock
              icon={<IconDownload />}
              label="Download Data"
              description="Export your data to a file"
              loading={loadingRow === "download"}
              onClick={() => handleLoadingClick("download")}
            />
            <SettingRowBlock
              icon={<IconShare />}
              label="Sync Settings"
              description="Synchronize across all devices"
              selected={selectedRow === "sync"}
              onClick={() => handleClick("sync")}
            />
            <SettingRowBlock
              icon={<IconFolder />}
              label="Backup Options"
              description="Configure automatic backups"
              disabled
              onClick={() => handleClick("backup")}
            />
          </div>
        </div>

        {/* 5. Keyboard Shortcuts */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              5. Keyboard Shortcuts
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Display keyboard shortcuts for power users
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingRowBlock
              icon={<IconSettings />}
              label="Quick Settings"
              description="Access frequently used settings"
              shortcut="⌘K"
              onClick={() => handleClick("quick")}
            />
            <SettingRowBlock
              icon={<IconLock />}
              label="Keyboard Shortcuts"
              description="View all available keyboard shortcuts"
              shortcut="⌘/"
              onClick={() => handleClick("shortcuts")}
            />
          </div>
        </div>

        {/* 6. External Links */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              6. External Links
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Indicate links that open externally
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingRowBlock
              icon={<IconNotebook />}
              label="Terms of Service"
              description="Read our terms and conditions"
              external
              onClick={() => window.open("https://example.com/terms", "_blank")}
            />
            <SettingRowBlock
              icon={<IconLock />}
              label="Privacy Policy"
              description="Learn how we protect your data"
              external
              onClick={() => window.open("https://example.com/privacy", "_blank")}
            />
            <SettingRowBlock
              icon={<IconQuestion />}
              label="Help Center"
              description="Get support and documentation"
              external
              onClick={() => window.open("https://example.com/help", "_blank")}
            />
          </div>
        </div>

        {/* 7. Custom Right Content */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              7. Custom Right Content
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Display values, indicators, or custom components
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingRowBlock
              icon={<IconCreditCard />}
              label="Subscription Plan"
              description="Manage your subscription"
              onClick={() => handleClick("subscription")}
              right={<SettingRowValue variant="accent">Pro Plan</SettingRowValue>}
            />
            <SettingRowBlock
              icon={<IconFolder />}
              label="Storage Usage"
              description="View and manage storage"
              onClick={() => handleClick("storage")}
              right={<SettingRowValue variant="muted">2.4 GB / 5 GB</SettingRowValue>}
            />
            <SettingRowBlock
              icon={<IconPhone />}
              label="Connected Devices"
              description="Manage your active sessions"
              onClick={() => handleClick("devices")}
              right={
                <div className="flex items-center gap-2">
                  <SettingRowBadge variant="primary">3 active</SettingRowBadge>
                  <IconChevronRightMd className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
                </div>
              }
            />
          </div>
        </div>

        {/* 8. Display-Only Rows */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              8. Display-Only Rows
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Rows without onClick are non-interactive
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingRowBlock
              icon={<IconUser />}
              label="Account ID"
              right={
                <SettingRowValue variant="muted" className="font-mono text-xs">
                  usr_abc123xyz
                </SettingRowValue>
              }
            />
            <SettingRowBlock
              icon={<IconEmail />}
              label="Email Address"
              right={<SettingRowValue>user@example.com</SettingRowValue>}
            />
            <SettingRowBlock
              icon={<IconGrid3x3 />}
              label="Last Login"
              right={<SettingRowValue variant="muted">2 hours ago</SettingRowValue>}
            />
            <SettingRowBlock
              icon={<IconInfo />}
              label="App Version"
              right={<SettingRowValue variant="muted">v2.4.1</SettingRowValue>}
            />
          </div>
        </div>

        {/* 9. Without Icons */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              9. Without Icons
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Rows work perfectly without icons
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingRowBlock label="General" onClick={() => handleClick("general")} />
            <SettingRowBlock
              label="Advanced Settings"
              description="Configure advanced options and features"
              onClick={() => handleClick("advanced")}
            />
            <SettingRowBlock label="About" onClick={() => handleClick("about")} />
          </div>
        </div>

        {/* 10. Compound Components - SettingRowGroup */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              10. Row Groups
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Organize rows with labels and dividers
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingRowGroup
              label="Account Settings"
              description="Manage your account information and preferences"
            >
              <SettingRowBlock
                icon={<IconUser />}
                label="Profile"
                onClick={() => handleClick("profile-group")}
              />
              <SettingRowBlock
                icon={<IconEmail />}
                label="Email"
                onClick={() => handleClick("email-group")}
              />
              <SettingRowBlock
                icon={<IconTelescope />}
                label="Privacy"
                onClick={() => handleClick("privacy-group")}
              />
            </SettingRowGroup>

            <SettingRowDivider />

            <SettingRowGroup label="Preferences">
              <SettingRowBlock
                icon={<IconSparkles />}
                label="Theme"
                onClick={() => handleClick("theme-group")}
              />
              <SettingRowBlock
                icon={<IconGlobe />}
                label="Language"
                onClick={() => handleClick("language-group")}
              />
              <SettingRowBlock
                icon={<IconHeadphones />}
                label="Sound"
                onClick={() => handleClick("sound-group")}
              />
            </SettingRowGroup>
          </div>
        </div>

        {/* 11. Mixed Content */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              11. Mixed Content
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Combining different features and styles
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingRowBlock
              size="lg"
              variant="card"
              icon={<IconStar />}
              label="Premium Features"
              description="Unlock all pro features with a premium subscription"
              badge={<SettingRowBadge variant="new">New</SettingRowBadge>}
              onClick={() => handleClick("premium-mixed")}
              right={<SettingRowValue variant="accent">$9.99/mo</SettingRowValue>}
            />
            <SettingRowBlock
              icon={<IconImage />}
              label="Image Quality"
              description="Choose default quality for uploads"
              shortcut="⌘I"
              onClick={() => handleClick("image-quality")}
              right={<SettingRowValue variant="muted">High</SettingRowValue>}
            />
            <SettingRowBlock
              size="sm"
              variant="compact"
              icon={<IconRefresh />}
              label="Analytics"
              badge={<SettingRowBadge variant="success">Enabled</SettingRowBadge>}
              onClick={() => handleClick("analytics")}
            />
          </div>
        </div>

        {/* 12. Real-World Examples */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              12. Real-World Examples
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Complete settings panel examples
            </p>
          </div>

          {/* Privacy & Security */}
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingRowGroup label="Privacy & Security">
              <SettingRowBlock
                icon={<IconUserLock />}
                label="Two-Factor Authentication"
                description="Add an extra layer of security"
                badge={<SettingRowBadge variant="success">Enabled</SettingRowBadge>}
                onClick={() => handleClick("2fa")}
              />
              <SettingRowBlock
                icon={<IconTelescope />}
                label="Privacy Settings"
                description="Control who can see your information"
                onClick={() => handleClick("privacy-real")}
              />
              <SettingRowBlock
                icon={<IconPhone />}
                label="Connected Devices"
                description="Manage devices that can access your account"
                onClick={() => handleClick("devices-real")}
                right={<SettingRowValue variant="muted">3 active</SettingRowValue>}
              />
            </SettingRowGroup>
          </div>

          {/* Billing & Subscription */}
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingRowGroup label="Billing & Subscription">
              <SettingRowBlock
                icon={<IconCreditCard />}
                label="Current Plan"
                description="Professional plan with unlimited features"
                onClick={() => handleClick("plan-real")}
                right={<SettingRowValue variant="accent">Pro</SettingRowValue>}
              />
              <SettingRowBlock
                icon={<IconDownload />}
                label="Download Invoices"
                description="Access your billing history"
                onClick={() => handleClick("invoices")}
              />
              <SettingRowBlock
                variant="danger"
                icon={<IconError />}
                label="Cancel Subscription"
                description="End your subscription and downgrade to free"
                onClick={() => handleClick("cancel")}
              />
            </SettingRowGroup>
          </div>
        </div>

        {/* 13. Accessibility */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              13. Accessibility
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Full ARIA support and keyboard navigation
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-4 space-y-2">
            <ul className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
              <li>✓ Proper ARIA labels and attributes</li>
              <li>✓ Keyboard navigation support (Tab, Enter, Space)</li>
              <li>✓ Focus visible states</li>
              <li>✓ Screen reader compatible</li>
              <li>✓ Semantic HTML with proper roles</li>
              <li>✓ Color contrast compliant</li>
            </ul>
          </div>
        </div>

        {/* 14. Design Tokens */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              14. Design Token Compliance
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              100% ChatGPT design system compliance
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                  Colors
                </h4>
                <ul className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
                  <li>• foundation-bg-* (backgrounds)</li>
                  <li>• foundation-text-* (text colors)</li>
                  <li>• foundation-accent-* (accents)</li>
                  <li>• foundation-icon-* (icons)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                  Spacing
                </h4>
                <ul className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
                  <li>• Consistent padding</li>
                  <li>• Proper gap values</li>
                  <li>• Responsive spacing</li>
                  <li>• Size variants (sm/md/lg)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                  Typography
                </h4>
                <ul className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
                  <li>• System font stack</li>
                  <li>• Proper text sizes</li>
                  <li>• Optimized line heights</li>
                  <li>• Font weight hierarchy</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                  Interactions
                </h4>
                <ul className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
                  <li>• Smooth transitions</li>
                  <li>• Hover/active states</li>
                  <li>• Focus indicators</li>
                  <li>• Loading states</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
