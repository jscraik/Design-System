// Shared types for Settings components

export interface SettingsPanelProps {
  onBack: () => void;
}

export type SettingsAsyncState = "ready" | "loading" | "empty" | "error";

export interface BaseStyleOption {
  value: string;
  description: string;
}

export interface AccentColor {
  name: string;
  color: string;
}
