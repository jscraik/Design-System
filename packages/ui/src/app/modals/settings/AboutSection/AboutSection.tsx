import {
  IconBook,
  IconChevronRightMd,
  IconInfo,
  IconQuestion,
  IconUserLock,
  IconWarning,
} from "../../../../icons/ChatGPTIcons";
import { SettingRow } from "../../../settings";

interface AboutSectionProps {
  appInfo?: {
    versionLabel?: string;
  };
}

/** AboutSection renders about section links. */
export function AboutSection({ appInfo }: AboutSectionProps) {
  return (
    <div className="mb-5">
      <h3 className="text-body-small font-semibold text-foundation-text-dark-primary mb-2">
        About
      </h3>
      <div className="space-y-0.5">
        <SettingRow
          icon={
            <IconWarning className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Report bug"
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconQuestion className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Help Center"
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconBook className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Terms of Use"
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconUserLock className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Privacy Policy"
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconInfo className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="ChatGPT for macOS"
          right={
            <span className="text-body-small font-normal text-foundation-text-dark-secondary">
              {appInfo?.versionLabel ?? "—"}
            </span>
          }
        />
        <SettingRow
          label="Log out"
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
      </div>
    </div>
  );
}
