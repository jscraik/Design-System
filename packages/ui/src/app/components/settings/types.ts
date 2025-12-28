// Shared types for Settings components

export interface SettingsPanelProps {
  onBack: () => void;
}

export interface BaseStyleOption {
  value: string;
  description: string;
}

export interface AccentColor {
  name: string;
  color: string;
}
