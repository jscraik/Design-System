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
      <h3 className="text-body-small font-semibold text-foundation-text-dark-primary mb-2">
        Account
      </h3>
      <div className="space-y-0.5">
        <SettingRow
          icon={
            <IconEmail className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Email"
          right={
            <span className="text-body-small font-normal text-foundation-text-dark-secondary">
              {account?.email ?? "—"}
            </span>
          }
        />
        <SettingRow
          icon={
            <IconPhone className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Phone number"
          right={
            <span className="text-body-small font-normal text-foundation-text-dark-secondary">
              {account?.phone ?? "—"}
            </span>
          }
        />
        <SettingRow
          icon={
            <IconCreditCard className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Subscription"
          right={
            <span className="text-body-small font-normal text-foundation-text-dark-secondary">
              {account?.subscriptionLabel ?? "—"}
            </span>
          }
        />
        <SettingRow
          icon={
            <IconSuitcase className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Orders"
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconStarFilled className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Personalization"
          onClick={() => onNavigate("personalization")}
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconStatus className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Notifications"
          onClick={() => onNavigate("notifications")}
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconCategory className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Apps"
          onClick={() => onNavigate("apps")}
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconUserLock className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Data controls"
          onClick={() => onNavigate("dataControls")}
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconArchive className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Archived chats"
          onClick={() => onNavigate("archivedChats")}
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
        <SettingRow
          icon={
            <IconUserLock className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Security"
          onClick={() => onNavigate("security")}
          right={
            <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
          }
        />
      </div>
    </div>
  );
}
