/**
 * Utility icons that were removed from legacy/chatgpt/platform.tsx
 * These are simple inline SVG implementations to avoid broken imports
 */

export function IconRadio({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function IconRadioChecked({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="currentColor" />
      <circle cx="12" cy="12" r="4" fill="white" />
    </svg>
  );
}

export function IconNotification({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C10.9 2 10 2.9 10 4V4.3C8.5 4.9 7.5 6.3 7.1 8L6.5 11C6.2 12.5 5 13.7 3.5 14V16H20.5V14C19 13.7 17.8 12.5 17.5 11L16.9 8C16.5 6.3 15.5 4.9 14 4.3V4C14 2.9 13.1 2 12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 16C9 17.7 10.3 19 12 19C13.7 19 15 17.7 15 16"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function IconNotificationFilled({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C10.9 2 10 2.9 10 4V4.3C8.5 4.9 7.5 6.3 7.1 8L6.5 11C6.2 12.5 5 13.7 3.5 14V16H20.5V14C19 13.7 17.8 12.5 17.5 11L16.9 8C16.5 6.3 15.5 4.9 14 4.3V4C14 2.9 13.1 2 12 2Z" />
      <path
        d="M9 16C9 17.7 10.3 19 12 19C13.7 19 15 17.7 15 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function IconWifi({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18ZM12 14C14.8 14 17.3 15.2 19.1 17.1L17.7 18.5C16.3 17.1 14.3 16.2 12 16.2C9.7 16.2 7.7 17.1 6.3 18.5L4.9 17.1C6.7 15.2 9.2 14 12 14ZM12 10C15.7 10 19.1 11.3 21.8 13.6L20.4 15C18.1 13 15.2 11.9 12 11.9C8.8 11.9 5.9 13 3.6 15L2.2 13.6C4.9 11.3 8.3 10 12 10ZM12 6C16.6 6 20.9 7.5 24.5 10.1L23.1 11.5C19.9 9.2 16.1 7.9 12 7.9C7.9 7.9 4.1 9.2 0.9 11.5L-0.5 10.1C3.1 7.5 7.4 6 12 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconBatteryFull({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="7"
        width="18"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
      />
      <rect x="22" y="10" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

export function IconBatteryHalf({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="7"
        width="18"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <rect x="4" y="9" width="8" height="6" rx="1" fill="currentColor" />
      <rect x="22" y="10" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

export function IconBatteryLow({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="7"
        width="18"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <rect x="4" y="9" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="22" y="10" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}
