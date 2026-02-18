import { AppsSDKBadge, AppsSDKButton } from "@design-studio/ui";
import { IconLightBulb } from "@design-studio/ui/icons";

const badgeBaseClassName =
  "bg-foundation-bg-light-3 text-foundation-text-light-secondary dark:bg-foundation-bg-dark-3 dark:text-foundation-text-dark-secondary";

/**
 * @template
 * id: educational-starter
 * title: Educational Starter
 * description: A compact learning hub template with quick actions and lesson highlights.
 * category: educational
 * tags: [education, overview, starter]
 * status: beta
 * entry: EducationalStarterTemplate
 */
export function EducationalStarterTemplate() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            New lesson drop
          </h1>
          <p className="mt-2 text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Build consistent prompts with curated guidance.
          </p>
        </div>
        <AppsSDKBadge className={badgeBaseClassName}>Week 3</AppsSDKBadge>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-foundation-bg-light-3 bg-foundation-bg-light-2 p-5 dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-2">
          <p className="text-xs uppercase tracking-wide text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
            Prompt patterns
          </p>
          <h2 className="mt-2 text-lg font-semibold">Explore prompt variants</h2>
          <p className="mt-2 text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Compare effective instructions and tone shifts.
          </p>
          <AppsSDKButton className="mt-4" size="sm">
            Start lesson
          </AppsSDKButton>
        </div>
        <div className="rounded-2xl border border-foundation-bg-light-3 bg-foundation-bg-light-2 p-5 dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-2">
          <p className="text-xs uppercase tracking-wide text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
            Evaluation
          </p>
          <h2 className="mt-2 text-lg font-semibold">Build a checklist</h2>
          <p className="mt-2 text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Capture the qualities that define great answers.
          </p>
          <AppsSDKButton className="mt-4" size="sm" variant="outline">
            View template
          </AppsSDKButton>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-foundation-bg-light-3 bg-foundation-bg-light-1 p-4 dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-1">
        <IconLightBulb className="h-4 w-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
        <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
          Focus on one change per experiment so you can compare results clearly.
        </p>
      </div>
    </div>
  );
}
