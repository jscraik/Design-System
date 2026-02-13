import {
  IconChevronDownMd,
  IconChevronRightMd,
  IconGlobe,
  IconMic,
  IconSoundOn,
} from "../../../../icons/ChatGPTIcons";
import { SettingRow } from "../../../settings";

interface SpeechSectionProps {
  voice: string;
  mainLanguage: string;
  onNavigate: (view: string) => void;
}

/** SpeechSection renders speech-related settings. */
export function SpeechSection({ voice, mainLanguage, onNavigate }: SpeechSectionProps) {
  return (
    <div className="mb-5">
      <h3 className="text-body-small font-semibold text-foreground mb-2">Speech</h3>
      <div className="space-y-0.5">
        <SettingRow
          icon={<IconMic className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Voice"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-text-secondary">{voice}</span>
              <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
            </div>
          }
        />

        <SettingRow
          icon={<IconGlobe className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Main language"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-text-secondary">
                {mainLanguage}
              </span>
              <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                <IconChevronDownMd className="size-3 text-text-secondary dark:text-text-secondary" />
              </div>
            </div>
          }
        />

        <SettingRow
          icon={<IconSoundOn className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Audio settings"
          onClick={() => onNavigate("audioSettings")}
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />

        <div className="px-3 py-2">
          <p className="text-caption text-muted-foreground font-normal">
            For best results, select the language you mainly speak. If it&apos;s not listed, it may
            still be supported via auto-detection.
          </p>
        </div>
      </div>
    </div>
  );
}
