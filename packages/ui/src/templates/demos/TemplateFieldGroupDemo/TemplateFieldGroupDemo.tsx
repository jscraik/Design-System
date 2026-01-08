import { useState } from "react";

import {
  IconChevronRightMd,
  IconLock,
  IconNotification,
  IconPlusLg,
  IconQuestion,
  IconSettings,
  IconUser,
  IconX,
} from "../../../icons";
import {
  TemplateFieldGroup,
  TemplateFieldGroupAction,
  TemplateFieldGroupBadge,
  TemplateFieldGroupDivider,
  TemplateFieldGroupRow,
} from "../../blocks/TemplateFieldGroup";
import { TemplateFormField } from "../../blocks/TemplateFormField";

export function TemplateFieldGroupDemo() {
  const [personalInfoCollapsed, setPersonalInfoCollapsed] = useState(false);
  const [securityCollapsed, setSecurityCollapsed] = useState(true);

  return (
    <div className="h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Intro Section */}
        <div className="space-y-3 pb-6 border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
          <h1 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Field Group Component
          </h1>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            A flexible container for grouping related form fields with variants, collapsible sections, grid layouts, and compound components.
          </p>
        </div>

        {/* Basic Field Group */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Basic Field Group
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Simple grouping of related fields
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <TemplateFieldGroup label="Profile Information">
              <TemplateFormField label="Full Name" htmlFor="name">
                <input
                  id="name"
                  type="text"
                  aria-label="Full Name"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
              <TemplateFormField label="Email" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  aria-label="Email"
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
            </TemplateFieldGroup>
          </div>
        </div>

        {/* With Description and Icon */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              With Description and Icon
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Field groups can include descriptions and icons
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <TemplateFieldGroup
              label="Account Settings"
              description="Manage your account preferences and personal information"
              icon={<IconUser className="w-4 h-4" />}
            >
              <TemplateFormField label="Username" htmlFor="username">
                <input
                  id="username"
                  type="text"
                  aria-label="Username"
                  placeholder="johndoe"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
              <TemplateFormField label="Bio" htmlFor="bio">
                <textarea
                  id="bio"
                  rows={3}
                  aria-label="Bio"
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue resize-none transition-shadow"
                />
              </TemplateFormField>
            </TemplateFieldGroup>
          </div>
        </div>

        {/* With Compound Components */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              With Compound Components
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Using TemplateFieldGroupAction, TemplateFieldGroupBadge, and TemplateFieldGroupDivider
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <TemplateFieldGroup
              label="Email Addresses"
              badge={<TemplateFieldGroupBadge variant="primary">3</TemplateFieldGroupBadge>}
              actions={
                <>
                  <TemplateFieldGroupAction icon={<IconQuestion className="w-3.5 h-3.5" />}>
                    Help
                  </TemplateFieldGroupAction>
                  <TemplateFieldGroupAction variant="primary" icon={<IconPlusLg className="w-3.5 h-3.5" />}>
                    Add Email
                  </TemplateFieldGroupAction>
                </>
              }
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
                  <span className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                    john@example.com
                  </span>
                  <TemplateFieldGroupBadge variant="success">Primary</TemplateFieldGroupBadge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
                  <span className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                    john.work@company.com
                  </span>
                  <button className="text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary hover:text-foundation-accent-red transition-colors">
                    <IconX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </TemplateFieldGroup>
          </div>
        </div>

        {/* Collapsible Groups */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Collapsible Field Groups
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Groups can be collapsed to save space
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6 space-y-4">
            <TemplateFieldGroup
              label="Personal Information"
              description="Your basic account details"
              icon={<IconUser className="w-4 h-4" />}
              collapsible
              collapsed={personalInfoCollapsed}
              onCollapseChange={setPersonalInfoCollapsed}
            >
              <TemplateFormField label="First Name" htmlFor="firstName">
                <input
                  id="firstName"
                  type="text"
                  aria-label="First Name"
                  placeholder="John"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
              <TemplateFormField label="Last Name" htmlFor="lastName">
                <input
                  id="lastName"
                  type="text"
                  aria-label="Last Name"
                  placeholder="Doe"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
            </TemplateFieldGroup>

            <TemplateFieldGroup
              label="Security Settings"
              description="Manage your password and authentication"
              icon={<IconLock className="w-4 h-4" />}
              collapsible
              collapsed={securityCollapsed}
              onCollapseChange={setSecurityCollapsed}
            >
              <TemplateFormField label="Current Password" htmlFor="currentPassword">
                <input
                  id="currentPassword"
                  type="password"
                  aria-label="Current Password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
              <TemplateFormField label="New Password" htmlFor="newPassword">
                <input
                  id="newPassword"
                  type="password"
                  aria-label="New Password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
            </TemplateFieldGroup>
          </div>
        </div>

        {/* Card Variant */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Card Variant
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Elevated card style with distinct header
            </p>
          </div>
          <div className="space-y-4">
            <TemplateFieldGroup
              variant="card"
              label="Notification Preferences"
              description="Choose how you want to be notified"
              icon={<IconNotification className="w-4 h-4" />}
              badge={<TemplateFieldGroupBadge variant="warning">Beta</TemplateFieldGroupBadge>}
            >
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  aria-label="Email notifications"
                  defaultChecked
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                    Email Notifications
                  </div>
                  <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                    Receive updates via email
                  </div>
                </div>
              </label>
              <TemplateFieldGroupDivider />
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  aria-label="Push notifications"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                    Push Notifications
                  </div>
                  <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                    Receive push notifications on your devices
                  </div>
                </div>
              </label>
            </TemplateFieldGroup>
          </div>
        </div>

        {/* Bordered Variant */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Bordered Variant
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Bordered style with separated header
            </p>
          </div>
          <TemplateFieldGroup
            variant="bordered"
            label="API Configuration"
            description="Configure your API settings"
            icon={<IconSettings className="w-4 h-4" />}
            actions={
              <TemplateFieldGroupAction variant="ghost">
                Reset
              </TemplateFieldGroupAction>
            }
          >
            <TemplateFormField label="API Key" htmlFor="apiKey">
              <input
                id="apiKey"
                type="text"
                aria-label="API Key"
                value="sk_live_1234567890abcdef"
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary font-mono text-sm"
              />
            </TemplateFormField>
            <TemplateFormField label="Endpoint URL" htmlFor="endpoint">
              <input
                id="endpoint"
                type="url"
                aria-label="Endpoint URL"
                placeholder="https://api.example.com"
                className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
              />
            </TemplateFormField>
          </TemplateFieldGroup>
        </div>

        {/* Ghost Variant */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Ghost Variant
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Minimal style with left border
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <TemplateFieldGroup
              variant="ghost"
              label="Advanced Options"
              description="Fine-tune your experience"
            >
              <TemplateFormField label="Timeout (seconds)" htmlFor="timeout">
                <input
                  id="timeout"
                  type="number"
                  aria-label="Timeout (seconds)"
                  placeholder="30"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
              <TemplateFormField label="Max Retries" htmlFor="retries">
                <input
                  id="retries"
                  type="number"
                  aria-label="Max Retries"
                  placeholder="3"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
            </TemplateFieldGroup>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Grid Layout
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Organize fields in responsive grid columns
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <TemplateFieldGroup
              label="Address Information"
              description="Enter your complete address"
              columns={2}
              gap="md"
            >
              <TemplateFormField label="Street" htmlFor="street">
                <input
                  id="street"
                  type="text"
                  aria-label="Street"
                  placeholder="123 Main St"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
              <TemplateFormField label="City" htmlFor="city">
                <input
                  id="city"
                  type="text"
                  aria-label="City"
                  placeholder="San Francisco"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
              <TemplateFormField label="State" htmlFor="state">
                <input
                  id="state"
                  type="text"
                  aria-label="State"
                  placeholder="CA"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
              <TemplateFormField label="ZIP Code" htmlFor="zip">
                <input
                  id="zip"
                  type="text"
                  aria-label="ZIP Code"
                  placeholder="94102"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
            </TemplateFieldGroup>
          </div>
        </div>

        {/* Error State */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Error State
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Display validation errors for the entire group
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <TemplateFieldGroup
              variant="bordered"
              label="Payment Information"
              description="Enter your payment details"
              error="Please review and fix the errors in this section"
              required
            >
              <TemplateFormField label="Card Number" htmlFor="cardNumber" error="Invalid card number">
                <input
                  id="cardNumber"
                  type="text"
                  aria-label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-accent-red bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-red transition-shadow"
                />
              </TemplateFormField>
              <TemplateFieldGroupRow gap="md">
                <TemplateFormField label="Expiry" htmlFor="expiry" className="flex-1">
                  <input
                    id="expiry"
                    type="text"
                    aria-label="Expiry"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                  />
                </TemplateFormField>
                <TemplateFormField label="CVV" htmlFor="cvv" className="flex-1">
                  <input
                    id="cvv"
                    type="text"
                    aria-label="CVV"
                    placeholder="123"
                    className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                  />
                </TemplateFormField>
              </TemplateFieldGroupRow>
            </TemplateFieldGroup>
          </div>
        </div>

        {/* Different Sizes */}
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
            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
              <TemplateFieldGroup
                size="sm"
                label="Small Group"
                description="Compact spacing"
              >
                <input
                  type="text"
                  aria-label="Small input"
                  placeholder="Small input"
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFieldGroup>
            </div>

            <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
              <TemplateFieldGroup
                size="lg"
                label="Large Group"
                description="Spacious layout for emphasis"
              >
                <input
                  type="text"
                  aria-label="Large input"
                  placeholder="Large input"
                  className="w-full px-3 py-2.5 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFieldGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
