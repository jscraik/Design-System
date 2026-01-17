import {
  IconChevronRightMd,
  IconChevronDownMd,
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
      <h3 className="text-body-small font-semibold text-foundation-text-dark-primary mb-2">
        Speech
      </h3>
      <div className="space-y-0.5">
        <SettingRow
          icon={
            <IconMic className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Voice"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-foundation-text-dark-secondary">
                {voice}
              </span>
              <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
            </div>
          }
        />

        <SettingRow
          icon={
            <IconGlobe className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Main language"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-foundation-text-dark-secondary">
                {mainLanguage}
              </span>
              <div className="size-5 rounded-full bg-foundation-bg-dark-3 flex items-center justify-center">
                <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
              </div>
            </div>
          }
        />

        <SettingRow
          icon={
            <IconSoundOn className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Audio settings"
          onClick={() => onNavigate("audioSettings")}
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />

        <div className="px-3 py-2">
          <p className="text-caption text-foundation-text-dark-tertiary font-normal">
            For best results, select the language you mainly speak. If it&apos;s not listed, it may
            still be supported via auto-detection.
          </p>
        </div>
      </div>
    </div>
  );
}
