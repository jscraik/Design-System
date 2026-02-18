import { AppsSDKBadge, AppsSDKButton, AppsSDKInput } from "@design-studio/ui";
import { IconSearch } from "@design-studio/ui/icons";

const badgeBaseClassName =
  "bg-foundation-bg-light-3 text-foundation-text-light-secondary dark:bg-foundation-bg-dark-3 dark:text-foundation-text-dark-secondary";

/**
 * @template
 * id: components-showcase
 * title: Components Showcase
 * description: Lightweight reference for core inputs, badges, and actions.
 * category: components
 * tags: [actions, components, inputs]
 * status: stable
 * entry: ComponentsShowcaseTemplate
 */
export function ComponentsShowcaseTemplate() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Components overview</h2>
          <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Core UI building blocks for Apps SDK surfaces.
          </p>
        </div>
        <AppsSDKButton size="sm" variant="outline">
          View docs
        </AppsSDKButton>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-foundation-bg-light-3 bg-foundation-bg-light-2 p-4 dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-2">
          <p className="text-xs uppercase tracking-wide text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
            Search
          </p>
          <div className="mt-3 flex items-center gap-2">
            <IconSearch className="h-4 w-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
            <AppsSDKInput placeholder="Search templates" />
          </div>
        </div>
        <div className="rounded-2xl border border-foundation-bg-light-3 bg-foundation-bg-light-2 p-4 dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Access status</span>
            <AppsSDKBadge className={badgeBaseClassName}>Active</AppsSDKBadge>
          </div>
          <p className="mt-2 text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Use badges to highlight state changes.
          </p>
          <div className="mt-4 flex gap-2">
            <AppsSDKButton size="sm">Primary</AppsSDKButton>
            <AppsSDKButton size="sm" variant="outline">
              Secondary
            </AppsSDKButton>
          </div>
        </div>
      </div>
    </div>
  );
}
