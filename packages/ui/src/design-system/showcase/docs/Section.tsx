interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/** Section displays a titled section with optional description. */
export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
