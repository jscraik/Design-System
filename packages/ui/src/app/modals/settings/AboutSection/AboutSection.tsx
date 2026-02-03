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
      <h3 className="text-body-small font-semibold text-foreground mb-2">About</h3>
      <div className="space-y-0.5">
        <SettingRow
          icon={<IconWarning className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Report bug"
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconQuestion className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Help Center"
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconBook className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Terms of Use"
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconUserLock className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Privacy Policy"
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconInfo className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="App version"
          right={
            <span className="text-body-small font-normal text-text-secondary">
              {appInfo?.versionLabel ?? "—"}
            </span>
          }
        />
        <SettingRow
          label="Log out"
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
      </div>
    </div>
  );
}
