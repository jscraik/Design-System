import { useState } from "react";

import { ModalDialog } from "../../../components/ui/overlays/Modal";
import {
  AppsPanel,
  ArchivedChatsPanel,
  AudioSettingsPanel,
  CheckForUpdatesPanel,
  DataControlsPanel,
  ManageAppsPanel,
  NotificationsPanel,
  PersonalizationPanel,
  SecurityPanel,
} from "../../settings";
import {
  AboutSection,
  AccountSection,
  AppSection,
  ChatBarSection,
  SpeechSection,
  SuggestionsSection,
  WorkWithAppsSection,
} from "../settings";
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: {
    email?: string;
    phone?: string;
    subscriptionLabel?: string;
  };
  appInfo?: {
    versionLabel?: string;
  };
}

type SettingsView =
  | "main"
  | "personalization"
  | "notifications"
  | "apps"
  | "dataControls"
  | "archivedChats"
  | "security"
  | "checkForUpdates"
  | "manageApps"
  | "audioSettings";

export function SettingsModal({ isOpen, onClose, account, appInfo }: SettingsModalProps) {
  // Navigation state
  const [currentView, setCurrentView] = useState<SettingsView>("main");

  // Main settings state
  const [showAdditionalModels, setShowAdditionalModels] = useState(true);
  const [correctSpelling, setCorrectSpelling] = useState(true);
  const [openLinksInApp, setOpenLinksInApp] = useState(true);
  const [appLanguage] = useState("English");
  const [showInMenuBar, setShowInMenuBar] = useState("When app is running");
  const [accentColor, setAccentColor] = useState("Purple");
  const [positionOnScreen] = useState("Remember last position");
  const [resetToNewChat] = useState("After 10 minutes");
  const [keyboardShortcut, setKeyboardShortcut] = useState("⌘Space");

  const [enableWorkWithApps, setEnableWorkWithApps] = useState(true);
  const [togglePairing, setTogglePairing] = useState("⌘⌥1");
  const [linearApps] = useState("Never");
  const [autoPairWithApps, setAutoPairWithApps] = useState(true);
  const [generateSuggestedEdits, setGenerateSuggestedEdits] = useState(false);
  const [autoApplySuggestedEdits, setAutoApplySuggestedEdits] = useState(false);

  const [voice] = useState("Cove");
  const [mainLanguage] = useState("English");

  const [autocomplete, setAutocomplete] = useState(true);
  const [trendingSearches, setTrendingSearches] = useState(true);
  const [followUpSuggestions, setFollowUpSuggestions] = useState(true);

  const handleToggle = (key: string) => {
    switch (key) {
      case "showAdditionalModels":
        setShowAdditionalModels(!showAdditionalModels);
        break;
      case "correctSpelling":
        setCorrectSpelling(!correctSpelling);
        break;
      case "openLinksInApp":
        setOpenLinksInApp(!openLinksInApp);
        break;
      case "enableWorkWithApps":
        setEnableWorkWithApps(!enableWorkWithApps);
        break;
      case "autoPairWithApps":
        setAutoPairWithApps(!autoPairWithApps);
        break;
      case "generateSuggestedEdits":
        setGenerateSuggestedEdits(!generateSuggestedEdits);
        break;
      case "autoApplySuggestedEdits":
        setAutoApplySuggestedEdits(!autoApplySuggestedEdits);
        break;
      case "autocomplete":
        setAutocomplete(!autocomplete);
        break;
      case "trendingSearches":
        setTrendingSearches(!trendingSearches);
        break;
      case "followUpSuggestions":
        setFollowUpSuggestions(!followUpSuggestions);
        break;
    }
  };

  const handleChange = (key: string, value: string) => {
    switch (key) {
      case "showInMenuBar":
        setShowInMenuBar(value);
        break;
      case "accentColor":
        setAccentColor(value);
        break;
      case "keyboardShortcut":
        setKeyboardShortcut(value);
        break;
      case "togglePairing":
        setTogglePairing(value);
        break;
    }
  };
  const handleClose = () => {
    if (currentView !== "main") {
      setCurrentView("main");
      return;
    }
    onClose();
  };

  // Render the appropriate panel based on current view
  const renderPanel = () => {
    switch (currentView) {
      case "personalization":
        return <PersonalizationPanel onBack={() => setCurrentView("main")} />;
      case "notifications":
        return <NotificationsPanel onBack={() => setCurrentView("main")} />;
      case "apps":
        return <AppsPanel onBack={() => setCurrentView("main")} />;
      case "dataControls":
        return <DataControlsPanel onBack={() => setCurrentView("main")} />;
      case "archivedChats":
        return <ArchivedChatsPanel onBack={() => setCurrentView("main")} />;
      case "security":
        return <SecurityPanel onBack={() => setCurrentView("main")} />;
      case "checkForUpdates":
        return <CheckForUpdatesPanel onBack={() => setCurrentView("main")} />;
      case "manageApps":
        return <ManageAppsPanel onBack={() => setCurrentView("main")} />;
      case "audioSettings":
        return <AudioSettingsPanel onBack={() => setCurrentView("main")} />;
      default:
        return null;
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as SettingsView);
  };

  // Main content render
  const mainContent = (
    <>
      {/* Header with traffic light buttons */}
      <div className="px-6 py-4 border-b border-foundation-text-dark-primary/10 flex items-center gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="size-3 rounded-full bg-foundation-accent-red hover:bg-foundation-accent-red/80 transition-colors"
            aria-label="Close"
          />
          <div className="size-3 rounded-full bg-foundation-accent-orange" />
          <div className="size-3 rounded-full bg-foundation-accent-green" />
        </div>
        <h2
          id="settings-modal-title"
          className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foundation-text-dark-primary"
        >
          Settings
        </h2>
      </div>

      {/* Main content */}
      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        <AccountSection account={account} onNavigate={handleNavigate} />
        <AppSection
          appLanguage={appLanguage}
          showInMenuBar={showInMenuBar}
          accentColor={accentColor}
          showAdditionalModels={showAdditionalModels}
          correctSpelling={correctSpelling}
          openLinksInApp={openLinksInApp}
          onNavigate={handleNavigate}
          onToggle={handleToggle}
          onChange={handleChange}
        />
        <ChatBarSection
          positionOnScreen={positionOnScreen}
          resetToNewChat={resetToNewChat}
          keyboardShortcut={keyboardShortcut}
          onChange={handleChange}
        />
        <WorkWithAppsSection
          enableWorkWithApps={enableWorkWithApps}
          togglePairing={togglePairing}
          linearApps={linearApps}
          autoPairWithApps={autoPairWithApps}
          generateSuggestedEdits={generateSuggestedEdits}
          autoApplySuggestedEdits={autoApplySuggestedEdits}
          onNavigate={handleNavigate}
          onToggle={handleToggle}
          onChange={handleChange}
        />
        <SpeechSection voice={voice} mainLanguage={mainLanguage} onNavigate={handleNavigate} />
        <SuggestionsSection
          autocomplete={autocomplete}
          trendingSearches={trendingSearches}
          followUpSuggestions={followUpSuggestions}
          onToggle={handleToggle}
        />
        <AboutSection appInfo={appInfo} />
      </div>
    </>
  );

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Settings"
      titleId="settings-modal-title"
      maxWidth="560px"
      className="bg-foundation-bg-dark-1 border border-foundation-text-dark-primary/10 rounded-[16px] shadow-2xl max-h-[85vh] overflow-hidden"
      showOverlay={false}
    >
      {currentView !== "main" ? renderPanel() : mainContent}
    </ModalDialog>
  );
}
