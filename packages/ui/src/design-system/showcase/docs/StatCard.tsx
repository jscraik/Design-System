interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
}

/** StatCard displays a statistic with label, value, and optional description. */
export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="rounded-xl p-5 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
      <div className="text-3xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
        {value}
      </div>
      <div className="text-sm font-medium text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
        {label}
      </div>
      {description && (
        <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mt-2">
          {description}
        </div>
      )}
    </div>
  );
}
