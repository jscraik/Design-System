import {
  Button,
  CollapsibleSection,
  IconButton,
  RangeSlider,
  SectionHeader,
  SegmentedControl,
  Toggle,
} from "@chatui/ui";
import { useState } from "react";

import type { Route } from "../Router";

interface SettingsPageProps {
  onNavigate: (route: Route) => void;
  onExportSettings?: () => void;
  onResetDefaults?: () => void;
  onSaveSettings?: (settings: {
    darkMode: boolean;
    notifications: boolean;
    volume: number;
    quality: "low" | "medium" | "high";
    autoSave: boolean;
  }) => void;
}

export function SettingsPage({
  onNavigate,
  onExportSettings,
  onResetDefaults,
  onSaveSettings,
}: SettingsPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState(75);
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--foundation-bg-dark-1)]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[var(--foundation-bg-dark-2)]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <IconButton
              icon={<span>←</span>}
              onClick={() => onNavigate("chat")}
              title="Back to Chat"
              variant="ghost"
            />
            <h1 className="text-xl font-semibold text-white">Settings</h1>
          </div>

          <Button variant="outline" size="sm" onClick={onExportSettings}>
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Appearance Section */}
        <CollapsibleSection title="Appearance" defaultOpen>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Dark Mode</div>
                <div className="text-white/60 text-sm">Use dark theme across the application</div>
              </div>
              <Toggle checked={darkMode} onChange={setDarkMode} ariaLabel="Dark mode" />
            </div>

            <RangeSlider
              label="UI Scale"
              value={volume}
              onChange={setVolume}
              min={50}
              max={150}
              suffix="%"
            />
          </div>
        </CollapsibleSection>

        {/* Notifications Section */}
        <CollapsibleSection title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Push Notifications</div>
                <div className="text-white/60 text-sm">Receive notifications for new messages</div>
              </div>
              <Toggle
                checked={notifications}
                onChange={setNotifications}
                ariaLabel="Push notifications"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Quality Section */}
        <CollapsibleSection title="Performance">
          <div className="space-y-6">
            <div>
              <SectionHeader
                title="Response Quality"
                description="Choose the quality level for AI responses"
              />
              <SegmentedControl
                value={quality}
                options={[
                  { value: "low", label: "Fast" },
                  { value: "medium", label: "Balanced" },
                  { value: "high", label: "Best" },
                ]}
                onChange={setQuality}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Auto-save Conversations</div>
                <div className="text-white/60 text-sm">Automatically save chat history</div>
              </div>
              <Toggle
                checked={autoSave}
                onChange={setAutoSave}
                ariaLabel="Auto-save conversations"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-white/10">
          <Button variant="outline" onClick={onResetDefaults}>
            Reset to Defaults
          </Button>
          <Button
            onClick={() =>
              onSaveSettings?.({
                darkMode,
                notifications,
                volume,
                quality,
                autoSave,
              })
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
