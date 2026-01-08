import { useState } from "react";
import {
  Bell,
  Globe,
  Shield,
  Eye,
  Mail,
  Moon,
  Volume2,
  Wifi,
  Lock,
  Camera,
  Mic,
  MapPin,
  Zap,
  Settings,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

import {
  SettingToggleBlock,
  SettingToggleBadge,
  SettingToggleGroup,
} from "../SettingToggleBlock";

export function SettingToggleBlockDemo() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [webSearch, setWebSearch] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [aiFeatures, setAiFeatures] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [errorToggle, setErrorToggle] = useState(false);

  const handleLoadingToggle = () => {
    setLoadingToggle(true);
    setTimeout(() => setLoadingToggle(false), 2000);
  };

  return (
    <div className="h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Intro Section */}
        <div className="space-y-3 pb-6 border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
          <h1 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Setting Toggle Block Component
          </h1>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            A comprehensive toggle switch component with 4 variants, 3 sizes, badges, loading states, error handling, and compound components for grouping.
          </p>
        </div>

        {/* Basic Toggles */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Basic Toggle Settings
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Simple toggle switches with icons and labels
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              icon={<Bell className="w-5 h-5" />}
              label="Enable notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
              divider
            />
            <SettingToggleBlock
              icon={<Moon className="w-5 h-5" />}
              label="Dark mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
              divider
            />
            <SettingToggleBlock
              icon={<Globe className="w-5 h-5" />}
              label="Web search"
              checked={webSearch}
              onCheckedChange={setWebSearch}
            />
          </div>
        </div>

        {/* With Descriptions */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              With Descriptions
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Toggles with helpful descriptions explaining their purpose
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              icon={<Shield className="w-5 h-5" />}
              label="Two-factor authentication"
              description="Add an extra layer of security to your account by requiring a verification code in addition to your password."
              checked={twoFactor}
              onCheckedChange={setTwoFactor}
              divider
            />
            <SettingToggleBlock
              icon={<Mail className="w-5 h-5" />}
              label="Email alerts"
              description="Receive email notifications about important account activity and updates."
              checked={emailAlerts}
              onCheckedChange={setEmailAlerts}
              divider
            />
            <SettingToggleBlock
              icon={<Volume2 className="w-5 h-5" />}
              label="Sound effects"
              description="Play sounds for notifications and interactions throughout the app."
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>

        {/* With Badges */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              With Badges
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Toggles with status badges (new, beta, pro, deprecated)
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              icon={<Zap className="w-5 h-5" />}
              label="AI-powered suggestions"
              description="Get intelligent suggestions based on your usage patterns."
              badge={<SettingToggleBadge variant="new">New</SettingToggleBadge>}
              checked={aiFeatures}
              onCheckedChange={setAiFeatures}
              divider
            />
            <SettingToggleBlock
              icon={<Settings className="w-5 h-5" />}
              label="Beta features"
              description="Enable experimental features that are still in development."
              badge={<SettingToggleBadge variant="beta">Beta</SettingToggleBadge>}
              checked={betaFeatures}
              onCheckedChange={setBetaFeatures}
              divider
            />
            <SettingToggleBlock
              icon={<Lock className="w-5 h-5" />}
              label="Advanced security"
              description="Enhanced security features for professional accounts."
              badge={<SettingToggleBadge variant="pro">Pro</SettingToggleBadge>}
              checked={false}
              onCheckedChange={() => {}}
              disabled
            />
          </div>
        </div>

        {/* Card Variant */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Card Variant
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Toggles with elevated card styling
            </p>
          </div>
          <div className="space-y-3">
            <SettingToggleBlock
              variant="card"
              icon={<Wifi className="w-5 h-5" />}
              label="Wi-Fi"
              description="Connect to available wireless networks."
              checked={wifiEnabled}
              onCheckedChange={setWifiEnabled}
            />
            <SettingToggleBlock
              variant="card"
              icon={<MapPin className="w-5 h-5" />}
              label="Location services"
              description="Share your location to enable location-based features."
              checked={locationEnabled}
              onCheckedChange={setLocationEnabled}
            />
          </div>
        </div>

        {/* With Actions */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              With Actions
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Toggles with additional action buttons
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              icon={<Camera className="w-5 h-5" />}
              label="Camera access"
              description="Allow this app to access your camera for photos and videos."
              checked={cameraEnabled}
              onCheckedChange={setCameraEnabled}
              action={
                <button className="p-1.5 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
              }
              divider
            />
            <SettingToggleBlock
              icon={<Mic className="w-5 h-5" />}
              label="Microphone access"
              description="Allow this app to access your microphone for voice input and recordings."
              checked={micEnabled}
              onCheckedChange={setMicEnabled}
              action={
                <button className="text-xs font-medium text-foundation-accent-blue hover:text-foundation-accent-blue/80 transition-colors">
                  Configure
                </button>
              }
            />
          </div>
        </div>

        {/* With Keyboard Shortcuts */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              With Keyboard Shortcuts
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Display keyboard shortcuts for quick access
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              icon={<Bell className="w-5 h-5" />}
              label="Notifications"
              description="Toggle notifications on and off"
              shortcut="⌘N"
              checked={notifications}
              onCheckedChange={setNotifications}
              divider
            />
            <SettingToggleBlock
              icon={<Moon className="w-5 h-5" />}
              label="Dark mode"
              description="Switch between light and dark themes"
              shortcut="⌘D"
              checked={darkMode}
              onCheckedChange={setDarkMode}
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
              Show loading spinner during async operations
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              icon={<Settings className="w-5 h-5" />}
              label="Sync settings"
              description="Synchronize your settings across devices"
              checked={loadingToggle}
              onCheckedChange={handleLoadingToggle}
              loading={loadingToggle}
              hint="This may take a few seconds..."
            />
          </div>
        </div>

        {/* Error State */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Error State
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Display validation errors
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              icon={<Shield className="w-5 h-5" />}
              label="Security verification"
              description="Enable advanced security features"
              checked={errorToggle}
              onCheckedChange={setErrorToggle}
              error="Two-factor authentication is required before enabling this feature"
            />
          </div>
        </div>

        {/* Disabled State */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Disabled State
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Toggles can be disabled when not available
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              icon={<Lock className="w-5 h-5" />}
              label="Premium feature"
              description="This feature requires a premium subscription"
              badge={<SettingToggleBadge variant="pro">Pro</SettingToggleBadge>}
              checked={false}
              onCheckedChange={() => {}}
              disabled
              divider
            />
            <SettingToggleBlock
              icon={<Eye className="w-5 h-5" />}
              label="Deprecated feature"
              description="This feature will be removed in a future update"
              badge={<SettingToggleBadge variant="deprecated">Deprecated</SettingToggleBadge>}
              checked={true}
              onCheckedChange={() => {}}
              disabled
            />
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
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              size="sm"
              icon={<Bell className="w-4 h-4" />}
              label="Small toggle"
              description="Compact size for dense layouts"
              checked={true}
              onCheckedChange={() => {}}
              divider
            />
            <SettingToggleBlock
              size="md"
              icon={<Bell className="w-5 h-5" />}
              label="Medium toggle (default)"
              description="Standard size for most use cases"
              checked={true}
              onCheckedChange={() => {}}
              divider
            />
            <SettingToggleBlock
              size="lg"
              icon={<Bell className="w-6 h-6" />}
              label="Large toggle"
              description="Larger size for emphasis and better touch targets"
              checked={true}
              onCheckedChange={() => {}}
            />
          </div>
        </div>

        {/* Toggle Groups */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Toggle Groups
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Organize related toggles with SettingToggleGroup
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleGroup
              label="Privacy Settings"
              description="Control who can see your information"
            >
              <SettingToggleBlock
                icon={<Eye className="w-5 h-5" />}
                label="Show profile to others"
                description="Make your profile visible to other users"
                checked={true}
                onCheckedChange={() => {}}
              />
              <SettingToggleBlock
                icon={<Lock className="w-5 h-5" />}
                label="Private account"
                description="Only approved followers can see your activity"
                checked={false}
                onCheckedChange={() => {}}
              />
            </SettingToggleGroup>
          </div>
        </div>

        {/* Compact Variant */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Compact Variant
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Dense layout for space-constrained areas
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              variant="compact"
              icon={<Bell className="w-4 h-4" />}
              label="Notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
              divider
            />
            <SettingToggleBlock
              variant="compact"
              icon={<Moon className="w-4 h-4" />}
              label="Dark mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
              divider
            />
            <SettingToggleBlock
              variant="compact"
              icon={<Volume2 className="w-4 h-4" />}
              label="Sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>

        {/* Inline Variant */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Inline Variant
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Inline style for embedding in other components
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleBlock
              variant="inline"
              label="Remember my preferences"
              checked={true}
              onCheckedChange={() => {}}
              divider
            />
            <SettingToggleBlock
              variant="inline"
              label="Show welcome message"
              checked={false}
              onCheckedChange={() => {}}
            />
          </div>
        </div>

        {/* Real World Example */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
              Real-World Example
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Complete settings panel with multiple toggle groups
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingToggleGroup
              label="Notifications"
              description="Choose how you want to be notified"
            >
              <SettingToggleBlock
                icon={<Bell className="w-5 h-5" />}
                label="Push notifications"
                description="Receive push notifications on your devices"
                badge={<SettingToggleBadge variant="new">New</SettingToggleBadge>}
                checked={notifications}
                onCheckedChange={setNotifications}
                action={
                  <button className="text-xs font-medium text-foundation-accent-blue hover:text-foundation-accent-blue/80 flex items-center gap-1 transition-colors">
                    Settings
                    <ExternalLink className="w-3 h-3" />
                  </button>
                }
              />
              <SettingToggleBlock
                icon={<Mail className="w-5 h-5" />}
                label="Email notifications"
                description="Get notified via email about important updates"
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
                shortcut="⌘E"
              />
            </SettingToggleGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
