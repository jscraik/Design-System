import {
  IconArchive,
  IconCategory,
  IconCreditCard,
  IconEmail,
  IconPhone,
  IconStarFilled,
  IconStatus,
  IconSuitcase,
  IconUserLock,
  IconChevronRightMd,
} from "../../../../icons/ChatGPTIcons";
import { SettingRow } from "../../../settings";

interface AccountSectionProps {
  account?: {
    email?: string;
    phone?: string;
    subscriptionLabel?: string;
  };
  onNavigate: (view: string) => void;
}

/** AccountSection renders account-related settings. */
export function AccountSection({ account, onNavigate }: AccountSectionProps) {
  return (
    <div className="mb-5">
      <h3 className="text-body-small font-semibold text-foreground mb-2">Account</h3>
      <div className="space-y-0.5">
        <SettingRow
          icon={<IconEmail className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Email"
          right={
            <span className="text-body-small font-normal text-text-secondary">
              {account?.email ?? "—"}
            </span>
          }
        />
        <SettingRow
          icon={<IconPhone className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Phone number"
          right={
            <span className="text-body-small font-normal text-text-secondary">
              {account?.phone ?? "—"}
            </span>
          }
        />
        <SettingRow
          icon={<IconCreditCard className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Subscription"
          right={
            <span className="text-body-small font-normal text-text-secondary">
              {account?.subscriptionLabel ?? "—"}
            </span>
          }
        />
        <SettingRow
          icon={<IconSuitcase className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Orders"
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconStarFilled className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Personalization"
          onClick={() => onNavigate("personalization")}
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconStatus className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Notifications"
          onClick={() => onNavigate("notifications")}
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconCategory className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Apps"
          onClick={() => onNavigate("apps")}
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconUserLock className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Data controls"
          onClick={() => onNavigate("dataControls")}
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconArchive className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Archived chats"
          onClick={() => onNavigate("archivedChats")}
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
        <SettingRow
          icon={<IconUserLock className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Security"
          onClick={() => onNavigate("security")}
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
      </div>
    </div>
  );
}
