import { Info, Eye, EyeOff, RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";

import {
  TemplateFormField,
  TemplateFormFieldAction,
  TemplateFormFieldIconButton,
  TemplateFormFieldInline,
} from "../TemplateFormField";

export function TemplateFormFieldDemo() {
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Intro Section */}
        <div className="space-y-3 pb-6 border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
          <h1 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Form Field Component
          </h1>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            A flexible form field component with validation, hints, and compound components for common patterns.
          </p>
        </div>

        {/* Basic Examples */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Basic Form Fields
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Simple fields with labels and descriptions
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6 space-y-6">
              <TemplateFormField label="Username" htmlFor="username" required>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>

              <TemplateFormField
                label="Email address"
                htmlFor="email"
                description="We'll never share your email with anyone else."
                required
              >
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>

              <TemplateFormField label="Phone" htmlFor="phone" optional>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
            </div>
          </div>
        </div>

        {/* With Actions */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              With Action Buttons
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Fields with interactive action buttons
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6 space-y-6">
              <TemplateFormField
                label="Password"
                htmlFor="password"
                description="Must be at least 8 characters long"
                required
                actions={
                  <TemplateFormFieldIconButton
                    icon={
                      showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  />
                }
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>

              <TemplateFormField
                label="API Key"
                htmlFor="apikey"
                description="Your API key for authentication"
                actions={
                  <>
                    <TemplateFormFieldAction onClick={() => {}}>Regenerate</TemplateFormFieldAction>
                  </>
                }
              >
                <div className="flex gap-2">
                  <input
                    id="apikey"
                    type="text"
                    value="sk_live_1234567890abcdef"
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary font-mono text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </TemplateFormField>
            </div>
          </div>
        </div>

        {/* Validation States */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Validation States
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Error, success, and hint messages
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6 space-y-6">
              <TemplateFormField
                label="Email"
                htmlFor="email-error"
                error="This email is already taken"
                required
              >
                <input
                  id="email-error"
                  type="email"
                  defaultValue="taken@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-accent-red bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary focus:outline-none focus:ring-2 focus:ring-foundation-accent-red transition-shadow"
                />
              </TemplateFormField>

              <TemplateFormField
                label="Username"
                htmlFor="username-success"
                success="This username is available"
              >
                <input
                  id="username-success"
                  type="text"
                  defaultValue="johndoe"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-accent-green bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary focus:outline-none focus:ring-2 focus:ring-foundation-accent-green transition-shadow"
                />
              </TemplateFormField>

              <TemplateFormField
                label="Website"
                htmlFor="website"
                hint="Include the https:// prefix"
              >
                <input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
            </div>
          </div>
        </div>

        {/* Character Count */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Character Count
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Fields with character limits and warnings
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6 space-y-6">
              <TemplateFormField
                label="Bio"
                htmlFor="bio"
                description="Tell us a little about yourself"
                characterCount={{ current: bio.length, max: 150 }}
              >
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write something..."
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue resize-none transition-shadow"
                />
              </TemplateFormField>
            </div>
          </div>
        </div>

        {/* Inline Fields */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Inline Layout
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Label and input on the same line
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6 space-y-4">
              <TemplateFormFieldInline label="Display Name" htmlFor="displayname">
                <input
                  id="displayname"
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormFieldInline>

              <TemplateFormFieldInline label="Theme" htmlFor="theme" labelWidth={120}>
                <select
                  id="theme"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </TemplateFormFieldInline>

              <TemplateFormFieldInline label="Notifications" htmlFor="notifications-inline">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="notifications-inline"
                    type="checkbox"
                    className="w-4 h-4 rounded border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 text-foundation-accent-blue focus:ring-2 focus:ring-foundation-accent-blue"
                  />
                  <span className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    Enable email notifications
                  </span>
                </label>
              </TemplateFormFieldInline>
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
              Small, medium, and large field variants
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6 space-y-6">
              <TemplateFormField
                label="Small Field"
                htmlFor="field-sm"
                description="This is a small sized field"
                size="sm"
              >
                <input
                  id="field-sm"
                  type="text"
                  placeholder="Small input"
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>

              <TemplateFormField
                label="Medium Field"
                htmlFor="field-md"
                description="This is a medium sized field (default)"
                size="md"
              >
                <input
                  id="field-md"
                  type="text"
                  placeholder="Medium input"
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>

              <TemplateFormField
                label="Large Field"
                htmlFor="field-lg"
                description="This is a large sized field"
                size="lg"
              >
                <input
                  id="field-lg"
                  type="text"
                  placeholder="Large input"
                  className="w-full px-3 py-2.5 text-base rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue transition-shadow"
                />
              </TemplateFormField>
            </div>
          </div>
        </div>

        {/* Disabled State */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Disabled State
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Fields in disabled state
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm">
            <div className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6 space-y-6">
              <TemplateFormField
                label="Disabled Field"
                htmlFor="disabled-field"
                description="This field is disabled"
                disabled
              >
                <input
                  id="disabled-field"
                  type="text"
                  value="Cannot edit this"
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary cursor-not-allowed"
                />
              </TemplateFormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
