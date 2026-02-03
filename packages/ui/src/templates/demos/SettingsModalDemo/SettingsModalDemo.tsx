import { SettingsModal } from "../../../app/modals/SettingsModal";

export function SettingsModalDemo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SettingsModal isOpen={true} onClose={() => {}} />
    </div>
  );
}
